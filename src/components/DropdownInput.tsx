import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FIRST_LETTERS, SECOND_LETTERS, NUMBERS } from '@/lib/code-utils';

function formatCodeLegacy(l1: string, n1: number, l2: string, n2: number): string {
  return `CVAN-${l1.toUpperCase()}-${n1}-${l2.toUpperCase()}-${n2}`;
}

interface Props {
  onGenerate: (code: string) => void;
  isPending: boolean;
}

export default function DropdownInput({ onGenerate, isPending }: Props) {
  const [l1, setL1] = useState('');
  const [n1, setN1] = useState('');
  const [l2, setL2] = useState('');
  const [n2, setN2] = useState('');

  const isValid = l1 && n1 && l2 && n2;
  const preview = isValid ? formatCodeLegacy(l1, parseInt(n1), l2, parseInt(n2)) : null;

  const handleGenerate = () => {
    if (preview) {
      onGenerate(preview);
      setL1(''); setN1(''); setL2(''); setN2('');
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <ChevronDown className="w-4 h-4" /> Dropdown Selection
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Select value={l1} onValueChange={setL1}>
          <SelectTrigger className="bg-secondary"><SelectValue placeholder="Letter 1" /></SelectTrigger>
          <SelectContent>{FIRST_LETTERS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={n1} onValueChange={setN1}>
          <SelectTrigger className="bg-secondary"><SelectValue placeholder="Num 1" /></SelectTrigger>
          <SelectContent>{NUMBERS.map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={l2} onValueChange={setL2}>
          <SelectTrigger className="bg-secondary"><SelectValue placeholder="Letter 2" /></SelectTrigger>
          <SelectContent>{SECOND_LETTERS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={n2} onValueChange={setN2}>
          <SelectTrigger className="bg-secondary"><SelectValue placeholder="Num 2" /></SelectTrigger>
          <SelectContent>{NUMBERS.map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={handleGenerate} disabled={!isValid || isPending}>Generate</Button>
        {preview && <span className="text-sm font-mono text-primary neon-text">{preview}</span>}
      </div>
    </div>
  );
}
