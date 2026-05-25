import * as React from 'react';
import { cn } from '@/lib/utils';

/** Always renders a masked password field (type="password" cannot be overridden). */
const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      {...props}
      type="password"
    />
  );
});
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
