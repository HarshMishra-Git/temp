import { db } from "./index";
import { users, modelMetrics, activityLogs, insertUserSchema, insertModelMetricsSchema, insertActivityLogSchema } from "@shared/schema";
import { ActivityType } from "@/types";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting database seeding...");
    
    // Check if we already have a default user
    const existingUser = await db.query.users.findFirst({
      where: (users) => eq(users.username, "admin")
    });
    
    // Create default users if none exist
    if (!existingUser) {
      console.log("Creating default admin user...");
      const adminUserData = insertUserSchema.parse({
        username: "admin",
        password: "$2b$10$8DmI1qQHL7JbnUa.BrGVPe2IfaApjhPB2jg3zKFcUzMfX9DSNv2eq", // hashed "password123"
        name: "Alex Torres",
        role: "admin",
        profileImage: "https://images.unsplash.com/photo-1553373875-200e034084af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80"
      });
      const [adminUser] = await db.insert(users).values(adminUserData).returning();
      console.log(`Created admin user with ID: ${adminUser.id}`);
      
      // Create an engineer user too
      console.log("Creating engineer user...");
      const engineerUserData = insertUserSchema.parse({
        username: "engineer",
        password: "$2b$10$8DmI1qQHL7JbnUa.BrGVPe2IfaApjhPB2jg3zKFcUzMfX9DSNv2eq", // hashed "password123"
        name: "Maria Johnson",
        role: "engineer",
        profileImage: null
      });
      const [engineerUser] = await db.insert(users).values(engineerUserData).returning();
      console.log(`Created engineer user with ID: ${engineerUser.id}`);
    }
    
    // Add sample model metrics if none exist
    const existingMetrics = await db.query.modelMetrics.findFirst();
    
    if (!existingMetrics) {
      console.log("Creating sample model metrics...");
      const metricsData = insertModelMetricsSchema.parse({
        overallMAP: 0.847,
        classMetrics: [
          {
            className: "Fire Extinguisher",
            precision: 0.91,
            recall: 0.93,
            f1Score: 0.92,
            mAP: 0.92
          },
          {
            className: "Toolbox",
            precision: 0.86,
            recall: 0.82,
            f1Score: 0.84,
            mAP: 0.84
          },
          {
            className: "Oxygen Tank",
            precision: 0.79,
            recall: 0.77,
            f1Score: 0.78,
            mAP: 0.78
          }
        ],
        confusionMatrix: [
          [45, 2, 1],
          [3, 38, 2],
          [1, 3, 35]
        ],
        failureCases: [
          "module_a_dim_lighting.jpg",
          "toolbox_partial_occlusion.jpg",
          "oxygen_tank_unusual_angle.jpg"
        ]
      });
      await db.insert(modelMetrics).values({
        overallMAP: metricsData.overallMAP,
        classMetrics: metricsData.classMetrics as any,
        confusionMatrix: metricsData.confusionMatrix as any,
        failureCases: metricsData.failureCases as any
      });
    }
    
    // Add sample activity logs if none exist
    const existingLogs = await db.query.activityLogs.findFirst();
    
    if (!existingLogs) {
      console.log("Creating sample activity logs...");
      const activityData = [
        {
          type: ActivityType.DETECTION,
          title: "Space Station Module B Scan",
          description: "Detected: 1 fire extinguisher, 2 toolboxes",
          userId: 1,
          timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
          type: ActivityType.MODEL_UPDATE,
          title: "Model Updated",
          description: "YOLOv8 model retrained with 50 new images. mAP improved by 2.3%",
          userId: 1,
          timestamp: new Date(Date.now() - 10800000) // 3 hours ago
        },
        {
          type: ActivityType.ALERT,
          title: "Missing Object Alert",
          description: "Oxygen tank not detected in Module C. Expected count: 1, Detected: 0",
          userId: 1,
          timestamp: new Date(Date.now() - 18000000) // 5 hours ago
        }
      ];
      
      // Parse and validate each activity log
      const validatedActivities = activityData.map(data => insertActivityLogSchema.parse(data));
      await db.insert(activityLogs).values(validatedActivities);
    }
    
    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
