import { pgTable, text, serial, json, timestamp, integer } from "drizzle-orm/pg-core";
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

export const savedQueries = pgTable("saved_queries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  naturalQuery: text("natural_query").notNull(),
  sqlQuery: text("sql_query").notNull(),
  rating: integer("rating"),
  feedback: text("feedback"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const querySuggestions = pgTable("query_suggestions", {
  id: serial("id").primaryKey(),
  naturalQuery: text("natural_query").notNull(),
  context: text("context").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true,
  timestamp: true 
});

export const insertSchemaSchema = createInsertSchema(sampleSchemas).omit({
  id: true
});

export const insertSavedQuerySchema = createInsertSchema(savedQueries).omit({
  id: true,
  timestamp: true,
  rating: true,
  feedback: true
});

export const insertQuerySuggestionSchema = createInsertSchema(querySuggestions).omit({
  id: true,
  timestamp: true
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type SampleSchema = typeof sampleSchemas.$inferSelect;
export type InsertSchema = z.infer<typeof insertSchemaSchema>;
export type SavedQuery = typeof savedQueries.$inferSelect;
export type InsertSavedQuery = z.infer<typeof insertSavedQuerySchema>;
export type QuerySuggestion = typeof querySuggestions.$inferSelect;
export type InsertQuerySuggestion = z.infer<typeof insertQuerySuggestionSchema>;