import { motion } from "framer-motion";
import { Sparkles, Zap, Palette, Terminal } from "lucide-react";

const vibes = [
  {
    icon: Terminal,
    title: "Code as Art",
    description: "Every line of code is a brushstroke on the digital canvas. I craft experiences, not just interfaces.",
  },
  {
    icon: Palette,
    title: "Design Thinking",
    description: "Pixels with purpose. Every design decision solves a problem while delighting the user.",
  },
  {
    icon: Zap,
    title: "Performance First",
    description: "Speed is a feature. I obsess over load times, bundle sizes, and smooth 60fps animations.",
  },
  {
    icon: Sparkles,
    title: "Vibe Driven",
    description: "The best products feel right before you understand why. I build for that feeling.",
  },
];

const Playground = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px]" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-3">
            Philosophy
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            The Vibe Code
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            More than just writing code — it's about crafting digital experiences that resonate.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {vibes.map((vibe, index) => (
            <motion.div
              key={vibe.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative p-8 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-500"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors duration-300">
                <vibe.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {vibe.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {vibe.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Playground;
