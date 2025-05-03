import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileHeader } from "@/components/ui/mobile-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { DetectionResult } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const [search, setSearch] = useState("");
  
  const { data: detections, isLoading } = useQuery<DetectionResult[]>({
    queryKey: ['/api/results'],
  });
  
  const filteredDetections = detections?.filter(detection => 
    detection.fileName.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-[hsl(var(--space-black))]">
        <MobileHeader />
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-5 border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                Detection History
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View all previous space station image analysis results
              </p>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <Input
                type="search"
                placeholder="Search by file name..."
                className="w-full sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          {/* History List */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detection Results</CardTitle>
                <CardDescription>
                  All processed images and their detection results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : !filteredDetections || filteredDetections.length === 0 ? (
                  <div className="py-12 text-center">
                    <i className="ri-file-search-line text-5xl text-gray-300 dark:text-gray-600 mb-3"></i>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No detection results found</h3>
                    {search ? (
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Try adjusting your search or clear it to see all results
                      </p>
                    ) : (
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Upload some images to see detection results
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDetections.map((detection) => (
                      <Card key={detection.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={detection.imageUrl} 
                            alt={`Detection result ${detection.id}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {detection.fileName}
                          </h4>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {formatDateTime(detection.timestamp)}
                          </p>
                          <div className="mt-2 text-xs">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              {detection.detections.length} objects detected
                            </span>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
