import ExcelJS from 'exceljs';
import type { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import type { CvrfNode } from '@/hooks/cvrf/useValueMapNodes';
import type { CvrfBenefitOwner } from '@/hooks/cvrf/useBenefitOwners';
import type { CvrfStakeholder } from '@/hooks/cvrf/useStakeholders';
import type { CvrfCheckpoint } from '@/hooks/cvrf/useCheckpoints';
import type { CvrfLesson } from '@/hooks/cvrf/useLessons';

interface CvrfExcelData {
  analysis: CvrfAnalysis;
  benefitNodes: CvrfNode[];
  costNodes: CvrfNode[];
  owners: CvrfBenefitOwner[];
  stakeholders: CvrfStakeholder[];
  checkpoints: CvrfCheckpoint[];
  lessons: CvrfLesson[];
  yearlyFlows: { year: number; benefits: number; costs: number; net: number; cumulative: number }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  financial: 'Finansiell', redistribution: 'Omf\u00f6rdelning', quality: 'Kvalitet',
  environmental: 'Milj\u00f6', societal: 'Samh\u00e4llsnytta',
};

const COST_TYPE_LABELS: Record<string, string> = {
  investment: 'Investering', operational: 'Drift', change: 'F\u00f6r\u00e4ndring',
  opportunity: 'Alternativkostnad', decommission: 'Avveckling',
};

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: 'M\u00e5natlig', quarterly: 'Kvartalsvis', biannual: 'Halv\u00e5rsvis', annual: '\u00c5rlig',
};

const IMPACT_LABELS: Record<string, string> = {
  positive: 'Positiv', negative: 'Negativ',
};

const LESSON_CATEGORY_LABELS: Record<string, string> = {
  process: 'Process', technical: 'Teknisk', organizational: 'Organisatorisk', financial: 'Finansiell',
};

function headerStyle(): Partial<ExcelJS.Style> {
  return {
    font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } },
    alignment: { vertical: 'middle', horizontal: 'left' },
    border: {
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    },
  };
}

function addHeaderRow(ws: ExcelJS.Worksheet, headers: string[]): void {
  const row = ws.addRow(headers);
  row.eachCell((cell) => {
    Object.assign(cell, { style: headerStyle() });
  });
  row.height = 24;
}

