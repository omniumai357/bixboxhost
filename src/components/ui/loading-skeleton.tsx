import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "circle" | "button";
}

export const LoadingSkeleton = ({ 
  className, 
  variant = "card" 
}: LoadingSkeletonProps) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted";
  
  const variants = {
    card: "h-48 w-full rounded-lg",
    text: "h-4 w-full rounded",
    circle: "h-12 w-12 rounded-full",
    button: "h-10 w-32 rounded-md"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
    />
  );
};

interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton = ({ className }: CardSkeletonProps) => {
  return (
    <div className={cn("enhanced-glass p-6 rounded-lg", className)}>
      <LoadingSkeleton variant="card" className="mb-4" />
      <LoadingSkeleton variant="text" className="mb-2" />
      <LoadingSkeleton variant="text" className="w-3/4 mb-4" />
      <div className="flex gap-2">
        <LoadingSkeleton variant="button" />
        <LoadingSkeleton variant="circle" className="h-10 w-10" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;