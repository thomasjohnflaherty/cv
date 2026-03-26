import { motion } from "framer-motion";
import { roles } from "../../data/resume";
import { ExperienceCard } from "./ExperienceCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const } },
};

export function ExperienceSection() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6">
        Experience
      </motion.h2>
      <div className="space-y-4">
        {roles.map((role) => (
          <motion.div key={`${role.company}-${role.dates}`} variants={itemVariants}>
            <ExperienceCard role={role} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
