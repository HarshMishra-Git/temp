import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const SUPPORTED_LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
];

const FRAMEWORKS = {
  python: ["Django", "Flask", "SQLAlchemy"],
  javascript: ["Node.js", "Express", "Prisma"],
  typescript: ["TypeORM", "Prisma", "Drizzle"],
  java: ["Spring", "Hibernate", "JDBC"],
};

interface CodeSnippetProps {
  sql: string;
}

export function CodeSnippet({ sql }: CodeSnippetProps) {
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0].value);
  const [framework, setFramework] = useState(FRAMEWORKS[language][0]);
  const [snippet, setSnippet] = useState("");
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/code-snippet", {
        sql,
        language,
        framework,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setSnippet(data.snippet);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast({
        title: "Copied!",
        description: "Code snippet copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Snippet Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={framework} onValueChange={setFramework}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                {FRAMEWORKS[language].map((fw) => (
                  <SelectItem key={fw} value={fw}>
                    {fw}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              Generate
            </Button>
          </div>

          {snippet && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                <code className="text-sm">{snippet}</code>
              </pre>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
