import { TwoLevelSidebar } from '@/components/sidebar-component';
import { Outlet } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <div className="hidden md:block">
        <TwoLevelSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
