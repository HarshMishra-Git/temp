import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/components/theme-provider";

interface SidebarProps {
  user?: {
    name: string;
    role: string;
    profileImage?: string;
  };
}

export function Sidebar({ user = { 
  name: "Alex Torres",
  role: "Engineer",
  profileImage: "https://images.unsplash.com/photo-1553373875-200e034084af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80"
} }: SidebarProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useThemeContext();
  
  const navItems = [
    { name: "Dashboard", icon: "ri-dashboard-line", path: "/" },
    { name: "Upload", icon: "ri-upload-cloud-line", path: "/upload" },
    { name: "History", icon: "ri-history-line", path: "/history" },
    { name: "Performance", icon: "ri-line-chart-line", path: "/performance" },
  ];
  
  const adminItems = [
    { name: "Settings", icon: "ri-settings-line", path: "/settings" },
    { name: "Logs", icon: "ri-terminal-box-line", path: "/logs" },
  ];
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-full bg-white dark:bg-[hsl(var(--space-black-light))] shadow-md">
        {/* Logo */}
        <div className="px-6 py-6 flex items-center">
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-3">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(var(--space-blue))] to-[hsl(var(--nebula-violet))] animate-pulse-slow"></div>
              <div className="absolute inset-1.5 rounded-full bg-white dark:bg-[hsl(var(--space-black-light))] flex items-center justify-center">
                <i className="ri-rocket-2-fill text-[hsl(var(--space-blue))] dark:text-[hsl(var(--nebula-violet))]"></i>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">SpaceDetect</h1>
          </div>
        </div>
        
        {/* Navigation items */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200",
                  location === item.path
                    ? "bg-[hsl(var(--space-blue-100))] dark:bg-[hsl(var(--space-blue-900))] text-[hsl(var(--space-blue))] dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[hsl(var(--space-black))]"
                )}
              >
                <i className={`${item.icon} mr-3 text-xl`}></i>
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4">
              <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Admin
              </p>
            </div>
            
            {adminItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200",
                  location === item.path
                    ? "bg-[hsl(var(--space-blue-100))] dark:bg-[hsl(var(--space-blue-900))] text-[hsl(var(--space-blue))] dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[hsl(var(--space-black))]"
                )}
              >
                <i className={`${item.icon} mr-3 text-xl`}></i>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        
        {/* User Profile & Theme Toggle */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {user.profileImage && (
                <img 
                  className="h-8 w-8 rounded-full" 
                  src={user.profileImage} 
                  alt={`${user.name} profile`} 
                />
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
            </div>
            
            {/* Theme Switcher */}
            <div className="flex items-center">
              <button 
                onClick={toggleTheme}
                className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--space-blue))] dark:focus:ring-offset-[hsl(var(--space-black))]"
              >
                <i className="ri-moon-line dark:hidden text-lg"></i>
                <i className="ri-sun-line hidden dark:inline text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
