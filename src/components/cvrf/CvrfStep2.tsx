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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Check, Loader2, X, ShieldCheck } from 'lucide-react';

const alternativeSchema = z.object({
  title: z.string().trim().min(1, 'Ange ett namn').max(200, 'Max 200 tecken'),
  description: z.string().trim().max(5000, 'Max 5000 tecken').optional().default(''),
  pros: z.string().trim().max(5000, 'Max 5000 tecken').optional().default(''),
  cons: z.string().trim().max(5000, 'Max 5000 tecken').optional().default(''),
});

const step2Schema = z.object({
  null_alternative: z.string().trim().max(5000, 'Max 5000 tecken').optional().default(''),
  alternatives: z.array(alternativeSchema).min(1, 'Minst ett alternativ krävs').max(4, 'Max 4 alternativ'),
});

type Step2FormValues = z.infer<typeof step2Schema>;

interface CvrfStep2Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

export function CvrfStep2({ analysis, onUpdate, readOnly }: CvrfStep2Props) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [gate1Checked, setGate1Checked] = useState(analysis.gate1_passed ?? false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  const existingAlternatives = Array.isArray(analysis.alternatives) ? analysis.alternatives : [];

  const form = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema) as any,
    defaultValues: {
      null_alternative: analysis.null_alternative ?? '',
      alternatives: existingAlternatives.length > 0
        ? existingAlternatives
        : [{ title: '', description: '', pros: '', cons: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'alternatives',
  });

  const saveData = useCallback(async (values: Step2FormValues) => {
    const serialized = JSON.stringify(values);
    if (serialized === lastSavedRef.current) return;

    setSaveStatus('saving');
    try {
      await onUpdate({
        null_alternative: values.null_alternative || null,
        alternatives: values.alternatives as any,
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
        const parsed = step2Schema.safeParse(values);
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

  const handleGate1Change = async (checked: boolean) => {
    setGate1Checked(checked);
    await onUpdate({
      gate1_passed: checked,
      gate1_date: checked ? new Date().toISOString() : null,
    });
  };

  const handlePrev = async () => {
    const values = form.getValues();
    const parsed = step2Schema.safeParse(values);
    if (parsed.success) await saveData(parsed.data);
    await onUpdate({ current_step: 1, current_phase: 1 });
  };

  const handleNext = async () => {
    const values = form.getValues();
    const parsed = step2Schema.safeParse(values);
    if (parsed.success) await saveData(parsed.data);
    await onUpdate({ current_step: 3, current_phase: 2 });
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
          {saveStatus === 'saving' && <><Loader2 className="h-3 w-3 animate-spin" /> Sparar...</>}
          {saveStatus === 'saved' && <><Check className="h-3 w-3" /> Sparad</>}
        </Badge>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Nollalternativ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nollalternativ (gör inget)</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="null_alternative"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Vad händer om vi INTE genomför förändringen? Beskriv nulägets konsekvenser över tid..."
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

          {/* Alternativ */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Alternativ</CardTitle>
                {!readOnly && fields.length < 4 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ title: '', description: '', pros: '', cons: '' })}
                  >
                    + Lägg till alternativ
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Lägg till minst ett alternativ.
                </p>
              ) : (
                <Accordion type="multiple" defaultValue={fields.map((_, i) => `alt-${i}`)} className="space-y-3">
                  {fields.map((field, index) => (
                    <AccordionItem key={field.id} value={`alt-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            {index + 1}
                          </Badge>
                          <span className="truncate text-sm font-medium">
                            {form.watch(`alternatives.${index}.title`) || `Alternativ ${index + 1}`}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="flex items-end justify-between gap-2">
                          <FormField
                            control={form.control}
                            name={`alternatives.${index}.title`}
                            render={({ field: f }) => (
                              <FormItem className="flex-1">
                                <FormLabel className="text-xs">Namn</FormLabel>
                                <FormControl>
                                  <Input {...f} placeholder="T.ex. Nytt IT-system" disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {!readOnly && fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="shrink-0 text-destructive hover:text-destructive"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`alternatives.${index}.description`}
                          render={({ field: f }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Beskrivning</FormLabel>
                              <FormControl>
                                <Textarea {...f} placeholder="Beskriv alternativet..." className="min-h-[80px] resize-y" disabled={readOnly} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`alternatives.${index}.pros`}
                            render={({ field: f }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-primary">Fördelar</FormLabel>
                                <FormControl>
                                  <Textarea {...f} placeholder="Vilka fördelar har detta alternativ?" className="min-h-[80px] resize-y" disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`alternatives.${index}.cons`}
                            render={({ field: f }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-destructive">Nackdelar</FormLabel>
                                <FormControl>
                                  <Textarea {...f} placeholder="Vilka nackdelar har detta alternativ?" className="min-h-[80px] resize-y" disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Gate 1 */}
      <Card className={cn(gate1Checked && 'border-primary/30 bg-primary/5')}>
        <CardContent className="flex items-start gap-4 py-5">
          <ShieldCheck className={cn('h-5 w-5 mt-0.5 shrink-0', gate1Checked ? 'text-primary' : 'text-muted-foreground')} />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold">Gate 1 – Behovsanalys</p>
            <p className="text-xs text-muted-foreground">
              Bekräfta att behovsanalysen är komplett innan du fortsätter till kartläggningsfasen.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Checkbox
              id="gate1"
              checked={gate1Checked}
              onCheckedChange={(v) => handleGate1Change(!!v)}
              disabled={readOnly}
            />
            <Label htmlFor="gate1" className="text-xs cursor-pointer select-none">
              Behovsanalysen är komplett och godkänd
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      {!readOnly && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            ← Tillbaka
          </Button>
          <Button onClick={handleNext}>
            Nästa steg →
          </Button>
        </div>
      )}
    </div>
  );
}
