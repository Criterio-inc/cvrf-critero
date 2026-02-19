import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CvrfBenefitOwner {
  id: string;
  node_id: string;
  owner_name: string;
  owner_role: string | null;
  baseline_value: number | null;
  target_value: number | null;
  kpi_description: string | null;
  measurement_frequency: string | null;
  first_measurement_date: string | null;
  linked_effect_goal_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type BenefitOwnerInsert = {
  node_id: string;
  owner_name: string;
  owner_role?: string | null;
  baseline_value?: number | null;
  target_value?: number | null;
  kpi_description?: string | null;
  measurement_frequency?: string | null;
  first_measurement_date?: string | null;
  linked_effect_goal_id?: string | null;
};

export type BenefitOwnerUpdate = Partial<
  Omit<CvrfBenefitOwner, 'id' | 'node_id' | 'created_at' | 'updated_at'>
>;

async function fetchBenefitOwners(nodeIds: string[]): Promise<CvrfBenefitOwner[]> {
  if (nodeIds.length === 0) return [];
  const { data, error } = await supabase
    .from('cvrf_benefit_owners')
    .select('*')
    .in('node_id', nodeIds)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export function useBenefitOwners(nodeIds: string[]) {
  const queryClient = useQueryClient();
  const stableKey = useMemo(() => [...nodeIds].sort().join(','), [nodeIds]);
  const queryKey = ['cvrf-benefit-owners', stableKey];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchBenefitOwners(nodeIds),
    enabled: nodeIds.length > 0,
    staleTime: 30000,
  });

  // Realtime subscription
  useEffect(() => {
    if (nodeIds.length === 0) return;

    const channel = supabase
      .channel(`cvrf-benefit-owners-${stableKey.slice(0, 50)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cvrf_benefit_owners',
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [stableKey, queryClient]);

  const createOwner = useMutation({
    mutationFn: async (input: BenefitOwnerInsert) => {
      const { data, error } = await supabase
        .from('cvrf_benefit_owners')
        .insert(input)
        .select();
      if (error) throw error;
      return data?.[0] ?? null;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateOwner = useMutation({
    mutationFn: async ({ id, ...updates }: BenefitOwnerUpdate & { id: string }) => {
      const { error } = await supabase
        .from('cvrf_benefit_owners')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return { id, ...updates };
    },
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CvrfBenefitOwner[]>(queryKey);
      if (previous) {
        queryClient.setQueryData<CvrfBenefitOwner[]>(queryKey, (old) =>
          (old ?? []).map((o) => (o.id === id ? { ...o, ...updates } : o))
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

  const deleteOwner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cvrf_benefit_owners')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const getOwnerForNode = useCallback(
    (nodeId: string) => (query.data ?? []).find((o) => o.node_id === nodeId),
    [query.data]
  );

  return {
    owners: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createOwner,
    updateOwner,
    deleteOwner,
    getOwnerForNode,
  };
}
