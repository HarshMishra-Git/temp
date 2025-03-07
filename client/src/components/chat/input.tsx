import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me to generate a SQL query..."
        className="min-h-[60px] flex-1"
        disabled={disabled}
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={disabled || !input.trim()}
        className={cn(
          "h-[60px] w-[60px]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
