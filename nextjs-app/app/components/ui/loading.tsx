import { cn } from "@/lib/utils";
import { FaSpinner } from "react-icons/fa";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary";
}

export function Loading({ className, size = "md", variant = "default" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const variantClasses = {
    default: "border-gray-200",
    primary: "border-primary",
    secondary: "border-secondary",
  };

  return (
    <div
      className={cn(
        "animate-spin flex items-center justify-center",
        variantClasses[variant],
        className
      )}
    >
      <FaSpinner className="text-primary/50" size={48} />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center">
      <Loading size="lg" />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="flex h-[200px] w-full items-center justify-center rounded-lg border border-gray-200 bg-white p-4">
      <Loading />
    </div>
  );
}

export function LoadingList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
} 