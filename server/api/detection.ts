import path from "path";
import fs from "fs/promises";
import { spawn } from "child_process";
import multer from "multer";
import { Express, Request, Response } from "express";
import { storage } from "../storage";
import { DetectionResult, ActivityType } from "@/types";

// Configure upload directory
const projectRoot = path.resolve(__dirname, "../..");
const uploadsDir = path.join(projectRoot, "uploads");

// Create upload directory if it doesn't exist
const initializeUploadDir = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at ${uploadsDir}`);
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
};

// Initialize multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: async (_req, _file, cb) => {
      await initializeUploadDir();
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (_req, file, cb) => {
    // Accept only images
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only JPG, JPEG, and PNG images are allowed"));
  }
});

// Helper function to run Python detection script
const runDetection = async (imagePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(projectRoot, 'server/model/detect.py');
    
    // Check if Python script exists
    fs.access(pythonScriptPath)
      .catch(() => {
        reject(new Error(`Python script not found at ${pythonScriptPath}`));
      });
    
    const pythonProcess = spawn('python', [pythonScriptPath, imagePath]);
    
    let resultData = '';
    let errorData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error(`Python stderr: ${data}`);
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

// Register API routes
export function registerDetectionRoutes(app: Express) {
  // Initialize upload directory
  initializeUploadDir();
  
  // Route to handle image upload and object detection
  app.post('/api/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const startTime = Date.now();
      const imagePath = req.file.path;
      const fileName = req.file.originalname;
      
      console.log(`Processing image: ${imagePath}`);
      
      // Run detection on the uploaded image
      const detectionResult = await runDetection(imagePath);
      
      if (detectionResult.error) {
        throw new Error(detectionResult.error);
      }
      
      // Calculate processing time
      const processingTimeMs = Date.now() - startTime;
      
      // Generate relative URL for the uploaded image
      const imageUrl = `/uploads/${path.basename(imagePath)}`;
      
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
        type: ActivityType.DETECTION,
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
  
  // Serve uploaded images statically
  app.use('/uploads', express.static(uploadsDir));
}
