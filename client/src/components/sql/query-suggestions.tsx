import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface QuerySuggestion {
  naturalQuery: string;
  context: string;
}

interface QuerySuggestionsProps {
  suggestions: QuerySuggestion[];
  onSelect: (suggestion: QuerySuggestion) => void;
  className?: string;
}

export function QuerySuggestions({ suggestions, onSelect, className }: QuerySuggestionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Query Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full text-left justify-start h-auto py-2"
                onClick={() => onSelect(suggestion)}
              >
                <span className="line-clamp-2">{suggestion.naturalQuery}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
