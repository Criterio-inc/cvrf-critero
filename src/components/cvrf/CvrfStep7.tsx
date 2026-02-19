'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Info, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart,
} from 'recharts';
import { useValueMapNodes } from '@/hooks/cvrf/useValueMapNodes';
import { useBenefitValues } from '@/hooks/cvrf/useBenefitValues';
import { useCostValues } from '@/hooks/cvrf/useCostValues';
import { toast } from 'sonner';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { cn } from '@/lib/utils';
import { calculate, type YearlyFlows } from '@/lib/cvrf/CalculationEngine';

interface CvrfStep7Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

function formatSEK(n: number): string {
  return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(n);
}

export function CvrfStep7({ analysis, onUpdate, readOnly }: CvrfStep7Props) {
  const timeHorizon = analysis.time_horizon ?? 6;
  const discountRate = Number(analysis.discount_rate ?? 0.03);
  const years = Array.from({ length: timeHorizon }, (_, i) => i + 1);

  const { benefitNodes, costNodes, isLoading: nodesLoading } = useValueMapNodes(analysis.id);
  const { benefitValues, upsertValue: upsertBenefit } = useBenefitValues(analysis.id);
  const { costValues, upsertValue: upsertCost } = useCostValues(analysis.id);

  // Local edit state for debounced saving
  const [localEdits, setLocalEdits] = useState<Record<string, string>>({});

  const getBenefitValue = useCallback((nodeId: string, year: number): number => {
    const v = benefitValues.find((bv) => bv.node_id === nodeId && bv.year === year);
    return Number(v?.likely ?? 0);
  }, [benefitValues]);

  const getCostValue = useCallback((nodeId: string, year: number): number => {
    const v = costValues.find((cv) => cv.node_id === nodeId && cv.year === year);
    return Number(v?.amount ?? 0);
  }, [costValues]);

  const cellKey = (nodeId: string, year: number) => `${nodeId}-${year}`;

  const getDisplayValue = (nodeId: string, year: number, type: 'benefit' | 'cost'): string => {
    const key = cellKey(nodeId, year);
    // Show local edit if user is still typing
    if (key in localEdits) return localEdits[key];
    const val = type === 'benefit' ? getBenefitValue(nodeId, year) : getCostValue(nodeId, year);
    return val === 0 ? '' : String(val);
  };

  // Debounced save
  useEffect(() => {
    if (Object.keys(localEdits).length === 0) return;
    const timer = setTimeout(() => {
      Object.entries(localEdits).forEach(([key, val]) => {
        const [nodeId, yearStr] = key.split('-');
        const year = parseInt(yearStr);
        const numVal = parseFloat(val) || 0;
        const isBenefit = benefitNodes.some((n) => n.id === nodeId);
        if (isBenefit) {
          upsertBenefit.mutate({
            node_id: nodeId, analysis_id: analysis.id, year, likely: numVal,
            pessimistic: null, optimistic: null, actual: null,
            data_source: null, calculation_notes: null,
          });
        } else {
          upsertCost.mutate({
            node_id: nodeId, analysis_id: analysis.id, year, amount: numVal,
            actual: null, note: null, cost_type: null,
          });
        }
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [localEdits, analysis.id, benefitNodes, upsertBenefit, upsertCost]);

  // Clear localEdits per cell once server data matches the saved value
  useEffect(() => {
    if (Object.keys(localEdits).length === 0) return;
    const updatedEdits = { ...localEdits };
    let changed = false;
    for (const [key, val] of Object.entries(updatedEdits)) {
      const [nodeId, yearStr] = key.split('-');
      const year = parseInt(yearStr);
      const numVal = parseFloat(val) || 0;
      const isBenefit = benefitNodes.some((n) => n.id === nodeId);
      const serverVal = isBenefit ? getBenefitValue(nodeId, year) : getCostValue(nodeId, year);
      if (Math.abs(serverVal - numVal) < 0.01) {
        delete updatedEdits[key];
        changed = true;
      }
    }
    if (changed) {
      setLocalEdits(updatedEdits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitValues, costValues]);

  // Build yearly flows for the calculation engine
  const yearlyFlows: YearlyFlows[] = useMemo(() =>
    years.map((y) => ({
      year: y,
      benefits: benefitNodes.reduce((sum, n) => sum + getBenefitValue(n.id, y), 0),
      costs: costNodes.reduce((sum, n) => sum + getCostValue(n.id, y), 0),
    })),
    [years, benefitNodes, costNodes, getBenefitValue, getCostValue]
  );

  // Calculations via engine
  const calculations = useMemo(() => {
    const result = calculate({ flows: yearlyFlows, discountRate });
    const totalBenefitsPerYear = yearlyFlows.map((f) => f.benefits);
    const totalCostsPerYear = yearlyFlows.map((f) => f.costs);

    return {
      totalBenefitsPerYear,
      totalCostsPerYear,
      netPerYear: result.netPerYear,
      cumulativePerYear: result.cumulativePerYear,
      npv: result.npv,
      bcr: result.bcr,
      irr: result.irr,
      sroi: result.sroi,
      paybackYear: result.paybackYears != null ? Math.ceil(result.paybackYears) : null,
      paybackYearsExact: result.paybackYears,
      pvBenefits: result.pvBenefits,
      pvCosts: result.pvCosts,
    };
  }, [yearlyFlows, discountRate]);

  // Save KPIs to analysis
  useEffect(() => {
    const { npv, bcr, irr, sroi, paybackYear } = calculations;
    const currentNpv = Number(analysis.npv ?? 0);
    const currentBcr = Number(analysis.bcr ?? 0);
    const currentIrr = analysis.irr != null ? Number(analysis.irr) : null;
    const currentSroi = analysis.sroi != null ? Number(analysis.sroi) : null;
    const currentPayback = analysis.payback_years != null ? Number(analysis.payback_years) : null;

    const needsUpdate =
      Math.abs(currentNpv - npv) > 0.01 ||
      Math.abs(currentBcr - bcr) > 0.01 ||
      (irr !== null && (currentIrr === null || Math.abs(currentIrr - irr) > 0.0001)) ||
      (sroi !== null && (currentSroi === null || Math.abs(currentSroi - sroi) > 0.01)) ||
      currentPayback !== paybackYear;

    if (needsUpdate) {
      onUpdate({ npv, bcr, irr, sroi, payback_years: paybackYear });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculations.npv, calculations.bcr, calculations.irr, calculations.sroi, calculations.paybackYear]);

  const handleCellChange = (nodeId: string, year: number, value: string) => {
    setLocalEdits((prev) => ({ ...prev, [cellKey(nodeId, year)]: value }));
  };

  const handlePrev = () => onUpdate({ current_step: 6, current_phase: 3 });
  const handleNext = () => onUpdate({ current_step: 8, current_phase: 3 });

  if (nodesLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  const hasNodes = benefitNodes.length > 0 || costNodes.length > 0;
  if (!hasNodes) {
    return (
      <div className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Du behöver skapa nyttor och kostnader i Value Map (Steg 4) innan du kan fylla i beräkningar.
          </AlertDescription>
        </Alert>
        {!readOnly && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrev} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Tillbaka
            </Button>
            <Button onClick={handleNext} className="gap-2">
              Nästa steg <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Chart data
  const chartData = years.map((y, i) => ({
    name: `År ${y}`,
    Nyttor: calculations.totalBenefitsPerYear[i],
    Kostnader: calculations.totalCostsPerYear[i],
    'Kumulativt netto': calculations.cumulativePerYear[i],
  }));

  return (
    <div className="space-y-6">
      {/* Calculation table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Beräkningstabell
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Diskonteringsränta: {(discountRate * 100).toFixed(1)}% · Tidshorisont: {timeHorizon} år
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px] sticky left-0 bg-card z-10">Post</TableHead>
                  {years.map((y) => (
                    <TableHead key={y} className="text-right min-w-[100px]">År {y}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Benefit rows */}
                {benefitNodes.map((node) => (
                  <TableRow key={node.id}>
                    <TableCell className="sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-status-green shrink-0" />
                        <span className="text-sm truncate">{node.title}</span>
                      </div>
                    </TableCell>
                    {years.map((y) => (
                      <TableCell key={y} className="p-1">
                        <Input
                          type="number"
                          className="h-8 text-xs text-right w-full"
                          value={getDisplayValue(node.id, y, 'benefit')}
                          onChange={(e) => handleCellChange(node.id, y, e.target.value)}
                          disabled={readOnly}
                          placeholder="0"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* Total benefits */}
                <TableRow className="bg-muted/30 font-medium">
                  <TableCell className="sticky left-0 bg-muted/30 z-10 text-sm">
                    Total nyttor
                  </TableCell>
                  {years.map((y, i) => (
                    <TableCell key={y} className="text-right text-sm text-status-green">
                      {formatSEK(calculations.totalBenefitsPerYear[i])}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Cost rows */}
                {costNodes.map((node) => (
                  <TableRow key={node.id}>
                    <TableCell className="sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-3 w-3 text-destructive shrink-0" />
                        <span className="text-sm truncate">{node.title}</span>
                      </div>
                    </TableCell>
                    {years.map((y) => (
                      <TableCell key={y} className="p-1">
                        <Input
                          type="number"
                          className="h-8 text-xs text-right w-full"
                          value={getDisplayValue(node.id, y, 'cost')}
                          onChange={(e) => handleCellChange(node.id, y, e.target.value)}
                          disabled={readOnly}
                          placeholder="0"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* Total costs */}
                <TableRow className="bg-muted/30 font-medium">
                  <TableCell className="sticky left-0 bg-muted/30 z-10 text-sm">
                    Total kostnader
                  </TableCell>
                  {years.map((y, i) => (
                    <TableCell key={y} className="text-right text-sm text-destructive">
                      {formatSEK(calculations.totalCostsPerYear[i])}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Net row */}
                <TableRow className="bg-primary/5 font-bold border-t-2">
                  <TableCell className="sticky left-0 bg-primary/5 z-10 text-sm">
                    Netto
                  </TableCell>
                  {years.map((y, i) => (
                    <TableCell key={y} className={cn(
                      'text-right text-sm',
                      calculations.netPerYear[i] >= 0 ? 'text-status-green' : 'text-destructive'
                    )}>
                      {formatSEK(calculations.netPerYear[i])}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nettonuvärde (NPV)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              'text-2xl font-bold',
              calculations.npv >= 0 ? 'text-status-green' : 'text-destructive'
            )}>
              {formatSEK(calculations.npv)} kr
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              PV nyttor: {formatSEK(calculations.pvBenefits)} kr · PV kostnader: {formatSEK(calculations.pvCosts)} kr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nytta/Kostnad-kvot (BCR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              'text-2xl font-bold',
              calculations.bcr >= 1 ? 'text-status-green' : 'text-destructive'
            )}>
              {calculations.bcr.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {calculations.bcr >= 1 ? 'Nyttorna överstiger kostnaderna' : 'Kostnaderna överstiger nyttorna'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Internränta (IRR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              'text-2xl font-bold',
              calculations.irr != null && calculations.irr > discountRate
                ? 'text-status-green'
                : calculations.irr != null ? 'text-destructive' : ''
            )}>
              {calculations.irr != null ? `${(calculations.irr * 100).toFixed(1)}%` : '\u2014'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {calculations.irr != null
                ? calculations.irr > discountRate
                  ? `Över diskonteringsräntan (${(discountRate * 100).toFixed(1)}%)`
                  : `Under diskonteringsräntan (${(discountRate * 100).toFixed(1)}%)`
                : 'Kan ej beräknas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              'text-2xl font-bold',
              calculations.sroi != null && calculations.sroi > 0 ? 'text-status-green' : 'text-destructive'
            )}>
              {calculations.sroi != null ? calculations.sroi.toFixed(2) : '\u2014'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {calculations.sroi != null
                ? `Varje investerad krona ger ${(1 + calculations.sroi).toFixed(2)} kr tillbaka`
                : 'Kan ej beräknas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Återbetalningstid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculations.paybackYearsExact != null
                ? `${calculations.paybackYearsExact.toFixed(1)} år`
                : '\u2014'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {calculations.paybackYearsExact != null
                ? 'Interpolerad återbetalningstid'
                : 'Ej uppnådd inom tidshorisonten'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nyttor & kostnader per år</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                formatter={(value) => formatSEK(Number(value ?? 0)) + ' kr'}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar dataKey="Nyttor" fill="hsl(var(--status-green))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Kostnader" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="Kumulativt netto"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Navigation */}
      {!readOnly && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Tillbaka
          </Button>
          <Button onClick={handleNext} className="gap-2">
            Nästa steg <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
