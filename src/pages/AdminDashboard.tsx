import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiFetch from '@/lib/api';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  Briefcase, 
  MapPin, 
  Building2, 
  LogOut,
  Search,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  TrendingUp,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Role = 'citizen' | 'officer' | 'mc' | 'ministry' | 'mp_mla' | 'admin';

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  auth0_id?: string;
  [key: string]: any;
}

interface Stats {
  citizen: number;
  officer: number;
  mc: number;
  mp_mla: number;
  ministry: number;
  admin: number;
  total: number;
}

interface PlatformStats {
  total_complaints: number;
  resolved_complaints: number;
  pending_complaints: number;
  resolution_rate: number;
}

interface Complaint {
  _id: string;
  title: string;
  status: string;
  created_at: string;
  city?: string;
}

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Role | 'overview' | 'all' | 'grievances'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({ role: 'officer' });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchInitialData();
    }
  }, [user]);

  useEffect(() => {
    const roleTabs: string[] = ['citizen', 'officer', 'mc', 'mp_mla', 'ministry', 'all'];
    if (roleTabs.includes(activeTab) && user && user.role === 'admin') {
      if (activeTab === 'all') {
        fetchAllUsers();
      } else {
        fetchUsers(activeTab as Role);
      }
    }
  }, [activeTab, user]);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/admin/users`);
      setUsers(data);
    } catch (err) {
      console.error(`Failed to fetch all users`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [uStats, pStats, recentC, recentU] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/platform-stats'),
        apiFetch('/admin/recent-complaints'),
        apiFetch('/admin/recent-users')
      ]);
      setStats(uStats);
      setPlatformStats(pStats);
      setRecentComplaints(recentC);
      setRecentUsers(recentU);
    } catch (err) {
      console.error('Failed to fetch initial data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (role: Role) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/admin/users?role=${role}`);
      setUsers(data);
    } catch (err) {
      console.error(`Failed to fetch ${role} users`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(u => u._id !== userId));
      fetchInitialData();
      setMessage({ type: 'success', text: 'User deleted successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete user' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify(newUser)
      });
      if (activeTab === newUser.role) {
        setUsers([data, ...users]);
      }
      fetchInitialData();
      setIsAddModalOpen(false);
      setNewUser({ role: 'officer' });
      setMessage({ type: 'success', text: 'User created successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create user' });
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'all', label: 'All Users', icon: Users },
    { id: 'divider', label: '', type: 'divider' },
    { id: 'citizen', label: 'Citizens', icon: Users },
    { id: 'officer', label: 'Officers', icon: Briefcase },
    { id: 'mc', label: 'MC Members', icon: Building2 },
    { id: 'mp_mla', label: 'MP / MLA', icon: MapPin },
    { id: 'ministry', label: 'Ministry', icon: Shield },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-30">
        <div className="p-6">
          <div className="text-xl font-black tracking-tight text-white mb-1">Saarthii Admin</div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Superadmin Control</div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              tab.type === 'divider' ? (
                <div key={tab.id} className="h-px bg-slate-800 my-4 mx-2 opacity-20"></div>
              ) : (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {Icon && <Icon size={18} />}
                  {tab.label}
                </button>
              )
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800/50 rounded-2xl p-4 mb-4 border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1">Logged in as</div>
            <div className="text-sm font-bold truncate">{user?.name}</div>
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Superadmin</div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Platform-wide governance and user management</p>
          </div>

          {!['overview', 'citizen', 'all'].includes(activeTab) && (
            <Button 
              onClick={() => {
                setNewUser({ ...newUser, role: activeTab as Role });
                setIsAddModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 px-6 gap-2 shadow-xl shadow-blue-200"
            >
              <Plus size={20} />
              Add {tabs.find(t => t.id === activeTab)?.label.split(' ')[0]}
            </Button>
          )}
        </header>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}

        {/* Content Tabs */}
        {activeTab === 'overview' ? (
          <div className="space-y-8">
            {/* User Stats */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-blue-500" />
                User Distribution
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard label="Total Users" value={stats?.total || 0} icon={Users} color="bg-blue-600" onClick={() => setActiveTab('citizen')} />
                <StatCard label="Citizens" value={stats?.citizen || 0} icon={Users} color="bg-emerald-500" onClick={() => setActiveTab('citizen')} />
                <StatCard label="Officers" value={stats?.officer || 0} icon={Briefcase} color="bg-orange-500" onClick={() => setActiveTab('officer')} />
                <StatCard label="MC Members" value={stats?.mc || 0} icon={Building2} color="bg-cyan-500" onClick={() => setActiveTab('mc')} />
                <StatCard label="MPs / MLAs" value={stats?.mp_mla || 0} icon={MapPin} color="bg-purple-500" onClick={() => setActiveTab('mp_mla')} />
                <StatCard label="Ministry" value={stats?.ministry || 0} icon={Shield} color="bg-indigo-500" onClick={() => setActiveTab('ministry')} />
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Platform Stats */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-500" />
                  Platform Performance
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4"><FileText size={20} /></div>
                    <div className="text-2xl font-black text-slate-900">{platformStats?.total_complaints || 0}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grievances Filed</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-4"><TrendingUp size={20} /></div>
                    <div className="text-2xl font-black text-slate-900">{platformStats?.resolution_rate || 0}%</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolution Rate</div>
                  </div>
                </div>

                 {/* Recent Grievances (Compressed) */}
                 <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                     <span className="text-xs font-black uppercase tracking-widest text-slate-500">Recent Grievances</span>
                     <Clock size={14} className="text-slate-400" />
                   </div>
                   <div className="divide-y divide-slate-100">
                     {recentComplaints.slice(0, 4).map(c => (
                       <div key={c._id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                         <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{c.title}</span>
                           <span className="text-[10px] text-slate-400 font-medium">{new Date(c.created_at).toLocaleDateString()}</span>
                         </div>
                         <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           c.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                         }`}>
                           {c.status}
                         </span>
                       </div>
                     ))}
                   </div>
                 </div>
              </section>

              {/* Recent Users List */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck size={20} className="text-emerald-500" />
                  Recent User Activity
                </h2>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                     <span className="text-xs font-black uppercase tracking-widest text-slate-500">LATEST REGISTRATIONS</span>
                     <Users size={14} className="text-slate-400" />
                   </div>
                   <table className="w-full text-left">
                     <tbody className="divide-y divide-slate-100">
                       {recentUsers.map(u => (
                         <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                             <div className="text-sm font-bold text-slate-800">{u.name}</div>
                             <div className="text-[10px] text-slate-400 font-medium">{u.email}</div>
                           </td>
                           <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600`}>
                              {u.role}
                            </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                             <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors" onClick={() => setActiveTab(u.role)}>
                               <ChevronRight size={18} />
                             </button>
                           </td>
                         </tr>
                       ))}
                       {recentUsers.length === 0 && (
                         <tr><td className="p-12 text-center text-slate-400 italic">No recent signups</td></tr>
                       )}
                     </tbody>
                   </table>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden text-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  placeholder={`Search ${activeTab}s...`}
                  className="pl-10 h-11 bg-white rounded-xl border-slate-200 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="text-sm font-medium text-slate-500">
                Found {filteredUsers.length} {activeTab}s
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 text-center text-slate-400 animate-pulse font-medium">Fetching records...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="text-slate-300 mb-2 flex justify-center"><Users size={48} /></div>
                  <div className="text-slate-400 font-medium">No users found in this category</div>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="text-[10px] uppercase tracking-wider text-slate-400 font-black bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Role / ID</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(u => (
                      <tr key={u._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-600">{u.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 w-fit">
                              {u.role}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                              ID: {u._id.slice(-8).toUpperCase()}
                            </span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="text-blue-600" size={24} />
                Create New {newUser.role?.toUpperCase()} Account
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</Label>
                  <Input required value={newUser.name || ''} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="e.g. Rahul Sharma" className="h-12 border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</Label>
                  <Input required type="email" value={newUser.email || ''} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="rahul@example.com" className="h-12 border-slate-200 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Phone Number</Label>
                  <Input value={newUser.phone || ''} onChange={e => setNewUser({...newUser, phone: e.target.value})} placeholder="10-digit number" className="h-12 border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Employee ID / Serial No.</Label>
                  <Input required value={newUser.employee_id || ''} onChange={e => setNewUser({...newUser, employee_id: e.target.value})} placeholder="EMP-12345" className="h-12 border-slate-200 rounded-xl" />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  Role Specific Fields
                </div>

                {(newUser.role === 'officer' || newUser.role === 'mc') && (
                  <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Department</Label>
                      <Input required value={newUser.department || ''} onChange={e => setNewUser({...newUser, department: e.target.value})} placeholder="e.g. Public Works" className="bg-white border-slate-200 rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">City / Jurisdiction</Label>
                      <Input required value={newUser.city || ''} onChange={e => setNewUser({...newUser, city: e.target.value})} placeholder="e.g. Delhi" className="bg-white border-slate-200 rounded-xl h-11" />
                    </div>
                  </div>
                )}

                {newUser.role === 'mp_mla' && (
                  <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Constituency</Label>
                      <Input required value={newUser.constituency || ''} onChange={e => setNewUser({...newUser, constituency: e.target.value})} placeholder="Central" className="bg-white border-slate-200 rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">State</Label>
                      <Input required value={newUser.state || ''} onChange={e => setNewUser({...newUser, state: e.target.value})} placeholder="Delhi" className="bg-white border-slate-200 rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Party</Label>
                      <Input required value={newUser.party_name || ''} onChange={e => setNewUser({...newUser, party_name: e.target.value})} placeholder="BJP/INC/..." className="bg-white border-slate-200 rounded-xl h-11" />
                    </div>
                  </div>
                )}

                {newUser.role === 'ministry' && (
                  <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ministry</Label>
                      <Input required value={newUser.ministry_name || ''} onChange={e => setNewUser({...newUser, ministry_name: e.target.value})} placeholder="e.g. Finance" className="bg-white border-slate-200 rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Designation</Label>
                      <Input required value={newUser.designation || ''} onChange={e => setNewUser({...newUser, designation: e.target.value})} placeholder="e.g. Joint Secretary" className="bg-white border-slate-200 rounded-xl h-11" />
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest mt-4 shadow-xl shadow-blue-200 text-sm">
                Register System Account
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-blue-300 transition-all cursor-pointer active:scale-95"
    >
      <div className={`p-3 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
        <div className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{value}</div>
      </div>
    </div>
  );
}
