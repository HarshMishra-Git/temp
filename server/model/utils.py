import os
import sys
import cv2
import numpy as np
import torch
import torch.nn as nn

def load_model(weights_path):
    """
    Load YOLOv8 model from weights
    
    Args:
        weights_path: Path to model weights
        
    Returns:
        Model object
    """
    try:
        # Check if ultralytics is available, otherwise try to import it
        try:
            from ultralytics import YOLO
            model = YOLO(weights_path)
            return model
        except ImportError:
            # If ultralytics is not available, try to load model directly with torch
            model = torch.load(weights_path, map_location='cpu')
            if isinstance(model, dict):
                model = model['model']  # extract model if saved in checkpoint format
            if isinstance(model, nn.Module):
                model.eval()
                return model
            else:
                raise TypeError("Model is not a PyTorch module")
    except Exception as e:
        # If model can't be loaded, use mock model for testing
        print(f"Warning: Could not load model from {weights_path}: {str(e)}", file=sys.stderr)
        print("Using mock model for testing", file=sys.stderr)
        return MockModel()

def process_image(img, size=640):
    """
    Preprocess image for YOLOv8 inference
    
    Args:
        img: Input image (numpy array)
        size: Target size (int or tuple)
        
    Returns:
        Preprocessed image tensor
    """
    # Resize
    if isinstance(size, int):
        img = cv2.resize(img, (size, size))
    else:
        img = cv2.resize(img, size)
    
    # Convert BGR to RGB
    img = img[:, :, ::-1].transpose(2, 0, 1)  # BGR to RGB, (H,W,C) to (C,H,W)
    img = np.ascontiguousarray(img)
    
    # Normalize
    img = img / 255.0
    
    # Convert to tensor
    img = torch.from_numpy(img).float()
    
    # Add batch dimension
    if len(img.shape) == 3:
        img = img.unsqueeze(0)
    
    return img

def non_max_suppression(
    prediction,
    conf_thres=0.25,
    iou_thres=0.45,
    max_det=300
):
    """
    Run Non-Maximum Suppression on prediction outputs
    
    Args:
        prediction: Model predictions
        conf_thres: Confidence threshold
        iou_thres: IoU threshold for NMS
        max_det: Maximum detections per image
        
    Returns:
        List of detections with [x1, y1, x2, y2, confidence, class]
    """
    try:
        from ultralytics.utils.ops import non_max_suppression as ultralytics_nms
        return ultralytics_nms(prediction, conf_thres, iou_thres, max_det=max_det)
    except ImportError:
        # Simple non-max suppression implementation if ultralytics is not available
        return simple_non_max_suppression(prediction, conf_thres, iou_thres, max_det)

def simple_non_max_suppression(prediction, conf_thres=0.25, iou_thres=0.45, max_det=300):
    """
    Simple implementation of Non-Maximum Suppression
    """
    bs = prediction.shape[0]  # batch size
    nc = prediction.shape[1] - 5  # number of classes
    xc = prediction[..., 4] > conf_thres  # candidates
    
    # Settings
    max_wh = 7680  # (pixels) maximum box width and height
    
    output = [torch.zeros((0, 6), device=prediction.device)] * bs
    
    for xi, x in enumerate(prediction):  # image index, image inference
        x = x[xc[xi]]  # confidence
        
        # If none remain process next image
        if not x.shape[0]:
            continue
        
        # Compute conf
        x[:, 5:] *= x[:, 4:5]  # conf = obj_conf * cls_conf
        
        # Box (center x, center y, width, height) to (x1, y1, x2, y2)
        box = xywh2xyxy(x[:, :4])
        
        # Detections matrix nx6 (xyxy, conf, cls)
        conf, j = x[:, 5:].max(1, keepdim=True)
        x = torch.cat((box, conf, j.float()), 1)[conf.view(-1) > conf_thres]
        
        # Filter by class
        # if classes:
        #     x = x[(x[:, 5:6] == torch.tensor(classes, device=x.device)).any(1)]
        
        # Check shape
        n = x.shape[0]  # number of boxes
        if not n:
            continue
        
        # Batched NMS
        c = x[:, 5:6] * max_wh  # classes
        boxes, scores = x[:, :4] + c, x[:, 4]  # boxes (offset by class), scores
        i = torchvision_nms(boxes, scores, iou_thres)  # NMS
        if i.shape[0] > max_det:  # limit detections
            i = i[:max_det]
        
        output[xi] = x[i]
    
    return output

