import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateSQL, validateSQL } from "./anthropic";
import { insertMessageSchema, insertSavedQuerySchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/messages", async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    const result = insertMessageSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid message format" });
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
      res.status(400).json({ error: "Invalid query format" });
      return;
    }

    const query = await storage.addSavedQuery(result.data);
    res.json(query);
  });

  app.post("/api/generate", async (req, res) => {
    const { prompt, schema, context } = req.body;

    if (!prompt || !schema) {
      res.status(400).json({ error: "Missing prompt or schema" });
      return;
    }

    try {
      const sql = await generateSQL(prompt, schema, context);
      res.json({ sql });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/validate", async (req, res) => {
    const { sql, schema } = req.body;

    if (!sql || !schema) {
      res.status(400).json({ error: "Missing SQL query or schema" });
      return;
    }

    try {
      const result = await validateSQL(sql, schema);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}