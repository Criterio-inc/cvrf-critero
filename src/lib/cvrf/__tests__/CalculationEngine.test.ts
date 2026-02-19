import { describe, it, expect } from 'vitest';
import {
  presentValue,
  calculateNPV,
  calculateIRR,
  calculatePayback,
  calculate,
  sensitivityAnalysis,
  type YearlyFlows,
} from '../CalculationEngine';

describe('presentValue', () => {
  it('should return 0 for empty array', () => {
    expect(presentValue([], 0.03)).toBe(0);
  });

  it('should discount single value correctly', () => {
    const result = presentValue([100], 0.10);
    expect(result).toBeCloseTo(90.909, 2);
  });

  it('should discount multiple values correctly', () => {
    const result = presentValue([100, 200, 300], 0.05);
    expect(result).toBeCloseTo(535.795, 0);
  });

  it('should handle zero discount rate', () => {
    const result = presentValue([100, 100, 100], 0);
    expect(result).toBe(300);
  });
});

describe('calculateNPV', () => {
  it('should return 0 for empty flows', () => {
    expect(calculateNPV([], 0.03)).toBe(0);
  });

  it('should calculate NPV for standard project', () => {
    const flows = [-1000, 500, 500, 500];
    const npv = calculateNPV(flows, 0.10);
    expect(npv).toBeCloseTo(-1000/1.1 + 500/1.21 + 500/1.331 + 500/1.4641, 1);
  });

  it('should return negative NPV for unprofitable project', () => {
    const flows = [-1000, 100, 100, 100];
    const npv = calculateNPV(flows, 0.10);
    expect(npv).toBeLessThan(0);
  });
});

describe('calculateIRR', () => {
  it('should return null for empty flows', () => {
    expect(calculateIRR([])).toBeNull();
  });

  it('should return null for all-positive flows', () => {
    expect(calculateIRR([100, 200, 300])).toBeNull();
  });

  it('should return null for all-negative flows', () => {
    expect(calculateIRR([-100, -200, -300])).toBeNull();
  });

  it('should calculate IRR for simple project', () => {
    const irr = calculateIRR([-1000, 500, 500, 500]);
    expect(irr).not.toBeNull();
    expect(irr!).toBeCloseTo(0.234, 1);
  });

  it('should find exact IRR for known case', () => {
    const irr = calculateIRR([-100, 110]);
    expect(irr).not.toBeNull();
    expect(irr!).toBeCloseTo(0.10, 2);
  });
});

describe('calculatePayback', () => {
  it('should return null for empty flows', () => {
    expect(calculatePayback([])).toBeNull();
  });

  it('should return null when payback never reached', () => {
    expect(calculatePayback([-1000, -100, -50])).toBeNull();
  });

  it('should calculate exact payback at year boundary', () => {
    const payback = calculatePayback([-500, 500, 500]);
    expect(payback).not.toBeNull();
    expect(payback!).toBeCloseTo(1.0, 1);
  });

  it('should interpolate payback within a year', () => {
    const payback = calculatePayback([-1000, 500, 800]);
    expect(payback).not.toBeNull();
    expect(payback!).toBeCloseTo(1.625, 1);
  });

  it('should handle immediate payback', () => {
    const payback = calculatePayback([500, 200, 100]);
    expect(payback).not.toBeNull();
    expect(payback!).toBe(0);
  });
});

