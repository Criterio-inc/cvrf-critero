import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CvrfStakeholder {
  id: string;
  analysis_id: string;
  name: string;
  category: string | null;
  description: string | null;
  influence_level: number | null;
  interest_level: number | null;
  engagement_plan: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type StakeholderInsert = Omit<CvrfStakeholder, 'id' | 'created_at' | 'updated_at'>;
export type StakeholderUpdate = Partial<Omit<CvrfStakeholder, 'id' | 'analysis_id' | 'created_at' | 'updated_at'>>;

async function fetchStakeholders(analysisId: string): Promise<CvrfStakeholder[]> {
  const { data, error } = await supabase
    .from('cvrf_stakeholders')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export function useStakeholders(analysisId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['cvrf-stakeholders', analysisId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchStakeholders(analysisId!),
    enabled: !!analysisId,
    staleTime: 30000,
  });

  // Realtime subscription
  useEffect(() => {
    if (!analysisId) return;

    const channel = supabase
      .channel(`cvrf-stakeholders-${analysisId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cvrf_stakeholders',
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

  const createStakeholder = useMutation({
    mutationFn: async (input: StakeholderInsert) => {
      const { data, error } = await supabase
        .from('cvrf_stakeholders')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateStakeholder = useMutation({
    mutationFn: async ({ id, ...updates }: StakeholderUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('cvrf_stakeholders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteStakeholder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cvrf_stakeholders')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    stakeholders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createStakeholder,
    updateStakeholder,
    deleteStakeholder,
  };
}
