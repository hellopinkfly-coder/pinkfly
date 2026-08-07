"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Soft, slowly floating gradient blobs. Decorative only (aria-hidden).
 * Kept subtle per brand guidance — no large pink surfaces.
 */
export function GradientBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <motion.div
        className="pf-blob left-[-8%] top-[-10%] h-[42vw] w-[42vw] max-h-[520px] max-w-[520px]"
        style={{ background: "radial-gradient(circle at 30% 30%, var(--pf-blob-1), transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pf-blob right-[-6%] top-[10%] h-[36vw] w-[36vw] max-h-[440px] max-w-[440px]"
        style={{ background: "radial-gradient(circle at 70% 30%, var(--pf-blob-2), transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pf-blob bottom-[-12%] left-[30%] h-[34vw] w-[34vw] max-h-[420px] max-w-[420px]"
        style={{ background: "radial-gradient(circle at 50% 50%, var(--pf-blob-1), transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
