import { motion } from "framer-motion";
import { Code2, Layout, Globe, Wrench, MessageCircle } from "lucide-react";

const skillCategories = [
  {
    title: "Core Web",
    icon: Code2,
    skills: ["HTML", "CSS3", "JavaScript (ES6)"],
  },
  {
    title: "Frontend Development",
    icon: Layout,
    skills: ["React.js", "Context API", "Redux", "React Hooks"],
  },
  {
    title: "Web Skills",
    icon: Globe,
    skills: ["REST API Integration", "UI/UX Website Design", "Performance Optimization"],
  },
  {
    title: "Tools",
    icon: Wrench,
    skills: ["GitHub (Version Control)"],
  },
  {
    title: "Soft Skills",
    icon: MessageCircle,
    skills: ["Communication"],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-3">
            Expertise
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Skills & Tools
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-500"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                <category.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-3">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
