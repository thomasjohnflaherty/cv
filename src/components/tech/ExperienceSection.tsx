import { motion, type Variants } from "framer-motion";
import { roles } from "../../data/resume";
import { ExperienceCard } from "./ExperienceCard";
import { ease } from "../../utils/motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function ExperienceSection() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.h2 variants={itemVariants} className="mb-8">
        Experience
      </motion.h2>
      {roles.map((role, i) => (
        <motion.div key={`${role.company}-${role.dates}`} variants={itemVariants}>
          <ExperienceCard role={role} isLast={i === roles.length - 1} />
        </motion.div>
      ))}
    </motion.section>
  );
}
