import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/message";
import { ChatInput } from "@/components/chat/input";
import { SQLEditor } from "@/components/sql/editor";
import { apiRequest } from "@/lib/queryClient";
import type { Message, SampleSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [currentSQL, setCurrentSQL] = useState("");
  const { toast } = useToast();

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"]
  });

  const { data: schemas = [] } = useQuery<SampleSchema[]>({
    queryKey: ["/api/schemas"]
  });

  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const context = messages.map(m => m.content);
      const schema = schemas[0]?.tables; // Using first schema for simplicity

      if (!schema) {
        throw new Error("No schema available");
      }

      const res = await apiRequest("POST", "/api/generate", {
        prompt,
        schema,
        context
      });

      const data = await res.json();
      if (!data.sql) {
        throw new Error("No SQL generated");
      }
      return data;
    },
    onSuccess: (data) => {
      setCurrentSQL(data.sql);
      toast({
        title: "Success",
        description: "SQL query generated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Generating SQL",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const messageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", {
        role: "user",
        content
      });
      return res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Error Saving Message",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSend = async (message: string) => {
    try {
      await messageMutation.mutateAsync(message);
      await generateMutation.mutateAsync(message);
    } catch (error) {
      console.error("Failed to process message:", error);
    }
  };

  return (
    <div className="h-screen p-4 bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </ScrollArea>
            <div className="pt-4">
              <ChatInput 
                onSend={handleSend}
                disabled={generateMutation.isPending || messageMutation.isPending}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizablePanel defaultSize={50}>
          <SQLEditor 
            value={currentSQL}
            readOnly
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}