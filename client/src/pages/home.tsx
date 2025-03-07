import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/message";
import { ChatInput } from "@/components/chat/input";
import { SQLEditor } from "@/components/sql/editor";
import { QueryHistory } from "@/components/sql/query-history";
import { VisualBuilder } from "@/components/sql/visual-builder";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Message, SampleSchema, SavedQuery } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentSQL, setCurrentSQL] = useState("");
  const [queryName, setQueryName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [lastNaturalQuery, setLastNaturalQuery] = useState("");
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
      const schema = schemas[0]?.tables;

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

  const saveQueryMutation = useMutation({
    mutationFn: async (query: { name: string, naturalQuery: string, sqlQuery: string }) => {
      const res = await apiRequest("POST", "/api/saved-queries", query);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-queries"] });
      toast({
        title: "Success",
        description: "Query saved successfully",
      });
      setQueryName(""); 
      setSaveDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error Saving Query",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSend = async (message: string) => {
    try {
      setLastNaturalQuery(message); 
      await messageMutation.mutateAsync(message);
      await generateMutation.mutateAsync(message);
    } catch (error) {
      console.error("Failed to process message:", error);
    }
  };

  const handleSaveQuery = () => {
    if (!currentSQL || !lastNaturalQuery) {
      toast({
        title: "Error",
        description: "Please generate a SQL query first",
        variant: "destructive"
      });
      return;
    }

    if (!queryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query name",
        variant: "destructive"
      });
      return;
    }

    saveQueryMutation.mutate({
      name: queryName.trim(),
      naturalQuery: lastNaturalQuery,
      sqlQuery: currentSQL
    });
  };

  const handleQuerySelect = (query: SavedQuery) => {
    setCurrentSQL(query.sqlQuery);
    handleSend(query.naturalQuery);
  };

  return (
    <div className="h-screen p-4 bg-background">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">SQL Query Generator</h1>
        <ThemeToggle />
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30}>
          <Tabs defaultValue="chat">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="visual">Visual Builder</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="h-[calc(100vh-180px)]">
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
            </TabsContent>

            <TabsContent value="visual">
              {schemas[0] && (
                <VisualBuilder 
                  schema={schemas[0]} 
                  onGenerate={handleSend}
                />
              )}
            </TabsContent>

            <TabsContent value="history">
              <QueryHistory onSelect={handleQuerySelect} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizablePanel defaultSize={70}>
          <SQLEditor 
            value={currentSQL}
            readOnly
            onSave={() => {
              if (!currentSQL || !lastNaturalQuery) {
                toast({
                  title: "Error",
                  description: "Please generate a SQL query first",
                  variant: "destructive"
                });
                return;
              }
              setSaveDialogOpen(true);
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Query</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Query name"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
            />
            <Button 
              onClick={handleSaveQuery}
              disabled={!queryName.trim() || saveQueryMutation.isPending}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}