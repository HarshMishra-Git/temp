import { Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "justify-end" : "justify-start")}>
      <Card className={cn("max-w-[80%]", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
        <CardContent className="p-3 flex gap-2">
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
