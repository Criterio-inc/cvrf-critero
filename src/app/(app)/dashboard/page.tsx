'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCvrfAnalyses } from '@/hooks/cvrf/useCvrfAnalyses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calculator, FileEdit, Play, CheckCircle2, Trash2 } from 'lucide-react';

const statusLabels: Record<string, string> = {
  draft: 'Utkast',
  active: 'Aktiv',
  completed: 'Klar',
  archived: 'Arkiverad',
};

const statusColors: Record<string, string> = {
  draft: 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  active: 'bg-primary/10 text-primary',
  completed: 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  archived: 'bg-muted text-muted-foreground',
};

export default function DashboardPage() {
  const { analyses, isLoading, deleteAnalysis } = useCvrfAnalyses();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const recent = analyses.slice(0, 5);
  const draftCount = analyses.filter((a) => a.status === 'draft').length;
  const activeCount = analyses.filter((a) => a.status === 'active').length;
  const completedCount = analyses.filter((a) => a.status === 'completed').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Översikt</h1>
        <p className="text-muted-foreground mt-1">
          Välkommen till CVRF Nyttokalkyl
        </p>
      </div>

      {/* KPI-kort */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Totalt antal kalkyler</CardDescription>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? '--' : analyses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Utkast</CardDescription>
            <FileEdit className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{isLoading ? '--' : draftCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Aktiva</CardDescription>
            <Play className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{isLoading ? '--' : activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription>Klara</CardDescription>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{isLoading ? '--' : completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Senaste kalkyler */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Senaste nyttokalkyler</h2>
          <Link href="/kalkyler">
            <Button variant="outline" size="sm">
              Visa alla
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Laddar...</p>
        ) : recent.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Du har inga nyttokalkyler ännu.
              </p>
              <Link href="/kalkyler">
                <Button>Skapa din första kalkyl</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recent.map((analysis) => (
              <Link key={analysis.id} href={`/kalkyler/${analysis.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{analysis.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Steg {analysis.current_step ?? 1} av 12
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {analysis.npv != null && (
                        <span className="text-sm font-mono">
                          NPV: {Math.round(analysis.npv).toLocaleString('sv-SE')} kr
                        </span>
                      )}
                      <Badge
                        variant="secondary"
                        className={statusColors[analysis.status ?? 'draft']}
                      >
                        {statusLabels[analysis.status ?? 'draft']}
                      </Badge>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteTarget(analysis.id);
                        }}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label="Radera"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Radera nyttokalkyl?</DialogTitle>
            <DialogDescription>
              Denna åtgärd kan inte ångras. Kalkylen och all data kopplad till den kommer att tas bort permanent.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Avbryt
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  deleteAnalysis.mutate(deleteTarget);
                  setDeleteTarget(null);
                }
              }}
            >
              Radera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
