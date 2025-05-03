import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function UploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG, JPG, or JPEG image.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1
  });
  
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload successful",
        description: `Detected ${data.detections?.length || 0} objects in the image.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/results'] });
      queryClient.invalidateQueries({ queryKey: ['/api/metrics'] });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };
  
  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate();
    } else {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle>Upload New Image</CardTitle>
        <CardDescription>
          Drag and drop or select a space station image for object detection
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        {/* Upload Dropzone */}
        <div 
          {...getRootProps()} 
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
            isDragActive 
              ? "border-[hsl(var(--space-blue))] dark:border-[hsl(var(--nebula-violet))]" 
              : "border-gray-300 dark:border-gray-600"
          }`}
        >
          <div className="space-y-1 text-center">
            {preview ? (
              <div className="mx-auto h-32 w-auto overflow-hidden">
                <img 
                  src={preview} 
                  alt="Image preview" 
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : (
              <i className="ri-upload-cloud-2-line mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"></i>
            )}
            <div className="flex text-sm justify-center">
              <label className="relative cursor-pointer bg-white dark:bg-[hsl(var(--space-black-light))] rounded-md font-medium text-[hsl(var(--space-blue))] dark:text-[hsl(var(--nebula-violet))] hover:text-[hsl(var(--space-blue-800))] dark:hover:text-[hsl(var(--nebula-violet-light))] focus-within:outline-none">
                <span>{file ? file.name : "Upload a file"}</span>
                <input {...getInputProps()} className="sr-only" />
              </label>
              {!file && <p className="pl-1 text-gray-600 dark:text-gray-400">or drag and drop</p>}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, JPEG up to 10MB
            </p>
          </div>
        </div>
        
        {/* Upload Buttons */}
        <div className="mt-5 flex justify-end">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={uploadMutation.isPending}
          >
            Clear
          </Button>
          <Button
            className="ml-3 bg-[hsl(var(--space-blue))] hover:bg-[hsl(var(--space-blue-800))]"
            onClick={handleUpload}
            disabled={!file || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-1"></i>
                Processing...
              </>
            ) : (
              "Detect Objects"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
