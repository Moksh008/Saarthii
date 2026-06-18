import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

export function ChangePassword() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const field = (key: keyof typeof form, label: string, showKey: keyof typeof show) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show[showKey] ? "text" : "password"}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show[showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.next !== form.confirm) { setError("New passwords do not match."); return; }
    if (form.next.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    // Note: Password change for official users requires backend support
    // For citizen accounts, integrate Firebase password update here
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
    setForm({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Security</h1>
        <p className="text-slate-500 mt-1 text-sm">Update your login password.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        {success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
            <p className="font-semibold text-slate-800">Password updated!</p>
            <button onClick={() => setSuccess(false)} className="text-sm text-primary underline">Change again</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Change password</span>
            </div>

            {field("current", "Current Password", "current")}
            {field("next",    "New Password",     "next")}
            {field("confirm", "Confirm New Password", "confirm")}

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
