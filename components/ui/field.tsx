import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full border border-line bg-ink-3/60 px-3.5 text-[0.9375rem] text-paper placeholder:text-paper-mute transition-colors focus:border-paper-dim focus:outline-none aria-[invalid=true]:border-shu";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(base, "h-11", className)} {...props} />,
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => <textarea ref={ref} className={cn(base, "min-h-24 resize-y py-3", className)} {...props} />,
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("eyebrow mb-2 block", className)} {...props} />;
}

export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[0.8125rem] text-shu">
      {children}
    </p>
  );
}
