import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Outlet } from 'react-router-dom';

export function GovDashboard() {

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
