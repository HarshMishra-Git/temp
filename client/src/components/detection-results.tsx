import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DetectionResult, Detection } from "@/types";
import { cn, objectColors, formatDateTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const DetectionBox = ({ detection, imageWidth, imageHeight }: { 
  detection: Detection, 
  imageWidth: number,
  imageHeight: number
}) => {
  const { class: className, confidence, box } = detection;
  const [x, y, width, height] = box;
  
  // Scale the box coordinates to match the display size
  const styles = {
    top: `${y}px`,
    left: `${x}px`,
    width: `${width}px`,
    height: `${height}px`,
    borderColor: className === "Fire Extinguisher" ? "#FC3D21" : 
                 className === "Toolbox" ? "#7C4DFF" : "#00C875"
  };
  
  const labelStyles = {
    background: className === "Fire Extinguisher" ? "#FC3D21" : 
                className === "Toolbox" ? "#7C4DFF" : "#00C875"
  };
  
  return (
    <div className="detection-box" style={styles}>
      <span className="detection-label" style={labelStyles}>
        {className} {Math.round(confidence * 100)}%
      </span>
    </div>
  );
};

export function DetectionResults() {
  const { data: latestResult, isLoading, error } = useQuery<DetectionResult>({
    queryKey: ['/api/results/latest'],
  });
  
  const countByClass = latestResult?.detections.reduce((acc, detection) => {
    acc[detection.class] = (acc[detection.class] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  return (
    <Card>
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle>Latest Detection Result</CardTitle>
        <CardDescription>
          Showing detected objects with bounding boxes
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="relative h-[340px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">Error loading results</p>
            </div>
          ) : !latestResult ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <i className="ri-image-line text-gray-400 text-4xl mb-2"></i>
              <p className="text-gray-500 dark:text-gray-400">No detection results yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Upload an image to see detection results</p>
            </div>
          ) : (
            <>
              <img 
                src={latestResult.imageUrl} 
                alt="Detection result" 
                className="w-full h-full object-cover"
              />
              
              {latestResult.detections.map((detection, index) => (
                <DetectionBox 
                  key={index} 
                  detection={detection}
                  imageWidth={340} // These would need to be dynamically determined
                  imageHeight={340} // based on the actual image dimensions
                />
              ))}
            </>
          )}
        </div>
        
        {/* Detection Details */}
        {latestResult && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Detection Details</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(countByClass).map(([className, count]) => (
                <span 
                  key={className} 
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
                    objectColors[className as keyof typeof objectColors]?.bgLight,
                    objectColors[className as keyof typeof objectColors]?.text
                  )}
                >
                  {className}: {count}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Processed in {latestResult.processingTimeMs}ms • {formatDateTime(latestResult.timestamp)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
