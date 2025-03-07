import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateSQL, validateSQL, generateCodeSnippet, generateQueryTemplate } from "./anthropic";
import { 
  insertMessageSchema, 
  insertSavedQuerySchema,
  insertQueryTemplateSchema,
  insertQueryOptimizationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/messages", async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    const result = insertMessageSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ 
        error: "Invalid message format",
        details: result.error.errors
      });
      return;
    }

    const message = await storage.addMessage(result.data);
    res.json(message);
  });

  app.get("/api/schemas", async (_req, res) => {
    const schemas = await storage.getSampleSchemas();
    res.json(schemas);
  });

  app.get("/api/saved-queries", async (_req, res) => {
    const queries = await storage.getSavedQueries();
    res.json(queries);
  });

  app.post("/api/saved-queries", async (req, res) => {
    const result = insertSavedQuerySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ 
        error: "Invalid query format",
        details: result.error.errors
      });
      return;
    }

    try {
      const query = await storage.addSavedQuery(result.data);
      res.json(query);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Failed to save query",
        message: error.message 
      });
    }
  });

  app.post("/api/generate", async (req, res) => {
    const { prompt, schema, context, relationships, constraints } = req.body;

    if (!prompt || !schema) {
      res.status(400).json({ error: "Missing prompt or schema" });
      return;
    }

    try {
      const result = await generateSQL(prompt, schema, context, relationships, constraints);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/validate", async (req, res) => {
    const { sql, schema, relationships, constraints } = req.body;

    if (!sql || !schema) {
      res.status(400).json({ error: "Missing SQL query or schema" });
      return;
    }

    try {
      const result = await validateSQL(sql, schema, relationships, constraints);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/code-snippet", async (req, res) => {
    const { sql, language, framework } = req.body;

    if (!sql || !language || !framework) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    try {
      const snippet = await generateCodeSnippet(sql, language, framework);
      res.json({ snippet });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/templates", async (_req, res) => {
    const templates = await storage.getQueryTemplates();
    res.json(templates);
  });

  app.post("/api/templates", async (req, res) => {
    const result = insertQueryTemplateSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ 
        error: "Invalid template format",
        details: result.error.errors
      });
      return;
    }

    try {
      const template = await storage.addQueryTemplate(result.data);
      res.json(template);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/export", async (req, res) => {
    const { format, data } = req.body;

    if (!format || !data) {
      res.status(400).json({ error: "Missing format or data" });
      return;
    }

    try {
      const result = await storage.exportData(format, data);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}