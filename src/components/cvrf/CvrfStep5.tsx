'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useStakeholders, type StakeholderInsert } from '@/hooks/cvrf/useStakeholders';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { Users, X } from 'lucide-react';

const CATEGORIES = [
  { value: 'brukare', label: 'Brukare' },
  { value: 'medarbetare', label: 'Medarbetare' },
  { value: 'organisation', label: 'Organisation' },
  { value: 'samhälle', label: 'Samhälle' },
  { value: 'partner', label: 'Partner' },
] as const;

const categoryLabel = (v: string | null) =>
  CATEGORIES.find((c) => c.value === v)?.label ?? v ?? '—';

const stakeholderSchema = z.object({
  name: z.string().trim().min(1, 'Namn kravs').max(200),
  category: z.string().optional().default(''),
  description: z.string().trim().max(2000).optional().default(''),
  influence_level: z.number().min(1).max(5).default(3),
  interest_level: z.number().min(1).max(5).default(3),
  engagement_plan: z.string().trim().max(2000).optional().default(''),
});

type StakeholderFormValues = z.infer<typeof stakeholderSchema>;

interface CvrfStep5Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

export function CvrfStep5({ analysis, onUpdate, readOnly }: CvrfStep5Props) {
  const { stakeholders, isLoading, createStakeholder, deleteStakeholder } =
    useStakeholders(analysis.id);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<StakeholderFormValues>({
    resolver: zodResolver(stakeholderSchema) as any,
    defaultValues: {
      name: '',
      category: '',
      description: '',
      influence_level: 3,
      interest_level: 3,
      engagement_plan: '',
    },
  });

  const onSubmit = async (values: StakeholderFormValues) => {
    try {
      const input: StakeholderInsert = {
        analysis_id: analysis.id,
        name: values.name,
        category: values.category || null,
        description: values.description || null,
        influence_level: values.influence_level,
        interest_level: values.interest_level,
        engagement_plan: values.engagement_plan || null,
      };
      await createStakeholder.mutateAsync(input);
      toast.success('Intressent tillagd');
      form.reset();
      setDialogOpen(false);
    } catch {
      toast.error('Kunde inte lagga till');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStakeholder.mutateAsync(id);
      toast.success('Intressent borttagen');
    } catch {
      toast.error('Kunde inte ta bort');
    }
  };

  const handlePrev = () => onUpdate({ current_step: 2, current_phase: 1 });
  const handleNext = () => onUpdate({ current_step: 4, current_phase: 2 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + add button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Intressenter
              <Badge variant="secondary" className="text-xs">{stakeholders.length}</Badge>
            </CardTitle>
            {!readOnly && (
              <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
                + Lagg till intressent
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stakeholders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Inga intressenter tillagda annu. Klicka &quot;Lagg till intressent&quot; for att borja.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stakeholders.map((s) => (
                <Card key={s.id} className="border-dashed">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{s.name}</p>
                        {s.category && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {categoryLabel(s.category)}
                          </Badge>
                        )}
                      </div>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-destructive hover:text-destructive h-7 w-7"
                          onClick={() => handleDelete(s.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {s.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                    )}
                    <div className="flex gap-4 text-xs">
                      <span>Inflytande: <strong>{s.influence_level ?? '—'}</strong>/5</span>
                      <span>Intresse: <strong>{s.interest_level ?? '—'}</strong>/5</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Lagg till intressent</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Namn *</FormLabel>
                    <FormControl><Input {...field} placeholder="T.ex. IT-avdelningen" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Valj kategori" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beskrivning</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Beskriv intressentens roll..." className="min-h-[60px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="influence_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inflytande: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1} max={5} step={1}
                          value={[field.value]}
                          onValueChange={([v]) => field.onChange(v)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interest_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intresse: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1} max={5} step={1}
                          value={[field.value]}
                          onValueChange={([v]) => field.onChange(v)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="engagement_plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engagemangsplan</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Hur ska intressenten engageras?" className="min-h-[60px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Avbryt</Button>
                </DialogClose>
                <Button type="submit" disabled={createStakeholder.isPending}>
                  {createStakeholder.isPending ? 'Sparar...' : 'Lagg till'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      {!readOnly && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            ← Tillbaka
          </Button>
          <Button onClick={handleNext}>
            Nasta steg →
          </Button>
        </div>
      )}
    </div>
  );
}
