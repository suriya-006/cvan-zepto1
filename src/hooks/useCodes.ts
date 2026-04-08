import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCodes() {
  const queryClient = useQueryClient();

  const codesQuery = useQuery({
    queryKey: ['codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .order('code', { ascending: true });
      if (error) throw error;
      return data as { id: string; code: string; created_at: string }[];
    },
  });

  const addCode = useMutation({
    mutationFn: async (code: string) => {
      // Check duplicate
      const { data: existing } = await supabase
        .from('codes')
        .select('id')
        .eq('code', code)
        .maybeSingle();

      if (existing) {
        throw new Error('Code already exists');
      }

      const { data, error } = await supabase
        .from('codes')
        .insert({ code })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codes'] });
      toast.success('Code generated successfully!');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return { codes: codesQuery.data ?? [], isLoading: codesQuery.isLoading, addCode };
}
