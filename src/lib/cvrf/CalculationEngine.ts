/**
 * CVRF Calculation Engine
 *
 * Pure TypeScript functions for financial calculations:
 * - NPV (Net Present Value)
 * - BCR (Benefit-Cost Ratio)
 * - IRR (Internal Rate of Return) — Newton-Raphson
 * - SROI (Social Return on Investment)
 * - Payback period (interpolated)
 *
 * No UI dependencies. All monetary values in SEK.
 */

export interface YearlyFlows {
  /** Year number (1-based) */
  year: number;
  /** Total benefits for this year */
  benefits: number;
  /** Total costs for this year */
  costs: number;
}

export interface CalculationInput {
  /** Yearly cash flows */
  flows: YearlyFlows[];
  /** Annual discount rate (e.g. 0.03 for 3%) */
  discountRate: number;
}

export interface CalculationResult {
  /** Net Present Value */
  npv: number;
  /** Benefit-Cost Ratio (PV benefits / PV costs) */
  bcr: number;
  /** Internal Rate of Return (null if cannot converge) */
  irr: number | null;
  /** Social Return on Investment: (PV benefits - PV costs) / PV costs */
  sroi: number | null;
  /** Interpolated payback period in years (null if never reached) */
  paybackYears: number | null;
  /** Present Value of all benefits */
  pvBenefits: number;
  /** Present Value of all costs */
  pvCosts: number;
  /** Net benefit per year */
  netPerYear: number[];
  /** Cumulative net benefit per year */
  cumulativePerYear: number[];
}

/**
 * Calculate the present value of a series of values using compound discounting.
 */
export function presentValue(values: number[], discountRate: number): number {
  return values.reduce((sum, v, i) => sum + v / Math.pow(1 + discountRate, i + 1), 0);
}

/**
 * Calculate NPV given net cash flows and a discount rate.
 */
export function calculateNPV(netFlows: number[], discountRate: number): number {
  return netFlows.reduce((sum, v, i) => sum + v / Math.pow(1 + discountRate, i + 1), 0);
}

/**
 * Calculate IRR using Newton-Raphson iteration.
 * Returns null if it fails to converge.
 */
export function calculateIRR(
  netFlows: number[],
  maxIterations: number = 100,
  tolerance: number = 1e-7,
): number | null {
  if (netFlows.length === 0) return null;

  // Check if all flows are the same sign — no IRR exists
  const hasPositive = netFlows.some((f) => f > 0);
  const hasNegative = netFlows.some((f) => f < 0);
  if (!hasPositive || !hasNegative) return null;

  let rate = 0.1; // Initial guess 10%

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let t = 0; t < netFlows.length; t++) {
      const discountFactor = Math.pow(1 + rate, t + 1);
      npv += netFlows[t] / discountFactor;
      derivative -= (t + 1) * netFlows[t] / Math.pow(1 + rate, t + 2);
    }

    if (Math.abs(derivative) < 1e-12) {
      // Derivative too small, try a different starting point
      rate += 0.05;
      continue;
    }

    const newRate = rate - npv / derivative;

    if (Math.abs(newRate - rate) < tolerance) {
      // Check for unreasonable results
      if (newRate < -1 || newRate > 10) return null;
      return newRate;
    }

    rate = newRate;

    // Clamp to reasonable range
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10;
  }

  return null; // Did not converge
}

/**
 * Calculate interpolated payback period.
 * Returns the fractional number of periods until cumulative net crosses zero.
 * Returns null if payback is never reached.
 */
export function calculatePayback(netFlows: number[]): number | null {
  if (netFlows.length === 0) return null;

  let cumulative = 0;

  for (let i = 0; i < netFlows.length; i++) {
    const prevCumulative = cumulative;
    cumulative += netFlows[i];

    if (i === 0 && cumulative >= 0) {
      // Positive from the very first period
      return 0;
    }

    if (cumulative >= 0 && prevCumulative < 0) {
      // Crosses zero during period i
      const fraction = netFlows[i] !== 0
        ? Math.abs(prevCumulative) / netFlows[i]
        : 0;
      return (i - 1) + fraction;
    }
  }

  return null;
}

/**
 * Main calculation function that produces all financial KPIs.
 */
export function calculate(input: CalculationInput): CalculationResult {
  const { flows, discountRate } = input;

  if (flows.length === 0) {
    return {
      npv: 0, bcr: 0, irr: null, sroi: null, paybackYears: null,
      pvBenefits: 0, pvCosts: 0, netPerYear: [], cumulativePerYear: [],
    };
  }

  // Sort by year
  const sorted = [...flows].sort((a, b) => a.year - b.year);

  const benefits = sorted.map((f) => f.benefits);
  const costs = sorted.map((f) => f.costs);
  const netPerYear = sorted.map((f) => f.benefits - f.costs);

  const pvBenefits = presentValue(benefits, discountRate);
  const pvCosts = presentValue(costs, discountRate);
  const npv = pvBenefits - pvCosts;
  const bcr = pvCosts > 0 ? pvBenefits / pvCosts : 0;
  const sroi = pvCosts > 0 ? (pvBenefits - pvCosts) / pvCosts : null;

  const irr = calculateIRR(netPerYear);
  const paybackYears = calculatePayback(netPerYear);

  let cumulative = 0;
  const cumulativePerYear = netPerYear.map((net) => {
    cumulative += net;
    return cumulative;
  });

  return {
    npv,
    bcr,
    irr,
    sroi,
    paybackYears,
    pvBenefits,
    pvCosts,
    netPerYear,
    cumulativePerYear,
  };
}

/**
 * Sensitivity analysis: vary a parameter and observe NPV change.
 * Returns an array of { label, nodeId, npvLow, npvBase, npvHigh, spread }.
 */
export interface SensitivityItem {
  label: string;
  nodeId: string;
  npvLow: number;
  npvBase: number;
  npvHigh: number;
  /** |npvHigh - npvLow| — bigger = more impactful */
  spread: number;
}

export function sensitivityAnalysis(
  baseFlows: YearlyFlows[],
  discountRate: number,
  nodeContributions: { nodeId: string; label: string; yearlyValues: number[]; type: 'benefit' | 'cost' }[],
  variationPct: number = 0.2,
): SensitivityItem[] {
  const baseLine = calculate({ flows: baseFlows, discountRate });
  const results: SensitivityItem[] = [];

  for (const contrib of nodeContributions) {
    const makeModifiedFlows = (multiplier: number): YearlyFlows[] => {
      return baseFlows.map((f, i) => {
        const delta = (contrib.yearlyValues[i] ?? 0) * (multiplier - 1);
        if (contrib.type === 'benefit') {
          return { ...f, benefits: f.benefits + delta };
        } else {
          return { ...f, costs: f.costs + delta };
        }
      });
    };

    const lowFlows = makeModifiedFlows(1 - variationPct);
    const highFlows = makeModifiedFlows(1 + variationPct);

    const npvLow = calculate({ flows: lowFlows, discountRate }).npv;
    const npvHigh = calculate({ flows: highFlows, discountRate }).npv;

    results.push({
      nodeId: contrib.nodeId,
      label: contrib.label,
      npvLow,
      npvBase: baseLine.npv,
      npvHigh,
      spread: Math.abs(npvHigh - npvLow),
    });
  }

  // Sort by spread descending (biggest impact first) — for tornado diagram
  return results.sort((a, b) => b.spread - a.spread);
}
