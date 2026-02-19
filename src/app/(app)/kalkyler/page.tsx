'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCvrfAnalyses } from '@/hooks/cvrf/useCvrfAnalyses';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const statusLabels: Record<string, string> = {
  draft: 'Utkast',
  active: 'Aktiv',
  completed: 'Klar',
  archived: 'Arkiverad',
};

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export default function KalkylerPage() {
  const router = useRouter();
  const { analyses, isLoading, createAnalysis } = useCvrfAnalyses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? analyses
    : analyses.filter((a) => a.status === filter);

  const handleCreate = () => {
    if (!newTitle.trim()) return;

    createAnalysis.mutate(
      { title: newTitle.trim() },
      {
        onSuccess: (data) => {
          setDialogOpen(false);
          setNewTitle('');
          router.push(`/kalkyler/${data.id}`);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nyttokalkyler</h1>
          <p className="text-muted-foreground mt-1">
            Hantera och skapa nyttokalkyler
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Ny nyttokalkyl</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Skapa ny nyttokalkyl</DialogTitle>
              <DialogDescription>
                Ge din nyttokalkyl ett namn för att komma igång.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Namn</Label>
                <Input
                  id="title"
                  placeholder="T.ex. Digitalisering av rapportering"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Avbryt
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!newTitle.trim() || createAnalysis.isPending}
              >
                {createAnalysis.isPending ? 'Skapar...' : 'Skapa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'Alla' },
          { key: 'draft', label: 'Utkast' },
          { key: 'active', label: 'Aktiva' },
          { key: 'completed', label: 'Klara' },
        ].map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Lista */}
      {isLoading ? (
        <p className="text-muted-foreground">Laddar nyttokalkyler...</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {filter === 'all'
                ? 'Du har inga nyttokalkyler ännu. Skapa din första!'
                : `Inga nyttokalkyler med status "${statusLabels[filter]}".`}
            </p>
            {filter === 'all' && (
              <Button onClick={() => setDialogOpen(true)}>
                Skapa ny nyttokalkyl
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((analysis) => (
            <Link key={analysis.id} href={`/kalkyler/${analysis.id}`}>
              <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-base leading-tight">
                      {analysis.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={statusColors[analysis.status ?? 'draft']}
                    >
                      {statusLabels[analysis.status ?? 'draft']}
                    </Badge>
                  </div>

                  {analysis.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {analysis.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                    <span>Steg {analysis.current_step ?? 1} av 12</span>
                    {analysis.npv != null && (
                      <span className="font-mono">
                        NPV: {Math.round(analysis.npv).toLocaleString('sv-SE')} kr
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Uppdaterad: {analysis.updated_at
                      ? new Date(analysis.updated_at).toLocaleDateString('sv-SE')
                      : '–'}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
