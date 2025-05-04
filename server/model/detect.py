import sys
import os
import json
import time
import cv2
import numpy as np
import torch
from pathlib import Path

# Add parent directory to sys.path for relative imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(parent_dir)

# Import utility functions
from server.model.utils import non_max_suppression, scale_boxes, load_model, process_image, draw_boxes

# Class mapping
CLASSES = ["Fire Extinguisher", "Toolbox", "Oxygen Tank"]

def detect_objects(image_path, model_path=None, conf_thres=0.25, iou_thres=0.45, max_det=1000):
    """
    Detect objects in an image using YOLOv8 model
    
    Args:
        image_path: Path to input image
        model_path: Path to YOLOv8 weights file (optional)
        conf_thres: Confidence threshold
        iou_thres: IoU threshold for NMS
        max_det: Maximum number of detections
        
    Returns:
        Dictionary with detection results
    """
    # Note: Implementation updated based on the provided predict.py script
    # Uses ultralytics YOLO for detection instead of custom implementation
    try:
        # Use default model path if not provided
        if model_path is None:
            model_path = os.path.join(current_dir, 'yolov8_weights.pt')
            if not os.path.exists(model_path):
                print(f"Downloading YOLOv8 weights to {model_path}")
                os.system(f"curl -L https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8s.pt -o {model_path}")
        
        # Load model
        model = load_model(model_path)
        
        # Load and preprocess image
        original_image = cv2.imread(image_path)
        if original_image is None:
            raise FileNotFoundError(f"Could not read image at {image_path}")
            
        # Get image dimensions for scaling boxes later
        height, width = original_image.shape[:2]
        
        # Process image for model input
        img = process_image(original_image)
        
        # Start timing for performance measurement
        start_time = time.time()
        
        # Make prediction
        with torch.no_grad():
            pred = model(img)
        
        # Apply NMS
        pred = non_max_suppression(pred, conf_thres, iou_thres, max_det=max_det)
        
        processing_time = time.time() - start_time
        
        # Process predictions
        detections = []
        
        for i, det in enumerate(pred):
            if len(det):
                # Rescale boxes to original image
                det[:, :4] = scale_boxes(img.shape[2:], det[:, :4], original_image.shape).round()
                
                # Process each detection
                for *xyxy, conf, cls in det:
                    x1, y1, x2, y2 = [int(x) for x in xyxy]
                    class_id = int(cls)
                    confidence = float(conf)
                    
                    # Calculate box coordinates and dimensions for response
                    # Format: [x, y, width, height]
                    box = [x1, y1, x2-x1, y2-y1]
                    
                    # Add detection to results
                    detections.append({
                        "class": CLASSES[class_id],
                        "confidence": confidence,
                        "box": box
                    })
        
        # Draw boxes on image and save it
        output_path = Path(image_path).parent / f"processed-{Path(image_path).name}"
        draw_boxes(original_image, detections, output_path)
        
        # Prepare response
        result = {
            "detections": detections,
            "processing_time_ms": round(processing_time * 1000)
        }
        
        return result
        
    except Exception as e:
        print(f"Error in detection: {str(e)}", file=sys.stderr)
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python detect.py <image_path>", file=sys.stderr)
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = detect_objects(image_path)
    
    # Output results as JSON to stdout
    print(json.dumps(result))
