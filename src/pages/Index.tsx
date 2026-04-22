import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, QrCodeIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import QRPreview from '@/components/QRPreview';
import { useCodes } from '@/hooks/useCodes';
import { parseInput, FIRST_LETTERS, getFirstLetter, isPotentialCodeInput } from '@/lib/code-utils';
import { QRCodeCanvas } from 'qrcode.react';

export default function Index() {
  const { codes, isLoading, addCode } = useCodes();
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [activeLetter, setActiveLetter] = useState('A');
  const lastAutoSubmittedRef = useRef<string | null>(null);

  const preview = parseInput(value);
  const filterGroups = [...FIRST_LETTERS, '123'];
  const showInvalidFormat = value.trim().length > 0 && !preview && !isPotentialCodeInput(value);

  useEffect(() => {
    if (!value.trim()) {
      lastAutoSubmittedRef.current = null;
      return;
    }

    if (!preview || addCode.isPending || lastAutoSubmittedRef.current === preview) {
      return;
    }

    const timer = window.setTimeout(() => {
      lastAutoSubmittedRef.current = preview;

      const nextGroup = getFirstLetter(preview);
      if (nextGroup) {
        setActiveLetter(nextGroup);
      }

      setLastCode(preview);
      addCode.mutate(preview, {
        onSuccess: () => {
          setValue('');
          lastAutoSubmittedRef.current = null;
        },
        onError: () => {
          lastAutoSubmittedRef.current = null;
        },
      });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [preview, value, addCode]);

  const filteredCodes = codes.filter(c => getFirstLetter(c.code) === activeLetter);

  const handleDownloadQR = (code: string) => {
    const canvas = document.getElementById(`qr-${code}`) as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${code}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 pb-16">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center pt-8 mb-6">
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground">
            <QrCode className="w-4 h-4 text-primary" />
            CODE GENERATOR
          </div>
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3 gradient-text leading-tight">
            CVAN Code Generator
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Generate unique structured codes with QR codes. Fast, simple, reliable.
          </p>
        </motion.section>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 mb-8 space-y-4">
          <p className="text-sm text-muted-foreground">Type a code and it will generate automatically. Use A1A1, F26A5, 8900351614516, or bin codes like S A1A1, D B2, F J8A2.</p>
          <div>
            <Input
              placeholder="A1A1, S A1A1, or 8900351614516"
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
              maxLength={32}
              className="bg-secondary border-primary/40 font-mono text-lg tracking-widest h-12 focus:border-primary focus:ring-primary"
            />
          </div>
          {value && preview && (
            <p className="text-sm font-mono text-primary neon-text">{preview} · generating…</p>
          )}
          {showInvalidFormat && (
            <p className="text-sm font-mono text-destructive">Invalid format</p>
          )}
        </motion.div>

        <div className="mb-8">
          <QRPreview code={lastCode} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-heading font-bold text-foreground">Generated Codes</h2>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {isLoading ? '...' : `${codes.length} total`}
            </span>
          </div>

          <div className="glass rounded-2xl p-4 mb-4">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">Filter codes</p>
            <div className="flex flex-wrap gap-1.5">
              {filterGroups.map((letter) => {
                const count = codes.filter(c => getFirstLetter(c.code) === letter).length;
                return (
                  <button
                    key={letter}
                    onClick={() => setActiveLetter(letter)}
                    className={`relative min-w-[2.5rem] h-10 rounded-xl px-2 text-sm font-bold transition-all duration-200 ${
                      activeLetter === letter
                        ? 'bg-primary text-primary-foreground neon-glow-sm scale-105'
                        : 'bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary hover:scale-105'
                    }`}
                  >
                    {letter}
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[9px] font-bold flex items-center justify-center text-accent-foreground">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredCodes.length === 0 && !isLoading && (
              <div className="glass rounded-2xl p-8 text-center">
                <QrCodeIcon className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No codes for <span className="text-primary font-bold">{activeLetter}</span></p>
              </div>
            )}
            {filteredCodes.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025, duration: 0.3 }}
                className="group glass rounded-xl px-4 py-3 flex items-center justify-between hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-mono text-xs font-bold border border-primary/20">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold text-primary neon-text">{c.code}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(c.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setLastCode(c.code); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
                    title="Show QR"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownloadQR(c.code)}
                    className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                    title="Download QR"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="hidden">
            {codes.map(c => (
              <QRCodeCanvas key={c.id} id={`qr-${c.code}`} value={c.code} size={256} bgColor="#ffffff" fgColor="#000000" />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
