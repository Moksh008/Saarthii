

export type GrievanceStatus = 'Pending' | 'Under Review' | 'Resolved';

export function StatusBadge({ status }: { status: GrievanceStatus }) {
  const getStyles = () => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Under Review': return 'bg-blue-100 text-blue-700';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStyles()}`}>
      {status}
    </span>
  );
}
