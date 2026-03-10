"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/constants";

export function SkillsGrid() {
  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>
  );

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(grouped).map(([category, categorySkills], i) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="border-2 border-shadow bg-surface p-6 shadow-brutal-sm"
        >
          <h3 className="mb-4 font-heading text-lg italic text-accent">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <span
                key={skill.name}
                className="rounded border border-lavender/50 bg-lavender/10 px-3 py-1 text-sm text-text"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
