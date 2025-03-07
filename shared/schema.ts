import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const sampleSchemas = pgTable("sample_schemas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tables: json("tables").notNull()
});

export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true,
  timestamp: true 
});

export const insertSchemaSchema = createInsertSchema(sampleSchemas).omit({
  id: true
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type SampleSchema = typeof sampleSchemas.$inferSelect;
export type InsertSchema = z.infer<typeof insertSchemaSchema>;
