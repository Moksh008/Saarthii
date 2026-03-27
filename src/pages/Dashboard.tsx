import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Outlet } from 'react-router-dom';
import ShapeGrid from '@/components/ui/ShapeGrid';

export function Dashboard() {
  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* Dynamic Background Layer */}
        <div className="absolute inset-0 z-0 bg-white">
          <ShapeGrid 
            direction="diagonal"
            borderColor="rgba(249, 115, 22, 0.3)" /* Tailwind orange-500 with 30% opacity */
            hoverFillColor="rgba(249, 115, 22, 0.8)" /* Bright orange on hover */
            squareSize={40}
            shape="square"
            speed={0.5}
            hoverTrailAmount={1}
          />
        </div>

        {/* Scrolling Content Layer */}
        <div className="relative z-10 w-full h-full overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
