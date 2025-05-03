import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("engineer"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  profileImage: true,
});

// Detection results table
export const detectionResults = pgTable("detection_results", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  fileName: text("file_name").notNull(),
  detections: json("detections").notNull().$type<{
    class: string;
    confidence: number;
    box: [number, number, number, number]; // [x, y, width, height]
  }[]>(),
  processingTimeMs: integer("processing_time_ms").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const detectionResultsRelations = relations(detectionResults, ({ one }) => ({
  user: one(users, {
    fields: [detectionResults.userId],
    references: [users.id],
  }),
}));

export const insertDetectionResultSchema = createInsertSchema(detectionResults).pick({
  imageUrl: true,
  fileName: true,
  detections: true,
  processingTimeMs: true,
  userId: true,
});

// Model metrics table
export const modelMetrics = pgTable("model_metrics", {
  id: serial("id").primaryKey(),
  overallMAP: real("overall_map").notNull(),
  classMetrics: json("class_metrics").notNull().$type<{
    className: string;
    precision: number;
    recall: number;
    f1Score: number;
    mAP: number;
  }[]>(),
  confusionMatrix: json("confusion_matrix").$type<number[][]>(),
  failureCases: json("failure_cases").$type<string[]>(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertModelMetricsSchema = createInsertSchema(modelMetrics).pick({
  overallMAP: true,
  classMetrics: true,
  confusionMatrix: true,
  failureCases: true,
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  type: true,
  title: true,
  description: true,
  userId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DetectionResult = typeof detectionResults.$inferSelect;
export type InsertDetectionResult = z.infer<typeof insertDetectionResultSchema>;

export type ModelMetric = typeof modelMetrics.$inferSelect;
export type InsertModelMetric = z.infer<typeof insertModelMetricsSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
