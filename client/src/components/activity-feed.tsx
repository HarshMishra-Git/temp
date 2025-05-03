import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityLog, ActivityType } from "@/types";
import { formatTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export function ActivityFeed() {
  const { data: activities, isLoading, error } = useQuery<ActivityLog[]>({
    queryKey: ['/api/logs/recent'],
  });
  
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.DETECTION:
        return <i className="ri-image-line text-[hsl(var(--space-blue))] dark:text-[hsl(var(--nebula-violet))] p-1 rounded-full bg-[hsl(var(--space-blue-100))] dark:bg-[hsl(var(--space-blue-900))]"></i>;
      case ActivityType.MODEL_UPDATE:
        return <i className="ri-refresh-line text-[hsl(var(--orbit-green))] p-1 rounded-full bg-[hsl(var(--orbit-green))] bg-opacity-20 dark:bg-opacity-10"></i>;
      case ActivityType.ALERT:
        return <i className="ri-alert-line text-[hsl(var(--cosmic-red))] p-1 rounded-full bg-[hsl(var(--cosmic-red))] bg-opacity-20 dark:bg-opacity-10"></i>;
      default:
        return <i className="ri-information-line text-gray-500 p-1 rounded-full bg-gray-200 dark:bg-gray-700"></i>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          System logs and detection history
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-destructive">Error loading activity logs</p>
          </div>
        ) : !activities || activities.length === 0 ? (
          <div className="py-8 text-center">
            <i className="ri-history-line text-4xl text-gray-300 dark:text-gray-600 mb-2"></i>
            <p className="text-gray-500 dark:text-gray-400">No activity logs yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <li key={activity.id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-6">
          <Link href="/logs">
            <Button 
              variant="outline" 
              className="w-full"
            >
              View all activity
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
