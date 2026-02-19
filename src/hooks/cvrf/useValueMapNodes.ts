import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CvrfNode {
  id: string;
  analysis_id: string;
  node_type: string;
  title: string;
  description: string | null;
  benefit_category: string | null;
  time_perspective: string | null;
  confidence: string | null;
  stakeholder_id: string | null;
  linked_risk_id: string | null;
  linked_effect_goal_id: string | null;
  linked_budget_id: string | null;
  assumption_text: string | null;
  assumption_validated: boolean | null;
  position_x: number | null;
  position_y: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export type NodeUpdate = Partial<Pick<
  CvrfNode,
  'benefit_category' | 'time_perspective' | 'confidence' | 'stakeholder_id' |
  'title' | 'description' | 'assumption_text' | 'assumption_validated' |
  'position_x' | 'position_y' |
  'linked_risk_id' | 'linked_effect_goal_id' | 'linked_budget_id'
>>;

export type NodeInsert = {
  analysis_id: string;
  node_type: string;
  title: string;
  description?: string | null;
  position_x?: number | null;
  position_y?: number | null;
};

async function fetchNodes(analysisId: string): Promise<CvrfNode[]> {
  const { data, error } = await supabase
    .from('cvrf_nodes')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export function useValueMapNodes(analysisId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['cvrf-nodes', analysisId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchNodes(analysisId!),
    enabled: !!analysisId,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!analysisId) return;

    const channel = supabase
      .channel(`cvrf-nodes-${analysisId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cvrf_nodes',
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

  const createNode = useMutation({
    mutationFn: async (input: NodeInsert) => {
      const { data, error } = await supabase
        .from('cvrf_nodes')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateNode = useMutation({
    mutationFn: async ({ id, ...updates }: NodeUpdate & { id: string }) => {
      const { error } = await supabase
        .from('cvrf_nodes')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return { id, ...updates };
    },
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CvrfNode[]>(queryKey);
      if (previous) {
        queryClient.setQueryData<CvrfNode[]>(queryKey, (old) =>
          (old ?? []).map((node) => node.id === id ? { ...node, ...updates } : node)
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

  const deleteNode = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cvrf_nodes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const benefitNodes = (query.data ?? []).filter((n) => n.node_type === 'benefit');
  const costNodes = (query.data ?? []).filter((n) => n.node_type === 'cost');

  return {
    nodes: query.data ?? [],
    benefitNodes,
    costNodes,
    isLoading: query.isLoading,
    error: query.error,
    createNode,
    updateNode,
    deleteNode,
  };
}
