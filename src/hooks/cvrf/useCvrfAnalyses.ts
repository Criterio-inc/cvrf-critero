/**
 * Hook for fetching ALL CVRF analyses the current user has access to.
 * Used by the dashboard/kalkyler list page.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { CvrfAnalysis } from './useCvrfAnalysis';

async function fetchAllAnalyses(): Promise<CvrfAnalysis[]> {
  const { data, error } = await supabase
    .from('cvrf_analyses')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as CvrfAnalysis[];
}

export function useCvrfAnalyses() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = ['cvrf-analyses'];

  const query = useQuery({
    queryKey,
    queryFn: fetchAllAnalyses,
    staleTime: 30000,
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('cvrf-analyses-all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cvrf_analyses',
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  /** Create a new analysis. */
  const createAnalysis = useMutation({
    mutationFn: async (params: { title: string }) => {
      if (!user) throw new Error('Ej inloggad');

      const { data, error } = await supabase
        .from('cvrf_analyses')
        .insert({
          title: params.title,
          owner_id: user.id,
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
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    analyses: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createAnalysis,
  };
}
