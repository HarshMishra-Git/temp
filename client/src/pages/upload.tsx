import { Sidebar } from "@/components/ui/sidebar";
import { MobileHeader } from "@/components/ui/mobile-header";
import { UploadSection } from "@/components/upload-section";
import { DetectionResults } from "@/components/detection-results";

export default function Upload() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-[hsl(var(--space-black))]">
        <MobileHeader />
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
              Image Upload & Detection
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload space station images to detect critical objects using our AI system
            </p>
          </div>
          
          {/* Upload & Results Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UploadSection />
            <DetectionResults />
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
