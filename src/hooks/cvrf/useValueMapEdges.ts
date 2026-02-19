import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CvrfEdge {
  id: string;
  analysis_id: string;
  source_node_id: string;
  target_node_id: string;
  edge_type: string | null;
  label: string | null;
  assumption: string | null;
  created_at: string | null;
}

export type EdgeInsert = Pick<CvrfEdge, 'analysis_id' | 'source_node_id' | 'target_node_id'> & {
  edge_type?: string | null;
  label?: string | null;
  assumption?: string | null;
};

async function fetchEdges(analysisId: string): Promise<CvrfEdge[]> {
  const { data, error } = await supabase
    .from('cvrf_edges')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export function useValueMapEdges(analysisId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['cvrf-edges', analysisId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchEdges(analysisId!),
    enabled: !!analysisId,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!analysisId) return;

    const channel = supabase
      .channel(`cvrf-edges-${analysisId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cvrf_edges',
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

  const createEdge = useMutation({
    mutationFn: async (input: EdgeInsert) => {
      const { data, error } = await supabase
        .from('cvrf_edges')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteEdge = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cvrf_edges')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    edges: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createEdge,
    deleteEdge,
  };
}
