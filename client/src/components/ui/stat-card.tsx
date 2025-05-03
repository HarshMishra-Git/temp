import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface StatCardProps {
  icon: string;
  iconClass: string;
  iconBgClass: string;
  title: string;
  value: string | number;
  linkText: string;
  linkUrl: string;
  linkClass: string;
}

export function StatCard({
  icon,
  iconClass,
  iconBgClass,
  title,
  value,
  linkText,
  linkUrl,
  linkClass
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[hsl(var(--space-black-light))] overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBgClass)}>
            <i className={cn(icon, "text-xl", iconClass)}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-[hsl(var(--space-black))] px-4 py-4 sm:px-6">
        <div className="text-sm">
          <Link
            href={linkUrl}
            className={cn("font-medium transition duration-200", linkClass)}
          >
            {linkText}
            <i className="ri-arrow-right-line inline-block ml-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
