import { useState } from 'react';
import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseInput as parseManualInput } from '@/lib/code-utils';

interface Props {
  onGenerate: (code: string) => void;
  isPending: boolean;
}

export default function ManualInput({ onGenerate, isPending }: Props) {
  const [value, setValue] = useState('');
  const preview = parseManualInput(value);

  const handleSubmit = () => {
    if (preview) {
      onGenerate(preview);
      setValue('');
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Keyboard className="w-4 h-4" /> Manual Input
      </label>
      <div className="flex gap-2">
        <Input
          placeholder="e.g. A1A1"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          maxLength={4}
          className="bg-secondary border-border font-mono text-lg tracking-widest"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button onClick={handleSubmit} disabled={!preview || isPending}>
          Generate
        </Button>
      </div>
      {value && (
        <p className={`text-sm font-mono ${preview ? 'text-primary neon-text' : 'text-destructive'}`}>
          {preview ?? 'Invalid format — use like A1A1'}
        </p>
      )}
    </div>
  );
}
