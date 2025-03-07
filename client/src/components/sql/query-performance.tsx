import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface QueryPerformanceProps {
  performance: {
    executionTime?: number;
    rowsAffected?: number;
    indexUsage?: string[];
    costEstimate?: number;
  };
  improvements: string[];
}

export function QueryPerformance({ performance, improvements }: QueryPerformanceProps) {
  const performanceData = [
    { name: "Execution Time", value: performance.executionTime || 0 },
    { name: "Rows Affected", value: performance.rowsAffected || 0 },
    { name: "Cost Estimate", value: performance.costEstimate || 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Query Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {performance.indexUsage && performance.indexUsage.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Index Usage</h4>
              <div className="flex flex-wrap gap-2">
                {performance.indexUsage.map((index, i) => (
                  <Badge key={i} variant="secondary">{index}</Badge>
                ))}
              </div>
            </div>
          )}

          {improvements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-sm font-medium mb-2">Optimization Suggestions</h4>
              <ul className="space-y-2">
                {improvements.map((improvement, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-sm text-muted-foreground"
                  >
                    • {improvement}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
