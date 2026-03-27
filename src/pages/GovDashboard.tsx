import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Outlet } from 'react-router-dom';

export function GovDashboard() {

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 w-full h-full overflow-y-auto bg-white p-8">
          <Outlet />
      </div>
    </div>
  );
}
