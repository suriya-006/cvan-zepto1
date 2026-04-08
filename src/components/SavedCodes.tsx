import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface Props {
  codes: { id: string; code: string; created_at: string }[];
  isLoading: boolean;
}

export default function SavedCodes({ codes, isLoading }: Props) {
  if (isLoading) return <p className="text-center text-muted-foreground">Loading codes...</p>;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-heading font-semibold text-foreground">Saved Codes ({codes.length})</h3>
      {codes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No codes generated yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
          {codes.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-lg px-4 py-2 flex items-center justify-between"
            >
              <span className="font-mono text-sm text-primary">{c.code}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(c.created_at).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
