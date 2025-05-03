import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

import Dashboard from "@/pages/dashboard";
import Upload from "@/pages/upload";
import History from "@/pages/history";
import Performance from "@/pages/performance";
import Settings from "@/pages/settings";
import Logs from "@/pages/logs";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/upload" component={Upload} />
      <Route path="/history" component={History} />
      <Route path="/performance" component={Performance} />
      <Route path="/settings" component={Settings} />
      <Route path="/logs" component={Logs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="spacedetect-theme">
        <Router />
        <Toaster />
        {/* Background effects for dark mode */}
        <div className="fixed top-0 right-0 blob"></div>
        <div className="fixed bottom-0 left-0 blob"></div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
