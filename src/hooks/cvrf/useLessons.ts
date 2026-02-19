import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CvrfLesson {
  id: string;
  analysis_id: string;
  category: string | null;
  title: string;
  description: string | null;
  impact: string | null;
  recommendation: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type LessonInsert = {
  analysis_id: string;
  title: string;
  category?: string | null;
  description?: string | null;
  impact?: string | null;
  recommendation?: string | null;
};

export type LessonUpdate = Partial<
  Omit<CvrfLesson, 'id' | 'analysis_id' | 'created_at' | 'updated_at'>
>;

async function fetchLessons(analysisId: string): Promise<CvrfLesson[]> {
  const { data, error } = await supabase
    .from('cvrf_lessons')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('created_at', { ascending: true });

  if (error) {
    // Graceful fallback if table doesn't exist yet
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return [];
    }
    throw error;
  }
  return data ?? [];
}

export function useLessons(analysisId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['cvrf-lessons', analysisId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchLessons(analysisId!),
    enabled: !!analysisId,
    staleTime: 30000,
    retry: (failureCount, error: any) => {
      if (error?.code === '42P01' || error?.message?.includes('does not exist')) return false;
      return failureCount < 2;
    },
  });

  // Realtime subscription
  useEffect(() => {
    if (!analysisId) return;

    const channel = supabase
      .channel(`cvrf-lessons-${analysisId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cvrf_lessons',
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

  const createLesson = useMutation({
    mutationFn: async (input: LessonInsert) => {
      const { data, error } = await supabase
        .from('cvrf_lessons')
        .insert(input)
        .select();
      if (error) throw error;
      return data?.[0] ?? null;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateLesson = useMutation({
    mutationFn: async ({ id, ...updates }: LessonUpdate & { id: string }) => {
      const { error } = await supabase
        .from('cvrf_lessons')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return { id, ...updates };
    },
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CvrfLesson[]>(queryKey);
      if (previous) {
        queryClient.setQueryData<CvrfLesson[]>(queryKey, (old) =>
          (old ?? []).map((l) => (l.id === id ? { ...l, ...updates } : l))
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

  const deleteLesson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cvrf_lessons')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const tableExists = !query.error;

  return {
    lessons: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    tableExists,
    createLesson,
    updateLesson,
    deleteLesson,
  };
}
