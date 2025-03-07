import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface QueryRatingProps {
  onSubmit: (rating: number, feedback: string) => void;
  className?: string;
}

export function QueryRating({ onSubmit, className }: QueryRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmit(rating, feedback);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn("text-center p-4", className)}
      >
        <p className="text-green-600 dark:text-green-400">Thank you for your feedback!</p>
      </motion.div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Rate this Query</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <Button
                key={value}
                variant="ghost"
                size="icon"
                onClick={() => setRating(value)}
                className={cn(
                  "transition-all",
                  rating >= value ? "text-yellow-500" : "text-gray-300"
                )}
              >
                <Star className="h-6 w-6 fill-current" />
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Your feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full"
          >
            Submit Feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
