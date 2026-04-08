import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  code: string | null;
}

export default function QRPreview({ code }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success('Copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${code}.png`;
    a.click();
    toast.success('QR code downloaded!');
  };

  return (
    <AnimatePresence mode="wait">
      {code && (
        <motion.div
          key={code}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass rounded-2xl p-6 flex flex-col items-center gap-4 neon-glow"
        >
          <p className="font-mono text-lg text-primary neon-text font-bold tracking-wider">{code}</p>
          <div ref={canvasRef} className="p-4 rounded-xl bg-foreground">
            <QRCodeCanvas value={code} size={180} bgColor="#f0f4f8" fgColor="#0d1420" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="border-primary/30 text-primary hover:bg-primary/10">
              <Copy className="w-4 h-4" /> Copy
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