describe('calculate', () => {
  const sampleFlows: YearlyFlows[] = [
    { year: 1, benefits: 0, costs: 1000 },
    { year: 2, benefits: 600, costs: 200 },
    { year: 3, benefits: 800, costs: 200 },
    { year: 4, benefits: 1000, costs: 200 },
  ];

  it('should return zero values for empty input', () => {
    const result = calculate({ flows: [], discountRate: 0.03 });
    expect(result.npv).toBe(0);
    expect(result.bcr).toBe(0);
    expect(result.irr).toBeNull();
    expect(result.sroi).toBeNull();
    expect(result.paybackYears).toBeNull();
  });

  it('should calculate all KPIs for a standard project', () => {
    const result = calculate({ flows: sampleFlows, discountRate: 0.05 });

    expect(result.pvBenefits).toBeGreaterThan(0);
    expect(result.pvCosts).toBeGreaterThan(0);
    expect(result.npv).toEqual(result.pvBenefits - result.pvCosts);
    expect(result.bcr).toEqual(result.pvBenefits / result.pvCosts);
    expect(result.netPerYear).toHaveLength(4);
    expect(result.cumulativePerYear).toHaveLength(4);
  });

  it('should compute correct net per year', () => {
    const result = calculate({ flows: sampleFlows, discountRate: 0.05 });
    expect(result.netPerYear[0]).toBe(-1000);
    expect(result.netPerYear[1]).toBe(400);
    expect(result.netPerYear[2]).toBe(600);
    expect(result.netPerYear[3]).toBe(800);
  });

  it('should compute correct cumulative', () => {
    const result = calculate({ flows: sampleFlows, discountRate: 0.05 });
    expect(result.cumulativePerYear[0]).toBe(-1000);
    expect(result.cumulativePerYear[1]).toBe(-600);
    expect(result.cumulativePerYear[2]).toBe(0);
    expect(result.cumulativePerYear[3]).toBe(800);
  });

  it('should find payback period', () => {
    const result = calculate({ flows: sampleFlows, discountRate: 0.05 });
    expect(result.paybackYears).not.toBeNull();
    expect(result.paybackYears!).toBeGreaterThan(1);
    expect(result.paybackYears!).toBeLessThan(3);
  });

  it('should compute BCR > 1 for a profitable project', () => {
    const result = calculate({ flows: sampleFlows, discountRate: 0.05 });
    expect(result.bcr).toBeGreaterThan(1);
  });

  it('should compute SROI > 0 for profitable project', () => {
    const result = calculate({ flows: sampleFlows, discountRate: 0.05 });
    expect(result.sroi).not.toBeNull();
    expect(result.sroi!).toBeGreaterThan(0);
    expect(result.sroi!).toBeCloseTo(result.bcr - 1, 6);
  });

  it('should sort flows by year', () => {
    const unsorted: YearlyFlows[] = [
      { year: 3, benefits: 300, costs: 100 },
      { year: 1, benefits: 100, costs: 500 },
      { year: 2, benefits: 200, costs: 100 },
    ];
    const result = calculate({ flows: unsorted, discountRate: 0.05 });
    expect(result.netPerYear[0]).toBe(-400);
    expect(result.netPerYear[1]).toBe(100);
    expect(result.netPerYear[2]).toBe(200);
  });
});

describe('sensitivityAnalysis', () => {
  const baseFlows: YearlyFlows[] = [
    { year: 1, benefits: 0, costs: 1000 },
    { year: 2, benefits: 500, costs: 100 },
    { year: 3, benefits: 500, costs: 100 },
  ];

  it('should return results sorted by spread (biggest impact first)', () => {
    const contributions = [
      { nodeId: 'a', label: 'Nytta A', yearlyValues: [0, 300, 300], type: 'benefit' as const },
      { nodeId: 'b', label: 'Nytta B', yearlyValues: [0, 200, 200], type: 'benefit' as const },
      { nodeId: 'c', label: 'Kostnad C', yearlyValues: [1000, 100, 100], type: 'cost' as const },
    ];

    const results = sensitivityAnalysis(baseFlows, 0.05, contributions, 0.2);
    expect(results).toHaveLength(3);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].spread).toBeGreaterThanOrEqual(results[i].spread);
    }
  });

  it('should vary benefits correctly', () => {
    const contributions = [
      { nodeId: 'a', label: 'Nytta A', yearlyValues: [0, 500, 500], type: 'benefit' as const },
    ];

    const results = sensitivityAnalysis(baseFlows, 0.05, contributions, 0.2);
    expect(results).toHaveLength(1);
    expect(results[0].npvLow).toBeLessThan(results[0].npvBase);
    expect(results[0].npvHigh).toBeGreaterThan(results[0].npvBase);
  });

  it('should vary costs correctly (inverse direction)', () => {
    const contributions = [
      { nodeId: 'c', label: 'Kostnad C', yearlyValues: [1000, 100, 100], type: 'cost' as const },
    ];

    const results = sensitivityAnalysis(baseFlows, 0.05, contributions, 0.2);
    expect(results).toHaveLength(1);
    expect(results[0].npvLow).toBeGreaterThan(results[0].npvBase);
    expect(results[0].npvHigh).toBeLessThan(results[0].npvBase);
  });
});
