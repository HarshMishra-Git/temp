import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SampleSchema } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface SchemaVisualizerProps {
  schema: SampleSchema;
  onTableClick?: (tableName: string) => void;
}

export function SchemaVisualizer({ schema, onTableClick }: SchemaVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !schema.tables) return;

    const tables = Object.entries(schema.tables);
    const spacing = 200;
    const centerX = svgRef.current.clientWidth / 2;
    const centerY = svgRef.current.clientHeight / 2;
    const radius = Math.min(centerX, centerY) - 100;

    tables.forEach((_, index) => {
      const angle = (2 * Math.PI * index) / tables.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      // Position tables in a circle
    });
  }, [schema]);

  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <CardHeader>
        <CardTitle>Database Schema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-full">
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <AnimatePresence>
              {Object.entries(schema.tables).map(([tableName, table], index) => (
                <motion.g
                  key={tableName}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="cursor-pointer"
                  onClick={() => onTableClick?.(tableName)}
                >
                  <rect
                    x={100 + index * 200}
                    y={100}
                    width={150}
                    height={30 + Object.keys(table.columns).length * 25}
                    rx={5}
                    className="fill-card stroke-border"
                  />
                  <text
                    x={175 + index * 200}
                    y={120}
                    className="text-sm font-medium fill-foreground text-center"
                    textAnchor="middle"
                  >
                    {tableName}
                  </text>
                  {Object.entries(table.columns).map(([columnName, type], colIndex) => (
                    <text
                      key={columnName}
                      x={110 + index * 200}
                      y={150 + colIndex * 25}
                      className="text-xs fill-muted-foreground"
                    >
                      {columnName}: {type}
                    </text>
                  ))}
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
