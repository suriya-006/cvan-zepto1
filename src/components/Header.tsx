import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-center gap-3 py-6"
    >
      <div className="p-2 rounded-lg glass neon-glow-sm">
        <QrCode className="w-7 h-7 text-primary" />
      </div>
      <h1 className="text-2xl font-bold font-heading tracking-tight">
        <span className="gradient-text">CVAN</span>{' '}
        <span className="text-foreground">Generator</span>
      </h1>
    </motion.header>
  );
}
