import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const neoButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-black transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px]",
  {
    variants: {
      variant: {
        default: "bg-[#FF7A3D] text-white hover:bg-[#E5672A]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border-black bg-white text-black hover:bg-gray-50",
        secondary: "bg-gray-200 text-black hover:bg-gray-300",
        ghost: "border-transparent shadow-none hover:shadow-none hover:bg-gray-100 hover:translate-x-0 hover:translate-y-0",
        link: "text-black underline-offset-4 hover:underline border-transparent shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-yellow-400 text-black hover:bg-yellow-500",
        info: "bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NeoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neoButtonVariants> {
  asChild?: boolean;
}

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(neoButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NeoButton.displayName = "NeoButton";

export { NeoButton, neoButtonVariants };