export async function exportCvrfToExcel(data: CvrfExcelData): Promise<void> {
  const { analysis, benefitNodes, costNodes, owners, stakeholders, checkpoints, lessons, yearlyFlows } = data;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'CVRF Nyttokalkyl';
  wb.created = new Date();

  // -- Flik 1: Sammanfattning --
  const wsSummary = wb.addWorksheet('Sammanfattning');
  wsSummary.columns = [
    { header: '', key: 'label', width: 25 },
    { header: '', key: 'value', width: 40 },
  ];

  wsSummary.addRow(['Analys', analysis.title]);
  wsSummary.addRow(['Status', analysis.status === 'draft' ? 'Utkast' : analysis.status ?? '\u2014']);
  wsSummary.addRow(['Exporterad', new Date().toLocaleDateString('sv-SE')]);
  wsSummary.addRow([]);
  wsSummary.addRow(['Nyckeltal', '']);
  wsSummary.addRow(['NPV', analysis.npv ?? 0]);
  wsSummary.addRow(['BCR', analysis.bcr ?? 0]);
  wsSummary.addRow(['IRR', analysis.irr != null ? analysis.irr : '\u2014']);
  wsSummary.addRow(['SROI', analysis.sroi != null ? analysis.sroi : '\u2014']);
  wsSummary.addRow(['\u00c5terbetalningtid (\u00e5r)', analysis.payback_years ?? '\u2014']);
  wsSummary.addRow(['Tidshorisont (\u00e5r)', analysis.time_horizon ?? 0]);
  wsSummary.addRow(['Diskonteringsr\u00e4nta', analysis.discount_rate ?? 0]);
  wsSummary.addRow([]);
  wsSummary.addRow(['Gate-status', '']);

  const gateNames = ['Behovsanalys', 'Alternativ', 'Kalkylgranskning', 'Realiseringsplan', 'Uppf\u00f6ljningsplan'];
  for (let i = 1; i <= 5; i++) {
    const passed = (analysis as any)[`gate${i}_passed`];
    const date = (analysis as any)[`gate${i}_date`];
    wsSummary.addRow([
      `Gate ${i} \u2013 ${gateNames[i - 1]}`,
      passed ? `Godk\u00e4nd (${date ? new Date(date).toLocaleDateString('sv-SE') : ''})` : 'Ej passerad',
    ]);
  }

  // Bold label column
  wsSummary.eachRow((row) => {
    const cell = row.getCell(1);
    cell.font = { bold: true };
  });

  // -- Flik 2: Nyttor --
  const wsBenefits = wb.addWorksheet('Nyttor');
  wsBenefits.columns = [
    { key: 'title', width: 30 },
    { key: 'category', width: 15 },
    { key: 'owner', width: 20 },
    { key: 'role', width: 20 },
    { key: 'baseline', width: 15 },
    { key: 'target', width: 15 },
    { key: 'kpi', width: 30 },
    { key: 'frequency', width: 15 },
  ];
  addHeaderRow(wsBenefits, ['Nytta', 'Kategori', 'Ansvarig', 'Roll', 'Basv\u00e4rde', 'M\u00e5lv\u00e4rde', 'KPI', 'M\u00e4tfrekvens']);

  benefitNodes.forEach((node) => {
    const owner = owners.find((o) => o.node_id === node.id);
    wsBenefits.addRow([
      node.title,
      CATEGORY_LABELS[node.benefit_category ?? ''] ?? '\u2014',
      owner?.owner_name ?? '\u2014',
      owner?.owner_role ?? '\u2014',
      owner?.baseline_value ?? 0,
      owner?.target_value ?? 0,
      owner?.kpi_description ?? '\u2014',
      owner?.measurement_frequency ? FREQUENCY_LABELS[owner.measurement_frequency] ?? owner.measurement_frequency : '\u2014',
    ]);
  });

  // -- Flik 3: Kostnader --
  const wsCosts = wb.addWorksheet('Kostnader');
  wsCosts.columns = [
    { key: 'title', width: 30 },
    { key: 'type', width: 20 },
    { key: 'description', width: 40 },
  ];
  addHeaderRow(wsCosts, ['Kostnad', 'Typ', 'Beskrivning']);

  costNodes.forEach((node) => {
    wsCosts.addRow([
      node.title,
      COST_TYPE_LABELS[node.benefit_category ?? ''] ?? '\u2014',
      node.description ?? '\u2014',
    ]);
  });

  // -- Flik 4: Ber\u00e4kningar --
  const wsCalc = wb.addWorksheet('Ber\u00e4kningar');
  wsCalc.columns = [
    { key: 'year', width: 10 },
    { key: 'benefits', width: 18 },
    { key: 'costs', width: 18 },
    { key: 'net', width: 18 },
    { key: 'cumulative', width: 18 },
  ];
  addHeaderRow(wsCalc, ['\u00c5r', 'Nyttor (kr)', 'Kostnader (kr)', 'Netto (kr)', 'Kumulativt (kr)']);

  yearlyFlows.forEach((f) => {
    wsCalc.addRow([f.year, f.benefits, f.costs, f.net, f.cumulative]);
  });

  // Format number cells
  wsCalc.eachRow((row, rowNum) => {
    if (rowNum === 1) return;
    for (let col = 2; col <= 5; col++) {
      row.getCell(col).numFmt = '#,##0';
    }
  });

  // -- Flik 5: Intressenter --
  const wsStake = wb.addWorksheet('Intressenter');
  wsStake.columns = [
    { key: 'name', width: 25 },
    { key: 'category', width: 20 },
    { key: 'influence', width: 12 },
    { key: 'interest', width: 12 },
    { key: 'plan', width: 40 },
  ];
  addHeaderRow(wsStake, ['Namn', 'Kategori', 'Inflytande', 'Intresse', 'Engagemangsplan']);

  stakeholders.forEach((s) => {
    wsStake.addRow([
      s.name,
      s.category ?? '\u2014',
      s.influence_level ?? 0,
      s.interest_level ?? 0,
      s.engagement_plan ?? '\u2014',
    ]);
  });

  // -- Flik 6: Kontrollpunkter --
  const wsCp = wb.addWorksheet('Kontrollpunkter');
  wsCp.columns = [
    { key: 'date', width: 15 },
    { key: 'type', width: 18 },
    { key: 'status', width: 15 },
    { key: 'realization', width: 15 },
    { key: 'findings', width: 35 },
    { key: 'actions', width: 35 },
  ];
  addHeaderRow(wsCp, ['Datum', 'Typ', 'Status', 'Realisering (%)', 'Iakttagelser', 'Korrigerande \u00e5tg\u00e4rder']);

  checkpoints.forEach((cp) => {
    wsCp.addRow([
      new Date(cp.checkpoint_date).toLocaleDateString('sv-SE'),
      cp.checkpoint_type ?? '\u2014',
      cp.status ?? '\u2014',
      cp.overall_realization_percent ?? 0,
      cp.findings ?? '\u2014',
      cp.corrective_actions ?? '\u2014',
    ]);
  });

  // -- Flik 7: L\u00e4rdomar --
  if (lessons.length > 0) {
    const wsLessons = wb.addWorksheet('L\u00e4rdomar');
    wsLessons.columns = [
      { key: 'title', width: 25 },
      { key: 'category', width: 18 },
      { key: 'impact', width: 12 },
      { key: 'description', width: 40 },
      { key: 'recommendation', width: 40 },
    ];
    addHeaderRow(wsLessons, ['Titel', 'Kategori', 'P\u00e5verkan', 'Beskrivning', 'Rekommendation']);

    lessons.forEach((l) => {
      wsLessons.addRow([
        l.title,
        l.category ? LESSON_CATEGORY_LABELS[l.category] ?? l.category : '\u2014',
        l.impact ? IMPACT_LABELS[l.impact] ?? l.impact : '\u2014',
        l.description ?? '\u2014',
        l.recommendation ?? '\u2014',
      ]);
    });
  }

  // -- Download --
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = analysis.title.replace(/[^a-z0-9\u00e5\u00e4\u00f6]/gi, '_');
  a.download = `${safeName}_nyttokalkyl.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
