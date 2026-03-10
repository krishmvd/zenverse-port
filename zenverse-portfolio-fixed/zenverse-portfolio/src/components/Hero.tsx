import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-6">
            Web Developer & Vibe Coder
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-foreground leading-[0.9]"
        >
          W3b Dev
          <span className="block text-primary">Krish</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body"
        >
          I build modern websites, creative UI experiences, and clean web
          interfaces with code and design.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-8 py-3.5 bg-accent text-accent-foreground font-display font-medium text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 border border-border text-foreground font-display font-medium text-sm tracking-wide rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            Contact
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
