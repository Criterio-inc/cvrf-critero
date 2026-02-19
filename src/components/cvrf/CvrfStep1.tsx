'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { cn } from '@/lib/utils';

const smartGoalSchema = z.object({
  title: z.string().trim().min(1, 'Ange ett målnamn').max(200, 'Max 200 tecken'),
  metric: z.string().trim().max(200, 'Max 200 tecken').optional().default(''),
  target_date: z.string().optional().default(''),
});

const step1Schema = z.object({
  problem_description: z.string().trim().max(5000, 'Max 5000 tecken').optional().default(''),
  strategic_alignment: z.string().trim().max(5000, 'Max 5000 tecken').optional().default(''),
  smart_goals: z.array(smartGoalSchema).default([]),
});

type Step1FormValues = z.infer<typeof step1Schema>;

interface CvrfStep1Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

export function CvrfStep1({ analysis, onUpdate, readOnly }: CvrfStep1Props) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  const form = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema) as any,
    defaultValues: {
      problem_description: analysis.problem_description ?? '',
      strategic_alignment: analysis.strategic_alignment ?? '',
      smart_goals: Array.isArray(analysis.smart_goals) ? analysis.smart_goals : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'smart_goals',
  });

  const saveData = useCallback(async (values: Step1FormValues) => {
    const serialized = JSON.stringify(values);
    if (serialized === lastSavedRef.current) return;

    setSaveStatus('saving');
    try {
      await onUpdate({
        problem_description: values.problem_description || null,
        strategic_alignment: values.strategic_alignment || null,
        smart_goals: values.smart_goals as any,
      });
      lastSavedRef.current = serialized;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('idle');
    }
  }, [onUpdate]);

  useEffect(() => {
    if (readOnly) return;

    const subscription = form.watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const parsed = step1Schema.safeParse(values);
        if (parsed.success) {
          saveData(parsed.data);
        }
      }, 500);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form, saveData, readOnly]);

  const handleNextStep = async () => {
    const values = form.getValues();
    const parsed = step1Schema.safeParse(values);
    if (parsed.success) {
      await saveData(parsed.data);
    }
    await onUpdate({ current_step: 2, current_phase: 1 });
  };

  return (
    <div className="space-y-6">
      {/* Save indicator */}
      <div className="flex justify-end">
        <Badge
          variant="outline"
          className={cn(
            'transition-opacity text-xs gap-1',
            saveStatus === 'idle' && 'opacity-0',
            saveStatus !== 'idle' && 'opacity-100'
          )}
        >
          {saveStatus === 'saving' && '⟳ Sparar...'}
          {saveStatus === 'saved' && '✓ Sparad'}
        </Badge>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Problembeskrivning */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Problembeskrivning</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="problem_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Beskriv det underliggande problemet eller behovet som driver förändringen..."
                        className="min-h-[120px] resize-y"
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Strategisk koppling */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Strategisk koppling</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="strategic_alignment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Hur kopplar detta till organisationens övergripande mål och strategi?"
                        className="min-h-[120px] resize-y"
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* SMART-mål */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">SMART-mål</CardTitle>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ title: '', metric: '', target_date: '' })}
                  >
                    + Lägg till mål
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Inga SMART-mål tillagda ännu. Klicka &quot;Lägg till mål&quot; för att börja.
                </p>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="border-dashed">
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <FormField
                            control={form.control}
                            name={`smart_goals.${index}.title`}
                            render={({ field: f }) => (
                              <FormItem className="flex-1">
                                <FormLabel className="text-xs">Mål</FormLabel>
                                <FormControl>
                                  <Input
                                    {...f}
                                    placeholder="T.ex. Minska handläggningstiden med 30%"
                                    disabled={readOnly}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {!readOnly && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="mt-6 shrink-0 text-destructive hover:text-destructive"
                              onClick={() => remove(index)}
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`smart_goals.${index}.metric`}
                            render={({ field: f }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Mätetal</FormLabel>
                                <FormControl>
                                  <Input
                                    {...f}
                                    placeholder="T.ex. Antal dagar per ärende"
                                    disabled={readOnly}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`smart_goals.${index}.target_date`}
                            render={({ field: f }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Måldatum</FormLabel>
                                <FormControl>
                                  <Input
                                    {...f}
                                    type="date"
                                    disabled={readOnly}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Navigation */}
      {!readOnly && (
        <div className="flex justify-end">
          <Button onClick={handleNextStep}>
            Nästa steg →
          </Button>
        </div>
      )}
    </div>
  );
}
