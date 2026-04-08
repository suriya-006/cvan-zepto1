import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { parseInput as parseManualInput } from '@/lib/code-utils';

interface Props {
  codes: { id: string; code: string; created_at: string }[];
}

export default function SearchBar({ codes }: Props) {
  const [query, setQuery] = useState('');

  const parsed = parseManualInput(query);
  const found = parsed ? codes.find(c => c.code === parsed) : null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search code (e.g. A1A1)"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          maxLength={4}
          className="pl-10 bg-secondary border-border font-mono tracking-widest"
        />
      </div>
      {query.length === 4 && (
        <p className={`text-sm font-mono ${found ? 'text-primary' : 'text-muted-foreground'}`}>
          {parsed ? (
            found
              ? `${parsed} — Already Generated ✓`
              : `${parsed} — Not yet generated`
          ) : 'Invalid code format'}
        </p>
      )}
    </div>
  );
}
