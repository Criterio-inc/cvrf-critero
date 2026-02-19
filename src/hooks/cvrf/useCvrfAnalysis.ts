import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CvrfAnalysis {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  status: string | null;
  current_phase: number | null;
  current_step: number | null;
  problem_description: string | null;
  strategic_alignment: string | null;
  null_alternative: string | null;
  smart_goals: any;
  alternatives: any;
  time_horizon: number | null;
  discount_rate: number | null;
  npv: number | null;
  bcr: number | null;
  irr: number | null;
  sroi: number | null;
  payback_years: number | null;
  gate1_passed: boolean | null;
  gate1_date: string | null;
  gate2_passed: boolean | null;
  gate2_date: string | null;
  gate3_passed: boolean | null;
  gate3_date: string | null;
  gate4_passed: boolean | null;
  gate4_date: string | null;
  gate5_passed: boolean | null;
  gate5_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

async function fetchAnalysisById(analysisId: string): Promise<CvrfAnalysis | null> {
  const { data, error } = await supabase
    .from('cvrf_analyses')
    .select('*')
    .eq('id', analysisId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function useCvrfAnalysis(analysisId: string | undefined) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = ['cvrf-analysis', analysisId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchAnalysisById(analysisId!),
    enabled: !!analysisId,
    staleTime: 30000,
  });

  // Realtime subscription
  useEffect(() => {
    if (!analysisId) return;

    const channel = supabase
      .channel(`cvrf-analysis-${analysisId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cvrf_analyses',
          filter: `id=eq.${analysisId}`,
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

  const createAnalysis = useMutation({
    mutationFn: async ({ title }: { title: string }) => {
      if (!user) throw new Error('Ej inloggad');

      const { data, error } = await supabase
        .from('cvrf_analyses')
        .insert({
          owner_id: user.id,
          title,
          status: 'draft',
          current_phase: 1,
          current_step: 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data as CvrfAnalysis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvrf-analyses'] });
    },
  });

  const updateAnalysis = useMutation({
    mutationFn: async (updates: Partial<CvrfAnalysis>) => {
      if (!analysisId) throw new Error('Missing analysisId');

      const { error } = await supabase
        .from('cvrf_analyses')
        .update(updates)
        .eq('id', analysisId);

      if (error) throw error;
      return { id: analysisId, ...updates };
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CvrfAnalysis | null>(queryKey);
      if (previous) {
        queryClient.setQueryData<CvrfAnalysis | null>(queryKey, {
          ...previous,
          ...updates,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    analysis: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createAnalysis,
    updateAnalysis,
  };
}
