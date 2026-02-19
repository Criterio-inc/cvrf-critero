'use client';

import Link from 'next/link';
import { useCvrfAnalyses } from '@/hooks/cvrf/useCvrfAnalyses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

export default function DashboardPage() {
  const { analyses, isLoading } = useCvrfAnalyses();

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
          <CardHeader className="pb-2">
            <CardDescription>Totalt antal kalkyler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? '–' : analyses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Utkast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{isLoading ? '–' : draftCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Aktiva</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{isLoading ? '–' : activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Klara</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{isLoading ? '–' : completedCount}</div>
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
                <Card className="hover:bg-slate-50 transition-colors cursor-pointer">
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
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
