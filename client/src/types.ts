// Object detection types
export type DetectionClass = "Fire Extinguisher" | "Toolbox" | "Oxygen Tank";

export interface Detection {
  class: DetectionClass;
  confidence: number;
  box: [number, number, number, number]; // [x, y, width, height]
}

export interface DetectionResult {
  id: number;
  imageUrl: string;
  detections: Detection[];
  processingTimeMs: number;
  timestamp: string;
  userId: number;
  fileName: string;
}

// Performance metrics types
export interface ClassMetrics {
  className: DetectionClass;
  precision: number;
  recall: number;
  f1Score: number;
  mAP: number;
}

export interface ModelMetrics {
  id: number;
  timestamp: string;
  overallMAP: number;
  classMetrics: ClassMetrics[];
  confusionMatrix?: number[][];
  failureCases?: string[];
}

// Activity/Log types
export enum ActivityType {
  DETECTION = "detection",
  MODEL_UPDATE = "model_update",
  ALERT = "alert"
}

export interface ActivityLog {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  userId?: number;
}

// User types
export interface User {
  id: number;
  username: string;
  name: string;
  role: "engineer" | "admin";
  profileImage?: string;
}
