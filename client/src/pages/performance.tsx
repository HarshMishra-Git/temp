import { Sidebar } from "@/components/ui/sidebar";
import { MobileHeader } from "@/components/ui/mobile-header";
import { PerformanceMetrics } from "@/components/performance-metrics";

export default function Performance() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-[hsl(var(--space-black))]">
        <MobileHeader />
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
              Model Performance
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Detailed metrics and analytics for the YOLOv8 object detection model
            </p>
          </div>
          
          {/* Performance Metrics */}
          <div className="mt-6">
            <PerformanceMetrics />
          </div>
          
          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 pb-6">
            <p>Space Station Object Detection System • Powered by YOLOv8 • &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
