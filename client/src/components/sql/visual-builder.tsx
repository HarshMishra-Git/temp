import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SampleSchema } from "@shared/schema";

interface VisualBuilderProps {
  schema: SampleSchema;
  onGenerate: (query: string) => void;
}

export function VisualBuilder({ schema, onGenerate }: VisualBuilderProps) {
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [conditions, setConditions] = useState<Array<{column: string, operator: string, value: string}>>([]);

  const tables = Object.keys(schema.tables);
  
  const generateQuery = () => {
    let query = `Find ${selectedColumns.join(", ")} from ${selectedTable}`;
    if (conditions.length > 0) {
      query += " where " + conditions.map(c => 
        `${c.column} ${c.operator} ${c.value}`
      ).join(" and ");
    }
    onGenerate(query);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visual Query Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedTable}>
            <SelectTrigger>
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map(table => (
                <SelectItem key={table} value={table}>
                  {table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTable && (
            <>
              <div className="space-y-2">
                <h4 className="font-medium">Select Columns</h4>
                {Object.keys(schema.tables[selectedTable].columns).map(column => (
                  <Button
                    key={column}
                    variant={selectedColumns.includes(column) ? "default" : "outline"}
                    onClick={() => {
                      setSelectedColumns(prev =>
                        prev.includes(column)
                          ? prev.filter(c => c !== column)
                          : [...prev, column]
                      );
                    }}
                    className="mr-2 mb-2"
                  >
                    {column}
                  </Button>
                ))}
              </div>

              <Button onClick={generateQuery}>Generate Query</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
