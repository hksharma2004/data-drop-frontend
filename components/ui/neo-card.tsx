import * as React from "react";
import { cn } from "@/lib/utils";

const NeoCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-4 border-black bg-white text-black shadow-[8px_8px_0px_0px_#000] transition-all hover:shadow-[12px_12px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]",
      className
    )}
    {...props}
  />
));
NeoCard.displayName = "NeoCard";

const NeoCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b-4 border-black", className)}
    {...props}
  />
));
NeoCardHeader.displayName = "NeoCardHeader";

const NeoCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-black text-2xl leading-none tracking-tight uppercase", className)}
    {...props}
  />
));
NeoCardTitle.displayName = "NeoCardTitle";

const NeoCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-bold text-gray-600 uppercase tracking-wide", className)}
    {...props}
  />
));
NeoCardDescription.displayName = "NeoCardDescription";

const NeoCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
NeoCardContent.displayName = "NeoCardContent";

const NeoCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t-4 border-black", className)}
    {...props}
  />
));
NeoCardFooter.displayName = "NeoCardFooter";

export { 
  NeoCard, 
  NeoCardHeader, 
  NeoCardFooter, 
  NeoCardTitle, 
  NeoCardDescription, 
  NeoCardContent 
};