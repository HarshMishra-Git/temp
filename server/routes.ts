import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateSQL, validateSQL } from "./anthropic";
import { insertMessageSchema } from "@shared/schema";

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

  app.post("/api/generate", async (req, res) => {
    const { prompt, schema, context } = req.body;
    
    if (!prompt || !schema) {
      res.status(400).json({ error: "Missing prompt or schema" });
      return;
    }

    try {
      const sql = await generateSQL(prompt, schema, context);
      res.json({ sql });
    } catch (error) {
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
