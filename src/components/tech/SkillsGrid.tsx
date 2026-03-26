import { motion } from "framer-motion";
import { skills } from "../../data/resume";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

function SkillPill({ label }: { label: string }) {
  return (
    <motion.span
      variants={pillVariants}
      className="px-3 py-1.5 rounded-full text-sm font-medium border"
      style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
    >
      {label}
    </motion.span>
  );
}

export function SkillsGrid() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.h2
        variants={pillVariants}
        className="text-2xl font-bold mb-6"
      >
        Skills
      </motion.h2>
      <div className="space-y-4">
        <div>
          <motion.p variants={pillVariants} className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>Core</motion.p>
          <div className="flex flex-wrap gap-2">
            {skills.core.map((s) => <SkillPill key={s} label={s} />)}
          </div>
        </div>
        <div>
          <motion.p variants={pillVariants} className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>Supporting</motion.p>
          <div className="flex flex-wrap gap-2">
            {skills.supporting.map((s) => <SkillPill key={s} label={s} />)}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
