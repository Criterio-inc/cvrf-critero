import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CvrfBenefitValue {
  id: string;
  node_id: string;
  analysis_id: string;
  year: number;
  pessimistic: number | null;
  likely: number | null;
  optimistic: number | null;
  actual: number | null;
  data_source: string | null;
  calculation_notes: string | null;
}

export type BenefitValueUpsert = Omit<CvrfBenefitValue, 'id'> & { id?: string };

async function fetchBenefitValues(analysisId: string): Promise<CvrfBenefitValue[]> {
  const { data, error } = await supabase
    .from('cvrf_benefit_values')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('year', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export function useBenefitValues(analysisId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['cvrf-benefit-values', analysisId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchBenefitValues(analysisId!),
    enabled: !!analysisId,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!analysisId) return;
    const channel = supabase
      .channel(`cvrf-benefit-values-${analysisId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'cvrf_benefit_values',
        filter: `analysis_id=eq.${analysisId}`,
      }, () => queryClient.invalidateQueries({ queryKey }))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [analysisId, queryClient]);

  const upsertValue = useMutation({
    mutationFn: async (input: BenefitValueUpsert) => {
      // Check if exists
      const { data: existing } = await supabase
        .from('cvrf_benefit_values')
        .select('id')
        .eq('analysis_id', input.analysis_id)
        .eq('node_id', input.node_id)
        .eq('year', input.year)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('cvrf_benefit_values')
          .update({ likely: input.likely })
          .eq('id', existing.id);
        if (error) throw error;
        return existing;
      } else {
        const { data, error } = await supabase
          .from('cvrf_benefit_values')
          .insert(input)
          .select();
        if (error) throw error;
        return data?.[0] ?? null;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    benefitValues: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    upsertValue,
  };
}
