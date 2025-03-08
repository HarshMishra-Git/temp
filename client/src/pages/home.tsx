import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/message";
import { ChatInput } from "@/components/chat/input";
import { SQLEditor } from "@/components/sql/editor";
import { QueryHistory } from "@/components/sql/query-history";
import { VisualBuilder } from "@/components/sql/visual-builder";
import { SchemaVisualizer } from "@/components/sql/schema-visualizer";
import { QuerySuggestions } from "@/components/sql/query-suggestions";
import { QueryRating } from "@/components/feedback/query-rating";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Message, SampleSchema, SavedQuery } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CodeSnippet } from "@/components/sql/code-snippet";
import { QueryPerformance } from "@/components/sql/query-performance";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const KEYBOARD_SHORTCUTS = {
  'Ctrl+ENTER': { handler: () => {}, description: 'Send query' },
  'Ctrl+S': { handler: () => {}, description: 'Save query' },
  'Ctrl+K': { handler: () => {}, description: 'Focus chat input' },
  'Ctrl+L': { handler: () => {}, description: 'Clear chat' },
  'Ctrl+D': { handler: () => {}, description: 'Toggle theme' },
};

export default function Home() {
  const [currentSQL, setCurrentSQL] = useState("");
  const [queryName, setQueryName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [lastNaturalQuery, setLastNaturalQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const { toast } = useToast();

  const shortcuts = useKeyboardShortcuts(KEYBOARD_SHORTCUTS);

  // Queries
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"]
  });

  const { data: schemas = [] } = useQuery<SampleSchema[]>({
    queryKey: ["/api/schemas"]
  });

  // Mutations
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

  const exportMutation = useMutation({
    mutationFn: async ({ format, data }: { format: string; data: any }) => {
      const res = await apiRequest("POST", "/api/export", { format, data });
      return res.json();
    },
    onSuccess: (data) => {
      // Create and trigger download
      const blob = new Blob([data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `query-results.${data.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Query results exported successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    },
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

  const handleTableClick = useCallback((tableName: string) => {
    setSelectedTable(tableName);
    handleSend(`Show me all columns from ${tableName}`);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b"
      >
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            SQL Query Generator
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </motion.div>

      <main className="max-w-[1400px] mx-auto p-4">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30}>
            <Tabs defaultValue="chat" className="h-[calc(100vh-200px)]">
              <TabsList className="w-full">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="visual">Visual Builder</TabsTrigger>
                <TabsTrigger value="schema">Schema</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="h-full">
                <div className="h-full flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <ChatMessage message={message} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {(generateMutation.isPending || messageMutation.isPending) && (
                      <LoadingSpinner
                        message="Generating SQL query..."
                        className="my-4"
                      />
                    )}
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

              <TabsContent value="schema">
                {schemas[0] && (
                  <SchemaVisualizer
                    schema={schemas[0]}
                    onTableClick={handleTableClick}
                  />
                )}
              </TabsContent>

              <TabsContent value="history">
                <QueryHistory onSelect={handleQuerySelect} />
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizablePanel defaultSize={70}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Generated SQL</h2>
                {currentSQL && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => exportMutation.mutate({ format: "csv", data: currentSQL })}>
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportMutation.mutate({ format: "json", data: currentSQL })}>
                        Export as JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportMutation.mutate({ format: "sql", data: currentSQL })}>
                        Export as SQL
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

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

              {currentSQL && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <QueryPerformance
                    performance={generateMutation.data?.performance || {}}
                    improvements={generateMutation.data?.improvements || []}
                  />
                  <CodeSnippet sql={currentSQL} />
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

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