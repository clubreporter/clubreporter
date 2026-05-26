import * as React from 'react';
import { cn } from '@/lib/utils';

const INPUT_STYLE = {
  color: '#111827',
  backgroundColor: '#ffffff',
  WebkitTextFillColor: '#111827',
  caretColor: '#111827',
  colorScheme: 'light',
};

/** Always renders a masked password field (type="password" cannot be overridden). */
const PasswordInput = React.forwardRef(({ className, style, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-1 text-base text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      style={{ ...INPUT_STYLE, ...style }}
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
