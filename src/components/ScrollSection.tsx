import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "../utils/motion";

interface ScrollSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  stagger?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export function ScrollSection({ children, id, className, stagger = false }: ScrollSectionProps) {
  if (stagger) {
    return (
      <motion.div
        id={id}
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
}
