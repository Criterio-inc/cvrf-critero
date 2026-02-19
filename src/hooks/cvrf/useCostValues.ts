import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CvrfCostValue {
  id: string;
  node_id: string;
  analysis_id: string;
  year: number;
  amount: number | null;
  actual: number | null;
  note: string | null;
  cost_type: string | null;
}

export type CostValueUpsert = Omit<CvrfCostValue, 'id'> & { id?: string };

async function fetchCostValues(analysisId: string): Promise<CvrfCostValue[]> {
  const { data, error } = await supabase
    .from('cvrf_cost_values')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('year', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export function useCostValues(analysisId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['cvrf-cost-values', analysisId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCostValues(analysisId!),
    enabled: !!analysisId,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!analysisId) return;
    const channel = supabase
      .channel(`cvrf-cost-values-${analysisId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'cvrf_cost_values',
        filter: `analysis_id=eq.${analysisId}`,
      }, () => queryClient.invalidateQueries({ queryKey }))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [analysisId, queryClient]);

  const upsertValue = useMutation({
    mutationFn: async (input: CostValueUpsert) => {
      const { data: existing } = await supabase
        .from('cvrf_cost_values')
        .select('id')
        .eq('analysis_id', input.analysis_id)
        .eq('node_id', input.node_id)
        .eq('year', input.year)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('cvrf_cost_values')
          .update({ amount: input.amount })
          .eq('id', existing.id);
        if (error) throw error;
        return existing;
      } else {
        const { data, error } = await supabase
          .from('cvrf_cost_values')
          .insert(input)
          .select();
        if (error) throw error;
        return data?.[0] ?? null;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    costValues: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    upsertValue,
  };
}
