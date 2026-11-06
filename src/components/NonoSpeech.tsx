import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tail = "left" | "right" | "bottom";

interface NonoSpeechProps {
  children: ReactNode;
  /** Side the tail points to (where Nono stands). */
  tail?: Tail;
  className?: string;
}

const TAIL: Record<Tail, string> = {
  left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-l-2 border-b-2",
  right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-r-2 border-t-2",
  bottom: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 border-r-2 border-b-2",
};

/** Speech bubble for Nono; the text is real HTML so it stays editable and indexable. */
export function NonoSpeech({ children, tail = "left", className }: NonoSpeechProps) {
  return (
    <div
      data-nono-speech
      className={cn(
        "relative rounded-2xl border-2 border-primary bg-card px-4 py-3 shadow-md shadow-primary/10",
        className
      )}
    >
      <p className="relative z-10 font-heading text-sm md:text-base font-bold leading-snug text-foreground">
        {children}
      </p>
      <span
        aria-hidden="true"
        className={cn("absolute h-3.5 w-3.5 rotate-45 border-primary bg-card", TAIL[tail])}
      />
    </div>
  );
}
