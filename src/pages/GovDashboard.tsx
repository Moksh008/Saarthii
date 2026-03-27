import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Outlet } from 'react-router-dom';

export function GovDashboard() {

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* Static Background Layer */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/feedback_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 z-0 bg-white/30 pointer-events-none" />

        {/* Scrolling Content Layer */}
        <div className="relative z-10 w-full h-full overflow-y-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
