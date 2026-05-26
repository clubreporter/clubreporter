import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, style, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      style={{
        color: '#111827',
        backgroundColor: '#ffffff',
        WebkitTextFillColor: '#111827',
        caretColor: '#111827',
        colorScheme: 'light',
        ...style,
      }}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
