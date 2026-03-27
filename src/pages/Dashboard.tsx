import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Outlet } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden bg-[#e8eaed]">
        {/* Scrolling Content Layer */}
        <div className="w-full h-full overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
