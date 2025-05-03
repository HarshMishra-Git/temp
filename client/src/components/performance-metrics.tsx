import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ModelMetrics } from "@/types";
import { objectColors } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function PerformanceMetrics() {
  const [activeTab, setActiveTab] = useState("map");
  
  const { data: metrics, isLoading, error, refetch } = useQuery<ModelMetrics>({
    queryKey: ['/api/metrics/latest'],
  });
  
  const handleExport = () => {
    if (!metrics) return;
    
    // Create CSV data for export
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Class,Precision,Recall,F1-Score,mAP\n";
    
    metrics.classMetrics.forEach(metric => {
      csvContent += `${metric.className},${metric.precision},${metric.recall},${metric.f1Score},${metric.mAP}\n`;
    });
    
    // Create and click download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `metrics-${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const mapChartData = metrics?.classMetrics.map(metric => ({
    name: metric.className,
    mAP: Math.round(metric.mAP * 100),
    color: metric.className === "Fire Extinguisher" ? "#FC3D21" : 
           metric.className === "Toolbox" ? "#7C4DFF" : "#00C875"
  })) || [];
  
  return (
    <Card>
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap sm:flex-nowrap">
        <div>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Model evaluation and performance analytics
          </CardDescription>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={isLoading || !metrics}
          >
            <i className="ri-download-line mr-1.5"></i>
            Export
          </Button>
          <Button 
            size="sm" 
            className="bg-[hsl(var(--space-blue))] hover:bg-[hsl(var(--space-blue-800))]"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <i className={`ri-refresh-line mr-1.5 ${isLoading ? 'animate-spin' : ''}`}></i>
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2 border-b border-gray-200 dark:border-gray-700">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map">mAP & Precision</TabsTrigger>
            <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
            <TabsTrigger value="failure">Failure Analysis</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-5">
          <TabsContent value="map" className="mt-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Chart Visualization */}
              <Card>
                <CardContent className="pt-5">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    mAP by Object Class
                  </h4>
                  
                  {isLoading ? (
                    <div className="h-48">
                      <Skeleton className="w-full h-full" />
                    </div>
                  ) : error ? (
                    <div className="h-48 flex items-center justify-center">
                      <p className="text-destructive">Error loading metrics</p>
                    </div>
                  ) : !metrics ? (
                    <div className="h-48 flex items-center justify-center">
                      <p className="text-gray-500">No metrics available</p>
                    </div>
                  ) : (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={mapChartData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis type="category" dataKey="name" />
                          <Tooltip formatter={(value) => [`${value}%`, "mAP"]} />
                          <Bar 
                            dataKey="mAP" 
                            fill="#8884d8" 
                            background={{ fill: '#eee' }}
                            radius={[0, 4, 4, 0]}
                          >
                            {mapChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  {metrics && (
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {new Date(metrics.timestamp).toLocaleString()} 
                      from latest model training
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Precision & Recall Metrics */}
              <Card>
                <CardContent className="pt-5">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Precision & Recall Metrics
                  </h4>
                  
                  {isLoading ? (
                    <Skeleton className="w-full h-48" />
                  ) : error ? (
                    <div className="h-48 flex items-center justify-center">
                      <p className="text-destructive">Error loading metrics</p>
                    </div>
                  ) : !metrics ? (
                    <div className="h-48 flex items-center justify-center">
                      <p className="text-gray-500">No metrics available</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Class
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Precision
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Recall
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              F1-Score
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[hsl(var(--space-black))] divide-y divide-gray-200 dark:divide-gray-700">
                          {metrics.classMetrics.map((metric, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {metric.className}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {metric.precision.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {metric.recall.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {metric.f1Score.toFixed(2)}
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
          </TabsContent>
          
          <TabsContent value="confusion" className="mt-0">
            <div className="flex flex-col items-center justify-center p-8">
              <i className="ri-bar-chart-box-line text-5xl text-gray-400 dark:text-gray-600 mb-3"></i>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Confusion Matrix</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                Visual representation of model predictions vs. actual labels.
                <br />Coming soon in the next update.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="failure" className="mt-0">
            <div className="flex flex-col items-center justify-center p-8">
              <i className="ri-error-warning-line text-5xl text-gray-400 dark:text-gray-600 mb-3"></i>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Failure Analysis</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                Detailed analysis of incorrect detections and failure cases.
                <br />Coming soon in the next update.
              </p>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
