import { pgTable, text, serial, json, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  context: json("context").default('{}'), // Store context info for better responses
});

export const sampleSchemas = pgTable("sample_schemas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tables: json("tables").notNull(),
  relationships: json("relationships").default('{}'), // Store table relationships
  constraints: json("constraints").default('{}'), // Store table constraints
});

export const savedQueries = pgTable("saved_queries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  naturalQuery: text("natural_query").notNull(),
  sqlQuery: text("sql_query").notNull(),
  rating: integer("rating"),
  feedback: text("feedback"),
  performance: json("performance").default('{}'), // Store query performance metrics
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  annotations: json("annotations").default('[]'), // Store collaborative annotations
  template: text("is_template").default('false'), // Mark as reusable template
  tags: text("tags").array().default([]), // Categorize queries
  creator: text("creator").default('system'), // Track query creators
  shared: text("is_shared").default('false'), // Control sharing
});

export const queryTemplates = pgTable("query_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  template: text("template").notNull(),
  category: text("category").notNull(),
  usageCount: integer("usage_count").default(0),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const queryOptimizations = pgTable("query_optimizations", {
  id: serial("id").primaryKey(),
  originalQuery: text("original_query").notNull(),
  optimizedQuery: text("optimized_query").notNull(),
  improvements: json("improvements").notNull(),
  performance: json("performance").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Schema for inserting messages
export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true,
  timestamp: true 
});

// Schema for sample database schemas
export const insertSchemaSchema = createInsertSchema(sampleSchemas).omit({
  id: true
});

// Schema for saved queries
export const insertSavedQuerySchema = createInsertSchema(savedQueries).omit({
  id: true,
  timestamp: true,
  rating: true,
  feedback: true,
  performance: true,
  annotations: true,
  template: true,
  tags: true,
  creator: true,
  shared: true
});

// Schema for query templates
export const insertQueryTemplateSchema = createInsertSchema(queryTemplates).omit({
  id: true,
  timestamp: true,
  usageCount: true
});

// Schema for query optimizations
export const insertQueryOptimizationSchema = createInsertSchema(queryOptimizations).omit({
  id: true,
  timestamp: true
});

// Export types
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type SampleSchema = typeof sampleSchemas.$inferSelect;
export type InsertSchema = z.infer<typeof insertSchemaSchema>;
export type SavedQuery = typeof savedQueries.$inferSelect;
export type InsertSavedQuery = z.infer<typeof insertSavedQuerySchema>;
export type QueryTemplate = typeof queryTemplates.$inferSelect;
export type InsertQueryTemplate = z.infer<typeof insertQueryTemplateSchema>;
export type QueryOptimization = typeof queryOptimizations.$inferSelect;
export type InsertQueryOptimization = z.infer<typeof insertQueryOptimizationSchema>;