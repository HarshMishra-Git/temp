import express, { type Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { storage } from "./storage";
import { spawn } from "child_process";
import { eq, desc, and, or, like } from "drizzle-orm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const uploadsDir = path.join(projectRoot, "uploads");

// Ensure uploads directory exists
const createUploadsDir = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create uploads directory:", error);
  }
};

// Set up multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      await createUploadsDir();
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Run Python detection script
const runDetection = async (imagePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      path.join(projectRoot, 'server/model/detect.py'),
      imagePath
    ]);
    
    let resultData = '';
    let errorData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Detection process exited with code ${code}: ${errorData}`));
        return;
      }
      
      try {
        const parsedResult = JSON.parse(resultData);
        resolve(parsedResult);
      } catch (error) {
        reject(new Error(`Failed to parse detection results: ${error}`));
      }
    });
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize uploads directory
  await createUploadsDir();
  
  // API Routes
  // Upload and detect objects in image
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const startTime = Date.now();
      const imagePath = req.file.path;
      const fileName = req.file.originalname;
      
      // Run detection on the uploaded image
      const detectionResult = await runDetection(imagePath);
      
      // Calculate processing time
      const processingTimeMs = Date.now() - startTime;
      
      // Generate relative URL for the uploaded image
      const imageUrl = `/uploads/${path.basename(imagePath)}`;
      
      // Create path for storing processed images with detections
      const processedImagePath = path.join(uploadsDir, `processed-${path.basename(imagePath)}`);
      
      // Save detection result to database
      const result = await storage.insertDetectionResult({
        imageUrl,
        fileName,
        detections: detectionResult.detections,
        processingTimeMs,
        userId: 1, // Default user ID, would come from session in real app
      });
      
      // Log the activity
      await storage.insertActivityLog({
        type: "detection",
        title: `New Image Analysis: ${fileName}`,
        description: `Detected ${detectionResult.detections.length} objects in the image.`,
        userId: 1, // Default user ID
      });
      
      return res.status(200).json({
        id: result.id,
        imageUrl,
        fileName,
        detections: detectionResult.detections,
        processingTimeMs,
        timestamp: result.timestamp,
      });
    } catch (error) {
      console.error('Detection error:', error);
      return res.status(500).json({ 
        message: 'Detection failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Get all detection results
  app.get('/api/results', async (req, res) => {
    try {
      const results = await storage.getAllDetectionResults();
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching results:', error);
      return res.status(500).json({ 
        message: 'Failed to fetch results', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Get latest detection result
  app.get('/api/results/latest', async (req, res) => {
    try {
      const latestResult = await storage.getLatestDetectionResult();
      if (!latestResult) {
        return res.status(404).json({ message: 'No detection results found' });
      }
      return res.status(200).json(latestResult);
    } catch (error) {
      console.error('Error fetching latest result:', error);
      return res.status(500).json({ 
        message: 'Failed to fetch latest result', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Get latest model metrics
  app.get('/api/metrics/latest', async (req, res) => {
    try {
      const latestMetrics = await storage.getLatestModelMetrics();
      if (!latestMetrics) {
        return res.status(404).json({ message: 'No model metrics found' });
      }
      return res.status(200).json(latestMetrics);
    } catch (error) {
      console.error('Error fetching latest metrics:', error);
      return res.status(500).json({
        message: 'Failed to fetch latest metrics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get all activity logs
  app.get('/api/logs', async (req, res) => {
    try {
      const logs = await storage.getAllActivityLogs();
      return res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      return res.status(500).json({
        message: 'Failed to fetch logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get recent activity logs (limited to 10)
  app.get('/api/logs/recent', async (req, res) => {
    try {
      const recentLogs = await storage.getRecentActivityLogs();
      return res.status(200).json(recentLogs);
    } catch (error) {
      console.error('Error fetching recent logs:', error);
      return res.status(500).json({
        message: 'Failed to fetch recent logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get statistics summary
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      return res.status(500).json({
        message: 'Failed to fetch stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Serve uploaded images
  app.use('/uploads', express.static(uploadsDir));
  
  return httpServer;
}
