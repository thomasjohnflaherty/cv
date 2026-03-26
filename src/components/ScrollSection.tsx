import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export function ScrollSection({ children, id, className }: ScrollSectionProps) {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
}
