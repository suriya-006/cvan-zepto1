import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ManualInput from '@/components/ManualInput';
import DropdownInput from '@/components/DropdownInput';
import VoiceInput from '@/components/VoiceInput';
import QRPreview from '@/components/QRPreview';
import SearchBar from '@/components/SearchBar';
import SavedCodes from '@/components/SavedCodes';
import { useCodes } from '@/hooks/useCodes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Keyboard, ChevronDown, Mic } from 'lucide-react';

export default function Index() {
  const { codes, isLoading, addCode } = useCodes();
  const [lastCode, setLastCode] = useState<string | null>(null);

  const handleGenerate = (code: string) => {
    setLastCode(code);
    addCode.mutate(code);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background grid effect */}
      <div className="fixed inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 pb-16">
        <Header />
        <HeroSection />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8 space-y-6"
        >
          <Tabs defaultValue="manual">
            <TabsList className="w-full bg-secondary">
              <TabsTrigger value="manual" className="flex-1 gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Keyboard className="w-4 h-4" /> Manual
              </TabsTrigger>
              <TabsTrigger value="dropdown" className="flex-1 gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ChevronDown className="w-4 h-4" /> Dropdown
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex-1 gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Mic className="w-4 h-4" /> Voice
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manual"><ManualInput onGenerate={handleGenerate} isPending={addCode.isPending} /></TabsContent>
            <TabsContent value="dropdown"><DropdownInput onGenerate={handleGenerate} isPending={addCode.isPending} /></TabsContent>
            <TabsContent value="voice"><VoiceInput onGenerate={handleGenerate} isPending={addCode.isPending} /></TabsContent>
          </Tabs>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <QRPreview code={lastCode} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            <SearchBar codes={codes} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <SavedCodes codes={codes} isLoading={isLoading} />
        </motion.div>
      </div>
    </div>
  );
}
