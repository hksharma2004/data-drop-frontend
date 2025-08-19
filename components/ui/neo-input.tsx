import * as React from "react";
import { cn } from "@/lib/utils";

const NeoInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border-4 border-black bg-white px-4 py-3 text-base font-bold shadow-[4px_4px_0px_0px_#000] transition-all file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-black placeholder:text-gray-500 placeholder:font-bold focus-visible:outline-none focus-visible:shadow-[6px_6px_0px_0px_#000] focus-visible:translate-x-[-1px] focus-visible:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
NeoInput.displayName = "NeoInput";

export { NeoInput };