import { useQuery, useMutation } from "@tanstack/react-query";
import { SavedQuery } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface QueryHistoryProps {
  onSelect: (query: SavedQuery) => void;
}

export function QueryHistory({ onSelect }: QueryHistoryProps) {
  const { data: savedQueries = [] } = useQuery<SavedQuery[]>({
    queryKey: ["/api/saved-queries"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Query History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {savedQueries.map((query) => (
            <div
              key={query.id}
              className="mb-4 p-3 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => onSelect(query)}
            >
              <p className="font-medium mb-1">{query.name}</p>
              <p className="text-sm text-muted-foreground">{query.naturalQuery}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(query.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
