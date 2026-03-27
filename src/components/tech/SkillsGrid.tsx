import { motion, type Variants } from "framer-motion";
import { expertise, skills } from "../../data/resume";

const ease: [number, number, number, number] = [0, 0, 0.2, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease } },
};

function Pill({ label }: { label: string }) {
  return (
    <motion.span
      variants={itemVariants}
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
      <div className="space-y-8">
        <div>
          <motion.h2 variants={itemVariants} className="mb-4">
            Expertise
          </motion.h2>
          <div className="flex flex-wrap gap-2">
            {expertise.map((s) => <Pill key={s} label={s} />)}
          </div>
        </div>

        <div>
          <motion.h2 variants={itemVariants} className="mb-4">
            Tools
          </motion.h2>
          <div className="flex flex-wrap gap-2">
            {skills.tools.map((s) => <Pill key={s} label={s} />)}
          </div>
        </div>

        <div>
          <motion.h2 variants={itemVariants} className="mb-4">
            Strengths
          </motion.h2>
          <div className="flex flex-wrap gap-2">
            {skills.strengths.map((s) => <Pill key={s} label={s} />)}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
