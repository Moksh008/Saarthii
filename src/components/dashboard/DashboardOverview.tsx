import { FileText, MessageSquareWarning, Activity, ShieldCheck } from "lucide-react";
import { AlertBanner } from "./shared/AlertBanner";

export function DashboardOverview() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Citizen Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back. Here is an overview of your civic engagements and applications.</p>
      </div>

      <AlertBanner 
        title="⚠️ High number of complaints in Sector 12" 
        message="We are currently tracking a localized spike in water pressure issues in Sector 12. Engineering teams have been deployed to assess the main pipeline." 
        type="warning" 
      />

      {/* Quick Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="size-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <FileText className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Grievances</p>
            <h3 className="text-2xl font-bold text-slate-900">11</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="size-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Resolved Grievances</p>
            <h3 className="text-2xl font-bold text-slate-900">7</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="size-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
            <MessageSquareWarning className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Grievances</p>
            <h3 className="text-2xl font-bold text-slate-900">4</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="size-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <Activity className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Recent Actions</p>
            <h3 className="text-2xl font-bold text-slate-900">12</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Recent Grievances</h2>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Pothole Repair Request - Sector 4</h4>
                  <p className="text-xs text-slate-500 mt-1">Submitted on 20 Mar 2026</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Under Review</span>
              </div>
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Streetlight Maintenance</h4>
                  <p className="text-xs text-slate-500 mt-1">Submitted on 15 Feb 2026</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Resolved</span>
              </div>
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Garbage Collection Issue</h4>
                  <p className="text-xs text-slate-500 mt-1">Submitted on 22 Mar 2026</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
            <h3 className="text-primary font-bold mb-2">AI Assistant (Saarthii)</h3>
            <p className="text-sm text-slate-600 mb-4">Saarthii AI Assistant is ready to help you navigate through your civic duties.</p>
            <button className="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
              Start AI Assistance
            </button>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Announcements</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Government Update: Property Tax</p>
                  <p className="text-xs text-slate-500 mt-0.5">Last date for property tax submission extended to 15th April.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Public Notice: Road Maintenance</p>
                  <p className="text-xs text-slate-500 mt-0.5">Expect disruptions on Main Street from 10 PM to 6 AM.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Service Alert: E-Governance Portal</p>
                  <p className="text-xs text-slate-500 mt-0.5">The CPENGRAMS portal will undergo scheduled maintenance this Sunday.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
