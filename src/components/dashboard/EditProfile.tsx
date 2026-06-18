import { useEffect, useState } from "react";
import { User, Phone, Mail, MapPin, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import apiFetch from "@/lib/api";

export function EditProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        name:    user.name    || "",
        phone:   user.phone   || "",
        address: user.address || "",
        city:    user.city    || "",
        state:   user.state   || "",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/auth/me/update", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
        <p className="text-slate-500 mt-1 text-sm">Update your personal information.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{user?.name || "User"}</p>
            <p className="text-sm text-slate-500 capitalize">{user?.role?.replace("_", " ")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input className={`${inputCls} pl-9`} value={form.name} onChange={set("name")} placeholder="Your name" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input className={`${inputCls} pl-9`} value={form.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className={`${inputCls} pl-9 bg-slate-50 text-slate-400 cursor-not-allowed`} value={user?.email || ""} disabled />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className={`${inputCls} pl-9`} value={form.address} onChange={set("address")} placeholder="Street address" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">City</label>
              <input className={inputCls} value={form.city} onChange={set("city")} placeholder="City" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">State</label>
              <input className={inputCls} value={form.state} onChange={set("state")} placeholder="State" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Pincode</label>
              <input className={inputCls} value={form.pincode} onChange={set("pincode")} placeholder="110001" maxLength={6} />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 text-sm">
              <CheckCircle className="h-4 w-4" /> Profile updated successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
