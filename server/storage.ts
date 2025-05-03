import { db } from "@db";
import { 
  users, 
  detectionResults, 
  modelMetrics, 
  activityLogs,
  insertDetectionResultSchema,
  insertModelMetricsSchema,
  insertActivityLogSchema,
  InsertDetectionResult,
  InsertActivityLog,
  InsertModelMetric
} from "@shared/schema";
import { eq, desc, and, or, like } from "drizzle-orm";

// Storage interface for database operations
export const storage = {
  // User operations
  createUser: async (userData: Omit<InsertUser, "id">) => {
    try {
      const [user] = await db.insert(users).values(userData).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  
  getUser: async (id: number) => {
    return await db.query.users.findFirst({
      where: eq(users.id, id)
    });
  },
  
  getUserByUsername: async (username: string) => {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  },
  
  // Detection results operations
  insertDetectionResult: async (data: Omit<InsertDetectionResult, "timestamp">) => {
    try {
      // Ensure the detections field is properly formatted as an array
      const detectionArray = Array.isArray(data.detections) ? data.detections : [];
      
      const validatedData = insertDetectionResultSchema.parse({
        ...data,
        detections: detectionArray,
        timestamp: new Date()
      });
      
      const [result] = await db.insert(detectionResults).values(validatedData).returning();
      return result;
    } catch (error) {
      console.error("Error inserting detection result:", error);
      throw error;
    }
  },
  
  getDetectionResultById: async (id: number) => {
    return await db.query.detectionResults.findFirst({
      where: eq(detectionResults.id, id)
    });
  },
  
  getAllDetectionResults: async () => {
    return await db.query.detectionResults.findMany({
      orderBy: desc(detectionResults.timestamp)
    });
  },
  
  getLatestDetectionResult: async () => {
    const results = await db.query.detectionResults.findMany({
      orderBy: desc(detectionResults.timestamp),
      limit: 1
    });
    
    return results.length > 0 ? results[0] : null;
  },
  
  // Model metrics operations
  insertModelMetrics: async (data: Omit<InsertModelMetric, "timestamp">) => {
    try {
      // Ensure the classMetrics field is properly formatted as an array
      const classMetricsArray = Array.isArray(data.classMetrics) ? data.classMetrics : [];
      // Ensure the confusionMatrix field is properly formatted as an array
      const confusionMatrixArray = Array.isArray(data.confusionMatrix) ? data.confusionMatrix : [];
      // Ensure the failureCases field is properly formatted as an array
      const failureCasesArray = Array.isArray(data.failureCases) ? data.failureCases : [];
      
      const validatedData = insertModelMetricsSchema.parse({
        ...data,
        classMetrics: classMetricsArray,
        confusionMatrix: confusionMatrixArray,
        failureCases: failureCasesArray,
        timestamp: new Date()
      });
      
      const [result] = await db.insert(modelMetrics).values(validatedData).returning();
      return result;
    } catch (error) {
      console.error("Error inserting model metrics:", error);
      throw error;
    }
  },
  
  getLatestModelMetrics: async () => {
    const metrics = await db.query.modelMetrics.findMany({
      orderBy: desc(modelMetrics.timestamp),
      limit: 1
    });
    
    return metrics.length > 0 ? metrics[0] : null;
  },
  
  // Activity logs operations
  insertActivityLog: async (data: Omit<InsertActivityLog, "timestamp">) => {
    try {
      const validatedData = insertActivityLogSchema.parse({
        ...data,
        timestamp: new Date()
      });
      
      const [result] = await db.insert(activityLogs).values(validatedData).returning();
      return result;
    } catch (error) {
      console.error("Error inserting activity log:", error);
      throw error;
    }
  },
  
  getAllActivityLogs: async () => {
    return await db.query.activityLogs.findMany({
      orderBy: desc(activityLogs.timestamp)
    });
  },
  
  getRecentActivityLogs: async (limit = 10) => {
    return await db.query.activityLogs.findMany({
      orderBy: desc(activityLogs.timestamp),
      limit
    });
  },
  
  // Stats operations
  getStats: async () => {
    try {
      // Use simple count query instead
      const results = await db.query.detectionResults.findMany();
      const totalDetections = results.length;
      
      // Get latest model metrics for mAP
      const latestMetrics = await db.query.modelMetrics.findMany({
        orderBy: desc(modelMetrics.timestamp),
        limit: 1
      });
      
      // Calculate avg processing time manually
      let avgProcessingTime = 0;
      if (results.length > 0) {
        const totalTime = results.reduce((sum, result) => sum + (result.processingTimeMs || 0), 0);
        avgProcessingTime = Math.round(totalTime / results.length);
      }
      
      // Get Fire Extinguisher accuracy from latest metrics
      let fireExtinguisherAccuracy = 0;
      if (latestMetrics.length > 0) {
        const fireExtMetrics = latestMetrics[0].classMetrics.find(
          (m) => m.className === "Fire Extinguisher"
        );
        if (fireExtMetrics) {
          fireExtinguisherAccuracy = fireExtMetrics.precision * 100;
        }
      }
      
      return {
        totalDetections,
        mAP: latestMetrics.length > 0 ? latestMetrics[0].overallMAP * 100 : 0,
        fireExtinguisherAccuracy,
        avgProcessingTime
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      // Return default values if there's an error
      return {
        totalDetections: 0,
        mAP: 0,
        fireExtinguisherAccuracy: 0,
        avgProcessingTime: 0
      };
    }
  }
};

// Helper functions for count and avg
function count<T extends Record<string, any>>(column?: keyof T) {
  return { __op: "count", column } as any;
}

function avg<T extends Record<string, any>>(column: keyof T) {
  return { __op: "avg", column } as any;
}
