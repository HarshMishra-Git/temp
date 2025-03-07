import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  message?: string;
}

export function LoadingSpinner({ className, size = "md", message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={cn("text-primary", sizeClasses[size])} />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
