import { useAuth } from "@/hooks/use-auth";
import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Rocket, Book, Camera, ChevronDown } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30 border-b">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SpaceDetect
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link to="/#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/#technology" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Technology
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="hidden md:flex">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/auth?tab=register" className="hidden md:flex">
              <Button size="sm">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth" className="md:hidden">
              <Button size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-40 border-b">
          <div className="container mx-auto max-w-7xl space-y-10 md:space-y-16 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  AI-Powered Space Technologies
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Space Station Object Detection System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Advanced computer vision for detecting and tracking critical equipment on the International Space Station using synthetic digital twin data.
                </p>
              </div>
              <div className="space-y-4 w-full max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/auth">
                    <Button variant="outline" size="lg" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/auth?tab=register">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 gap-8 rounded-lg border p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-lg border bg-background">
                <div className="flex h-full items-center justify-center p-6">
                  <div className="space-y-2 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 bg-primary/10 text-primary">
                      <Camera className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Advanced Object Detection</h3>
                    <p className="text-sm text-muted-foreground">
                      Utilize state-of-the-art YOLOv8 model to detect critical equipment with high accuracy in real-time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background">
                <div className="flex h-full items-center justify-center p-6">
                  <div className="space-y-2 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 bg-primary/10 text-primary">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Enhanced Space Safety</h3>
                    <p className="text-sm text-muted-foreground">
                      Ensure astronaut safety by automatically tracking the location of critical safety equipment like fire extinguishers and oxygen tanks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-b" id="features">
          <div className="container mx-auto max-w-7xl space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Advanced Space Equipment Monitoring
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Our system uses AI and computer vision to ensure safety and efficiency on the International Space Station.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Real-time Object Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Detect and track fire extinguishers, toolboxes, and oxygen tanks in real-time to ensure equipment is properly located.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="m12 14 4-4" />
                    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">High Detection Accuracy</h3>
                  <p className="text-sm text-muted-foreground">
                    Built using YOLOv8 architecture trained on synthetic digital twin data, our system achieves over 85% mAP.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Performance Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive dashboard with real-time detection metrics, historical data, and model performance statistics.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Multi-User Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Role-based access control allows engineers and administrators to access appropriate features and data.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Real-time Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive immediate notifications when safety equipment is moved or when critical thresholds are exceeded.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h10" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Activity Logging</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive activity logs track all detection events and system changes for auditing and compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-b bg-slate-50 dark:bg-slate-900" id="about">
          <div className="container mx-auto max-w-7xl grid items-center gap-6 md:gap-12 px-4 md:px-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                About the Project
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Enhancing Space Safety and Efficiency
              </h2>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The AI-Powered Space Station Object Detection System is developed to enhance safety and operational efficiency on the International Space Station by leveraging advanced computer vision and deep learning technologies.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/auth">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/#technology">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto grid w-full max-w-lg gap-6">
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Innovative Approach</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By training on synthetic digital twin data, our system achieves high accuracy without requiring extensive real-world data collection in the challenging space environment.
                  </p>
                </div>
              </div>
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Critical Safety Applications</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The system helps ensure that safety equipment like fire extinguishers and oxygen tanks are always in their designated locations and readily accessible in case of emergencies.
                  </p>
                </div>
              </div>
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Future Space Exploration</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This technology provides a foundation for future autonomous systems that will be essential for long-duration space missions to the Moon, Mars, and beyond.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="technology">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
              <div className="space-y-4">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Technology
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Powered by YOLOv8 and Digital Twin Data
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our system leverages state-of-the-art deep learning and computer vision technologies to deliver accurate object detection in the unique environment of the International Space Station.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      <h3 className="font-medium">YOLOv8 Architecture</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Using the latest version of YOLO (You Only Look Once), our system processes images in real-time with state-of-the-art accuracy and speed.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      <h3 className="font-medium">Synthetic Data Training</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Trained on synthetic digital twin data which replicates the unique lighting and spatial constraints of the space station environment.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      <h3 className="font-medium">Modern Tech Stack</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Built using React for the frontend, Node.js/Express for the backend, and PostgreSQL for data storage with real-time data processing capabilities.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-center space-y-4">
                <div className="grid w-full gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Model Size</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">3 MB</div>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-2.5 rounded-full bg-primary" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Accuracy (mAP)</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">84.7%</div>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-2.5 rounded-full bg-primary" style={{ width: "84.7%" }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Processing Speed</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">24 ms/frame</div>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-2.5 rounded-full bg-primary" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Fire Extinguisher Recall</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">93.2%</div>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-2.5 rounded-full bg-primary" style={{ width: "93.2%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="grid w-full gap-4 md:grid-cols-2">
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M5 22h14" />
                          <path d="M5 2h14" />
                          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                        </svg>
                        <div className="text-lg font-medium">Training Time</div>
                      </div>
                      <div className="text-xl font-bold">3.5h</div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Trained on synthetic digital twin dataset with 5,000 images across various space station modules.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.29 7 12 12 20.71 7" />
                          <line x1="12" x2="12" y1="22" y2="12" />
                        </svg>
                        <div className="text-lg font-medium">Objects</div>
                      </div>
                      <div className="text-xl font-bold">3</div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Currently detects fire extinguishers, toolboxes, and oxygen tanks with plans to expand to more equipment types.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto max-w-7xl grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Get Started
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to enhance space station safety?
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Create your account now to experience our advanced object detection system.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Link to="/auth" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Sign In
              </Link>
              <Link to="/auth?tab=register" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 SpaceDetect. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link to="/#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link to="/#about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link to="/#technology" className="text-sm font-medium hover:underline underline-offset-4">
              Technology
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
