import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import Dashboard from "@/pages/dashboard";
import Upload from "@/pages/upload";
import History from "@/pages/history";
import Performance from "@/pages/performance";
import Settings from "@/pages/settings";
import Logs from "@/pages/logs";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/upload" component={Upload} />
      <ProtectedRoute path="/history" component={History} />
      <ProtectedRoute path="/performance" component={Performance} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/logs" component={Logs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="spacedetect-theme">
        <AuthProvider>
          <Router />
          <Toaster />
          {/* Background effects for dark mode */}
          <div className="fixed top-0 right-0 blob"></div>
          <div className="fixed bottom-0 left-0 blob"></div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
