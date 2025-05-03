import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileHeader } from "@/components/ui/mobile-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { ActivityLog, ActivityType } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Logs() {
  const [logFilter, setLogFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  
  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['/api/logs'],
  });
  
  const getTypeIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.DETECTION:
        return <i className="ri-image-line text-[hsl(var(--space-blue))]"></i>;
      case ActivityType.MODEL_UPDATE:
        return <i className="ri-refresh-line text-[hsl(var(--orbit-green))]"></i>;
      case ActivityType.ALERT:
        return <i className="ri-alert-line text-[hsl(var(--cosmic-red))]"></i>;
      default:
        return <i className="ri-information-line text-gray-500"></i>;
    }
  };
  
  const filteredLogs = logs?.filter(log => {
    const matchesFilter = logFilter === "all" || log.type === logFilter;
    const matchesSearch = search === "" || 
      log.title.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-[hsl(var(--space-black))]">
        <MobileHeader />
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
              System Logs
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              View and manage system activity logs
            </p>
          </div>
          
          {/* Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Select 
              value={logFilter} 
              onValueChange={setLogFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value={ActivityType.DETECTION}>Detections</SelectItem>
                <SelectItem value={ActivityType.MODEL_UPDATE}>Model Updates</SelectItem>
                <SelectItem value={ActivityType.ALERT}>Alerts</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="search"
              placeholder="Search logs..."
              className="w-full sm:max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            
            <div className="flex-1 flex justify-end">
              <Button variant="outline" size="sm" className="ml-auto">
                <i className="ri-download-line mr-1.5"></i>
                Export Logs
              </Button>
            </div>
          </div>
          
          {/* Logs Table */}
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>
                  Complete system activity records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : !filteredLogs || filteredLogs.length === 0 ? (
                  <div className="py-12 text-center">
                    <i className="ri-file-list-3-line text-5xl text-gray-300 dark:text-gray-600 mb-3"></i>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No logs found</h3>
                    {search || logFilter !== "all" ? (
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter settings
                      </p>
                    ) : (
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        System activity logs will appear here
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {getTypeIcon(log.type)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {log.title}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-md truncate">
                              {log.description}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDateTime(log.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