def torchvision_nms(boxes, scores, iou_thres):
    """
    NMS implementation from torchvision
    """
    try:
        from torchvision.ops import nms
        return nms(boxes, scores, iou_thres)
    except ImportError:
        # Simple NMS implementation if torchvision is not available
        x1 = boxes[:, 0]
        y1 = boxes[:, 1]
        x2 = boxes[:, 2]
        y2 = boxes[:, 3]
        
        areas = (x2 - x1) * (y2 - y1)
        order = scores.argsort(descending=True)
        
        keep = []
        while order.size(0) > 0:
            i = order[0].item()
            keep.append(i)
            
            if order.size(0) == 1:
                break
                
            xx1 = torch.max(x1[i], x1[order[1:]])
            yy1 = torch.max(y1[i], y1[order[1:]])
            xx2 = torch.min(x2[i], x2[order[1:]])
            yy2 = torch.min(y2[i], y2[order[1:]])
            
            w = torch.clamp(xx2 - xx1, min=0)
            h = torch.clamp(yy2 - yy1, min=0)
            inter = w * h
            
            ovr = inter / (areas[i] + areas[order[1:]] - inter)
            inds = torch.where(ovr <= iou_thres)[0]
            
            order = order[inds + 1]
            
        return torch.tensor(keep, dtype=torch.long)

def xywh2xyxy(x):
    """
    Convert bounding box format from [x, y, w, h] to [x1, y1, x2, y2]
    """
    y = x.clone() if isinstance(x, torch.Tensor) else np.copy(x)
    y[:, 0] = x[:, 0] - x[:, 2] / 2  # top left x
    y[:, 1] = x[:, 1] - x[:, 3] / 2  # top left y
    y[:, 2] = x[:, 0] + x[:, 2] / 2  # bottom right x
    y[:, 3] = x[:, 1] + x[:, 3] / 2  # bottom right y
    return y

def scale_boxes(img1_shape, boxes, img0_shape):
    """
    Rescale boxes from img1_shape to img0_shape
    """
    # Rescale boxes from img1_shape to img0_shape
    gain = min(img1_shape[0] / img0_shape[0], img1_shape[1] / img0_shape[1])  # gain  = old / new
    pad = (img1_shape[1] - img0_shape[1] * gain) / 2, (img1_shape[0] - img0_shape[0] * gain) / 2  # wh padding
    
    boxes[:, [0, 2]] -= pad[0]  # x padding
    boxes[:, [1, 3]] -= pad[1]  # y padding
    boxes[:, :4] /= gain
    
    # Clip boxes to image bounds
    boxes[:, [0, 2]] = boxes[:, [0, 2]].clamp(0, img0_shape[1])  # x1, x2
    boxes[:, [1, 3]] = boxes[:, [1, 3]].clamp(0, img0_shape[0])  # y1, y2
    
    return boxes

def draw_boxes(image, detections, output_path):
    """
    Draw bounding boxes on image and save to output_path
    
    Args:
        image: Original image
        detections: List of detections with class, confidence, and box
        output_path: Path to save output image
    """
    # Create a copy of the image
    img = image.copy()
    
    # Color map for different classes
    color_map = {
        "Fire Extinguisher": (0, 49, 252),  # Red (BGR)
        "Toolbox": (255, 77, 124),  # Purple (BGR)
        "Oxygen Tank": (0, 200, 117)  # Green (BGR)
    }
    
    # Draw each detection
    for det in detections:
        cls = det["class"]
        conf = det["confidence"]
        box = det["box"]
        
        # Get box coordinates
        x, y, w, h = box
        
        # Get color for this class
        color = color_map.get(cls, (0, 0, 255))  # Default to red if class not in map
        
        # Draw rectangle
        cv2.rectangle(img, (x, y), (x + w, y + h), color, 2)
        
        # Prepare label text
        label = f"{cls} {conf:.2f}"
        
        # Get text size
        (text_width, text_height), baseline = cv2.getTextSize(
            label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1
        )
        
        # Draw label background
        cv2.rectangle(
            img, 
            (x, y - text_height - 5), 
            (x + text_width, y), 
            color, 
            -1
        )
        
        # Draw label text
        cv2.putText(
            img, 
            label, 
            (x, y - 5), 
            cv2.FONT_HERSHEY_SIMPLEX, 
            0.5, 
            (255, 255, 255), 
            1
        )
    
    # Save image
    cv2.imwrite(str(output_path), img)

class MockModel:
    """
    Mock model for testing when real model is not available
    """
    def __init__(self):
        self.classes = ["Fire Extinguisher", "Toolbox", "Oxygen Tank"]
        
    def __call__(self, img):
        """
        Generate mock predictions for testing
        """
        batch_size = img.shape[0]
        # Create mock predictions - 3 objects per image
        preds = []
        
        for i in range(batch_size):
            # Random number of detections (1-3)
            num_dets = np.random.randint(1, 4)
            
            # Create random detections
            for j in range(num_dets):
                # Random class
                cls = np.random.randint(0, len(self.classes))
                
                # Random confidence
                conf = np.random.uniform(0.7, 0.95)
                
                # Random box coordinates
                x = np.random.uniform(0.1, 0.9)
                y = np.random.uniform(0.1, 0.9)
                w = np.random.uniform(0.1, 0.3)
                h = np.random.uniform(0.1, 0.3)
                
                # Add detection
                pred = torch.tensor([[x, y, w, h, conf, cls]])
                preds.append(pred)
        
        # Concatenate predictions
        if preds:
            return torch.cat(preds, dim=0)
        else:
            return torch.zeros((batch_size, 0, 6))
