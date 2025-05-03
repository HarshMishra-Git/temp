import { Sidebar } from "@/components/ui/sidebar";
import { MobileHeader } from "@/components/ui/mobile-header";
import { StatCard } from "@/components/ui/stat-card";
import { UploadSection } from "@/components/upload-section";
import { DetectionResults } from "@/components/detection-results";
import { PerformanceMetrics } from "@/components/performance-metrics";
import { ActivityFeed } from "@/components/activity-feed";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats } = useQuery<{
    totalDetections: number;
    mAP: number;
    fireExtinguisherAccuracy: number;
    avgProcessingTime: number;
  }>({
    queryKey: ['/api/stats'],
    // Fallback values when API isn't yet available
    placeholderData: {
      totalDetections: 248,
      mAP: 84.7,
      fireExtinguisherAccuracy: 92.3,
      avgProcessingTime: 142
    }
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-[hsl(var(--space-black))]">
        <MobileHeader />
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-5 border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
              AI-Powered Space Station Detection
            </h2>
            <div className="mt-3 flex sm:mt-0 sm:ml-4">
              <Link href="/upload">
                <Button className="bg-[hsl(var(--space-blue))] hover:bg-[hsl(var(--space-blue-800))]">
                  <i className="ri-upload-cloud-line mr-2"></i>
                  New Upload
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon="ri-radar-line"
              iconClass="text-[hsl(var(--space-blue))] dark:text-[hsl(var(--space-blue-200))]"
              iconBgClass="bg-[hsl(var(--space-blue-100))] dark:bg-[hsl(var(--space-blue-900))]"
              title="Total Detections"
              value={stats?.totalDetections || 0}
              linkText="View all detections"
              linkUrl="/history"
              linkClass="text-[hsl(var(--space-blue))] hover:text-[hsl(var(--space-blue-800))] dark:text-[hsl(var(--nebula-violet))] dark:hover:text-[hsl(var(--nebula-violet-light))]"
            />
            
            <StatCard
              icon="ri-bar-chart-box-line"
              iconClass="text-[hsl(var(--nebula-violet))]"
              iconBgClass="bg-[hsl(var(--nebula-violet))] dark:bg-opacity-20 bg-opacity-20"
              title="mAP@0.5"
              value={`${stats?.mAP || 0}%`}
              linkText="View metrics"
              linkUrl="/performance"
              linkClass="text-[hsl(var(--nebula-violet))] hover:text-[hsl(var(--nebula-violet-light))]"
            />
            
            <StatCard
              icon="ri-check-double-line"
              iconClass="text-[hsl(var(--orbit-green))]"
              iconBgClass="bg-[hsl(var(--orbit-green))] bg-opacity-20 dark:bg-opacity-10"
              title="Fire Extinguisher Accuracy"
              value={`${stats?.fireExtinguisherAccuracy || 0}%`}
              linkText="View class details"
              linkUrl="/performance"
              linkClass="text-[hsl(var(--orbit-green))] hover:text-[hsl(var(--orbit-green-light))]"
            />
            
            <StatCard
              icon="ri-time-line"
              iconClass="text-[hsl(var(--cosmic-red))]"
              iconBgClass="bg-[hsl(var(--cosmic-red))] bg-opacity-20 dark:bg-opacity-10"
              title="Avg. Processing Time"
              value={`${stats?.avgProcessingTime || 0}ms`}
              linkText="View performance"
              linkUrl="/performance"
              linkClass="text-[hsl(var(--cosmic-red))] hover:text-[hsl(var(--cosmic-red-light))]"
            />
          </div>

          {/* Recent Uploads & Detection Results */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UploadSection />
            <DetectionResults />
          </div>
          
          {/* Performance Metrics */}
          <div className="mt-8">
            <PerformanceMetrics />
          </div>
          
          {/* Recent Activity Feed */}
          <div className="mt-8">
            <ActivityFeed />
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
