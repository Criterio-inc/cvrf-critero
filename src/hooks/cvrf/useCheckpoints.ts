import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CvrfCheckpoint {
  id: string;
  analysis_id: string;
  checkpoint_date: string;
  checkpoint_type: string | null;
  status: string | null;
  overall_realization_percent: number | null;
  findings: string | null;
  corrective_actions: string | null;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string | null;
}

export type CheckpointInsert = {
  analysis_id: string;
  checkpoint_date: string;
  checkpoint_type?: string | null;
  status?: string | null;
};

export type CheckpointUpdate = Partial<
  Omit<CvrfCheckpoint, 'id' | 'analysis_id' | 'created_at'>
>;

async function fetchCheckpoints(analysisId: string): Promise<CvrfCheckpoint[]> {
  const { data, error } = await supabase
    .from('cvrf_checkpoints')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('checkpoint_date', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export function useCheckpoints(analysisId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['cvrf-checkpoints', analysisId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCheckpoints(analysisId!),
    enabled: !!analysisId,
    staleTime: 30000,
  });

  // Realtime subscription
  useEffect(() => {
    if (!analysisId) return;

    const channel = supabase
      .channel(`cvrf-checkpoints-${analysisId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cvrf_checkpoints',
          filter: `analysis_id=eq.${analysisId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [analysisId, queryClient]);

  const createCheckpoint = useMutation({
    mutationFn: async (input: CheckpointInsert) => {
      const { data, error } = await supabase
        .from('cvrf_checkpoints')
        .insert(input)
        .select();
      if (error) throw error;
      return data?.[0] ?? null;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateCheckpoint = useMutation({
    mutationFn: async ({ id, ...updates }: CheckpointUpdate & { id: string }) => {
      const { error } = await supabase
        .from('cvrf_checkpoints')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return { id, ...updates };
    },
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CvrfCheckpoint[]>(queryKey);
      if (previous) {
        queryClient.setQueryData<CvrfCheckpoint[]>(queryKey, (old) =>
          (old ?? []).map((cp) => (cp.id === id ? { ...cp, ...updates } : cp))
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteCheckpoint = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cvrf_checkpoints')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    checkpoints: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createCheckpoint,
    updateCheckpoint,
    deleteCheckpoint,
  };
}
