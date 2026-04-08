import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center mb-10"
    >
      <h2 className="text-3xl md:text-5xl font-bold font-heading mb-3 gradient-text leading-tight">
        Smart Structured QR Code Generator
      </h2>
      <p className="text-muted-foreground max-w-lg mx-auto">
        Generate, manage, and track structured codes with manual, dropdown, or voice input.
      </p>
    </motion.section>
  );
}
