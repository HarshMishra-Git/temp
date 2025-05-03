import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileHeader } from "@/components/ui/mobile-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeContext } from "@/components/theme-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { theme, setTheme } = useThemeContext();
  const { toast } = useToast();
  const [modelSettings, setModelSettings] = useState({
    confidenceThreshold: "0.4",
    ioUThreshold: "0.5",
    maxDetectionsPerClass: "20"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    missingObjectAlerts: true,
    modelUpdateAlerts: false,
    dailySummary: true
  });
  
  const handleSaveModelSettings = () => {
    toast({
      title: "Settings saved",
      description: "Model detection settings have been updated successfully."
    });
  };
  
  const handleSaveNotificationSettings = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved."
    });
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-[hsl(var(--space-black))]">
        <MobileHeader />
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
              Settings
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Configure application preferences and object detection parameters
            </p>
          </div>
          
          {/* Settings Tabs */}
          <div className="mt-6">
            <Tabs defaultValue="appearance">
              <TabsList className="mb-6">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="detection">Detection</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize the look and feel of the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Choose your preferred color theme for the application
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card 
                          className={`cursor-pointer border-2 ${theme === 'light' ? 'border-[hsl(var(--space-blue))]' : 'border-transparent'}`}
                          onClick={() => setTheme('light')}
                        >
                          <CardContent className="p-4 flex flex-col items-center">
                            <div className="w-full h-24 bg-white rounded-md shadow-sm flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-[hsl(var(--space-blue))]"></div>
                            </div>
                            <p className="mt-2 text-sm font-medium">Light Theme</p>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer border-2 ${theme === 'dark' ? 'border-[hsl(var(--nebula-violet))]' : 'border-transparent'}`}
                          onClick={() => setTheme('dark')}
                        >
                          <CardContent className="p-4 flex flex-col items-center">
                            <div className="w-full h-24 bg-[hsl(var(--space-black))] rounded-md shadow-sm flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-[hsl(var(--nebula-violet))]"></div>
                            </div>
                            <p className="mt-2 text-sm font-medium">Dark Theme</p>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer border-2 ${theme === 'system' ? 'border-[hsl(var(--orbit-green))]' : 'border-transparent'}`}
                          onClick={() => setTheme('system')}
                        >
                          <CardContent className="p-4 flex flex-col items-center">
                            <div className="w-full h-24 bg-gradient-to-r from-white to-[hsl(var(--space-black))] rounded-md shadow-sm flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-[hsl(var(--orbit-green))]"></div>
                            </div>
                            <p className="mt-2 text-sm font-medium">System Preference</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Animation Preferences</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Configure animation settings for the application
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="reduce-motion" className="text-sm font-medium text-gray-900 dark:text-white">Reduce motion</Label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Minimize animations throughout the application
                          </p>
                        </div>
                        <Switch id="reduce-motion" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="detection">
                <Card>
                  <CardHeader>
                    <CardTitle>Detection Settings</CardTitle>
                    <CardDescription>
                      Configure object detection model parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                          <Input 
                            id="confidence-threshold" 
                            type="number" 
                            step="0.05" 
                            min="0.1" 
                            max="1" 
                            value={modelSettings.confidenceThreshold}
                            onChange={(e) => setModelSettings({...modelSettings, confidenceThreshold: e.target.value})}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Minimum confidence score to display detections (0.1 - 1.0)
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="iou-threshold">IoU Threshold</Label>
                          <Input 
                            id="iou-threshold" 
                            type="number" 
                            step="0.05" 
                            min="0.1" 
                            max="1" 
                            value={modelSettings.ioUThreshold}
                            onChange={(e) => setModelSettings({...modelSettings, ioUThreshold: e.target.value})}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Intersection over Union threshold for NMS (0.1 - 1.0)
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max-detections">Max Detections Per Class</Label>
                          <Input 
                            id="max-detections" 
                            type="number" 
                            min="1" 
                            max="100" 
                            value={modelSettings.maxDetectionsPerClass}
                            onChange={(e) => setModelSettings({...modelSettings, maxDetectionsPerClass: e.target.value})}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Maximum number of objects to detect per class
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="model-version">Model Version</Label>
                          <Select defaultValue="yolov8n">
                            <SelectTrigger id="model-version">
                              <SelectValue placeholder="Select model version" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yolov8n">YOLOv8 Nano</SelectItem>
                              <SelectItem value="yolov8s">YOLOv8 Small</SelectItem>
                              <SelectItem value="yolov8m">YOLOv8 Medium</SelectItem>
                              <SelectItem value="yolov8l">YOLOv8 Large</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Select model size (larger = more accurate but slower)
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button 
                          className="bg-[hsl(var(--space-blue))] hover:bg-[hsl(var(--space-blue-800))]"
                          onClick={handleSaveModelSettings}
                        >
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure how and when you receive alerts and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-alerts" className="text-sm font-medium text-gray-900 dark:text-white">Email Alerts</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Receive critical alerts via email
                            </p>
                          </div>
                          <Switch 
                            id="email-alerts" 
                            checked={notificationSettings.emailAlerts}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailAlerts: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="missing-object-alerts" className="text-sm font-medium text-gray-900 dark:text-white">Missing Object Alerts</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Alert when expected objects are not detected
                            </p>
                          </div>
                          <Switch 
                            id="missing-object-alerts" 
                            checked={notificationSettings.missingObjectAlerts}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, missingObjectAlerts: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="model-update-alerts" className="text-sm font-medium text-gray-900 dark:text-white">Model Update Alerts</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Notify when the model is updated or retrained
                            </p>
                          </div>
                          <Switch 
                            id="model-update-alerts" 
                            checked={notificationSettings.modelUpdateAlerts}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, modelUpdateAlerts: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="daily-summary" className="text-sm font-medium text-gray-900 dark:text-white">Daily Summary</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Receive daily summary of all detections
                            </p>
                          </div>
                          <Switch 
                            id="daily-summary" 
                            checked={notificationSettings.dailySummary}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailySummary: checked})}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button 
                          className="bg-[hsl(var(--space-blue))] hover:bg-[hsl(var(--space-blue-800))]"
                          onClick={handleSaveNotificationSettings}
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="Alex Torres" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="alex.torres@spacestation.org" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue="Engineer" disabled />
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="destructive">
                          <i className="ri-logout-box-r-line mr-2"></i>
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 pb-6">
            <p>Space Station Object Detection System • Powered by YOLOv8 • &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
