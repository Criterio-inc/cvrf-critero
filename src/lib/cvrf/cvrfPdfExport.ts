import jsPDF from 'jspdf';
import type { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import type { CvrfNode } from '@/hooks/cvrf/useValueMapNodes';
import type { CvrfBenefitOwner } from '@/hooks/cvrf/useBenefitOwners';
import type { CvrfStakeholder } from '@/hooks/cvrf/useStakeholders';
import type { CvrfCheckpoint } from '@/hooks/cvrf/useCheckpoints';
import type { CvrfLesson } from '@/hooks/cvrf/useLessons';

interface CvrfExportData {
  analysis: CvrfAnalysis;
  benefitNodes: CvrfNode[];
  costNodes: CvrfNode[];
  owners: CvrfBenefitOwner[];
  stakeholders: CvrfStakeholder[];
  checkpoints: CvrfCheckpoint[];
  lessons: CvrfLesson[];
  yearlyFlows: { year: number; benefits: number; costs: number; net: number }[];
}

const formatSEK = (v: number | null): string => {
  if (v == null) return '\u2014';
  return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(v) + ' kr';
};

const formatDate = (d: string | null): string => {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('sv-SE');
};

const formatPct = (v: number | null, decimals = 1): string => {
  if (v == null) return '\u2014';
  return `${(v * 100).toFixed(decimals)}%`;
};

const CATEGORY_LABELS: Record<string, string> = {
  financial: 'Finansiell', redistribution: 'Omf\u00f6rdelning', quality: 'Kvalitet',
  environmental: 'Milj\u00f6', societal: 'Samh\u00e4llsnytta',
};

const COST_TYPE_LABELS: Record<string, string> = {
  investment: 'Investering', operational: 'Drift', change: 'F\u00f6r\u00e4ndring',
  opportunity: 'Alternativkostnad', decommission: 'Avveckling',
};

function checkPageBreak(doc: jsPDF, yPos: number, needed = 30): number {
  if (yPos > 270 - needed) {
    doc.addPage();
    return 20;
  }
  return yPos;
}

function sectionHeader(doc: jsPDF, title: string, yPos: number): number {
  yPos = checkPageBreak(doc, yPos, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(title, 14, yPos);
  return yPos + 8;
}

export async function exportCvrfToPdf(data: CvrfExportData): Promise<void> {
  const { analysis, benefitNodes, costNodes, owners, stakeholders, checkpoints, lessons, yearlyFlows } = data;
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  let y = 20;

  // -- Header --
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pw, 45, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CVRF Nyttokalkyl', 14, 22);

  doc.setFontSize(13);
  doc.text('Nyttokalkyl', 14, 32);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exporterad: ${new Date().toLocaleDateString('sv-SE')}`, pw - 14, 22, { align: 'right' });

  y = 55;
  doc.setTextColor(30, 30, 30);

  // -- Title --
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(analysis.title, 14, y);
  y += 10;

  // -- Info box --
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, y, pw - 28, 20, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Status:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(analysis.status === 'draft' ? 'Utkast' : analysis.status ?? '\u2014', 50, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Tidshorisont:', 90, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${analysis.time_horizon ?? 0} \u00e5r`, 130, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Diskonteringsr\u00e4nta:', 145, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatPct(analysis.discount_rate), pw - 20, y);
  y += 20;

  // -- Problem & strategi --
  if (analysis.problem_description) {
    y = sectionHeader(doc, 'Problemformulering', y);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(analysis.problem_description, pw - 28);
    doc.text(lines, 14, y);
    y += lines.length * 4 + 8;
  }

  if (analysis.strategic_alignment) {
    y = sectionHeader(doc, 'Strategisk koppling', y);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(analysis.strategic_alignment, pw - 28);
    doc.text(lines, 14, y);
    y += lines.length * 4 + 8;
  }

  // -- KPI:er --
  y = sectionHeader(doc, 'Nyckeltal', y);
  doc.setFontSize(9);
  const kpis = [
    ['NPV', formatSEK(analysis.npv)],
    ['BCR', analysis.bcr != null ? analysis.bcr.toFixed(2) : '\u2014'],
    ['IRR', analysis.irr != null ? formatPct(analysis.irr) : '\u2014'],
    ['SROI', analysis.sroi != null ? analysis.sroi.toFixed(2) : '\u2014'],
    ['\u00c5terbetalningtid', analysis.payback_years != null ? `${analysis.payback_years} \u00e5r` : '\u2014'],
  ];
  kpis.forEach(([label, value]) => {
    y = checkPageBreak(doc, y);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 55, y);
    y += 5;
  });
  y += 5;

  // -- Nyttor --
  if (benefitNodes.length > 0) {
    y = sectionHeader(doc, `Nyttor (${benefitNodes.length})`, y);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Nytta', 14, y);
    doc.text('Kategori', 80, y);
    doc.text('Ansvarig', 115, y);
    doc.text('M\u00e5lv\u00e4rde', 155, y);
    doc.setDrawColor(200, 200, 200);
    y += 2;
    doc.line(14, y, pw - 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    benefitNodes.forEach((node) => {
      y = checkPageBreak(doc, y);
      const owner = owners.find((o) => o.node_id === node.id);
      const title = node.title.length > 30 ? node.title.substring(0, 30) + '...' : node.title;
      doc.text(title, 14, y);
      doc.text(CATEGORY_LABELS[node.benefit_category ?? ''] ?? '\u2014', 80, y);
      doc.text(owner?.owner_name ?? '\u2014', 115, y);
      doc.text(owner?.target_value != null ? formatSEK(owner.target_value) : '\u2014', 155, y);
      y += 5;
    });
    y += 5;
  }

  // -- Kostnader --
  if (costNodes.length > 0) {
    y = sectionHeader(doc, `Kostnader (${costNodes.length})`, y);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Kostnad', 14, y);
    doc.text('Typ', 100, y);
    doc.setDrawColor(200, 200, 200);
    y += 2;
    doc.line(14, y, pw - 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    costNodes.forEach((node) => {
      y = checkPageBreak(doc, y);
      const title = node.title.length > 40 ? node.title.substring(0, 40) + '...' : node.title;
      doc.text(title, 14, y);
      doc.text(COST_TYPE_LABELS[node.benefit_category ?? ''] ?? '\u2014', 100, y);
      y += 5;
    });
    y += 5;
  }

  // -- Ber\u00e4kningar per \u00e5r --
  if (yearlyFlows.length > 0) {
    y = sectionHeader(doc, 'Ber\u00e4kningar per \u00e5r', y);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('\u00c5r', 14, y);
    doc.text('Nyttor', 35, y);
    doc.text('Kostnader', 70, y);
    doc.text('Netto', 110, y);
    doc.setDrawColor(200, 200, 200);
    y += 2;
    doc.line(14, y, pw - 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    yearlyFlows.forEach((f) => {
      y = checkPageBreak(doc, y);
      doc.text(`\u00c5r ${f.year}`, 14, y);
      doc.text(formatSEK(f.benefits), 35, y);
      doc.text(formatSEK(f.costs), 70, y);
      doc.text(formatSEK(f.net), 110, y);
      y += 5;
    });
    y += 5;
  }

  // -- Gate-status --
  y = sectionHeader(doc, 'Gate-status', y);
  doc.setFontSize(9);
  const gates = [
    ['Gate 1 \u2013 Behovsanalys', analysis.gate1_passed, analysis.gate1_date],
    ['Gate 2 \u2013 Alternativ', analysis.gate2_passed, analysis.gate2_date],
    ['Gate 3 \u2013 Kalkylgranskning', analysis.gate3_passed, analysis.gate3_date],
    ['Gate 4 \u2013 Realiseringsplan', analysis.gate4_passed, analysis.gate4_date],
    ['Gate 5 \u2013 Uppf\u00f6ljningsplan', analysis.gate5_passed, analysis.gate5_date],
  ] as const;
  gates.forEach(([label, passed, date]) => {
    y = checkPageBreak(doc, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${label}: ${passed ? 'Godk\u00e4nd' : 'Ej passerad'}${date ? ` (${formatDate(date)})` : ''}`, 14, y);
    y += 5;
  });
  y += 5;

  // -- Intressenter --
  if (stakeholders.length > 0) {
    y = sectionHeader(doc, `Intressenter (${stakeholders.length})`, y);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Namn', 14, y);
    doc.text('Kategori', 70, y);
    doc.text('Inflytande', 110, y);
    doc.text('Intresse', 140, y);
    doc.setDrawColor(200, 200, 200);
    y += 2;
    doc.line(14, y, pw - 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    stakeholders.forEach((s) => {
      y = checkPageBreak(doc, y);
      doc.text(s.name.length > 25 ? s.name.substring(0, 25) + '...' : s.name, 14, y);
      doc.text(s.category ?? '\u2014', 70, y);
      doc.text(s.influence_level != null ? String(s.influence_level) : '\u2014', 110, y);
      doc.text(s.interest_level != null ? String(s.interest_level) : '\u2014', 140, y);
      y += 5;
    });
    y += 5;
  }

  // -- Kontrollpunkter --
  if (checkpoints.length > 0) {
    y = sectionHeader(doc, `Kontrollpunkter (${checkpoints.length})`, y);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Datum', 14, y);
    doc.text('Typ', 50, y);
    doc.text('Status', 90, y);
    doc.text('Realisering', 125, y);
    doc.setDrawColor(200, 200, 200);
    y += 2;
    doc.line(14, y, pw - 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    checkpoints.forEach((cp) => {
      y = checkPageBreak(doc, y);
      doc.text(formatDate(cp.checkpoint_date), 14, y);
      doc.text(cp.checkpoint_type ?? '\u2014', 50, y);
      doc.text(cp.status ?? '\u2014', 90, y);
      doc.text(cp.overall_realization_percent != null ? `${cp.overall_realization_percent}%` : '\u2014', 125, y);
      y += 5;
    });
    y += 5;
  }

  // -- L\u00e4rdomar --
  if (lessons.length > 0) {
    y = sectionHeader(doc, `L\u00e4rdomar (${lessons.length})`, y);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    lessons.forEach((l) => {
      y = checkPageBreak(doc, y, 15);
      doc.setFont('helvetica', 'bold');
      doc.text(`\u2022 ${l.title}`, 14, y);
      y += 5;
      if (l.description) {
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(l.description, pw - 32);
        doc.text(lines, 20, y);
        y += lines.length * 4;
      }
      y += 3;
    });
  }

  // -- Footer --
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Sida ${i} av ${totalPages} | CVRF Nyttokalkyl`,
      pw / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  const safeName = analysis.title.replace(/[^a-z0-9\u00e5\u00e4\u00f6]/gi, '_');
  doc.save(`${safeName}_nyttokalkyl.pdf`);
}
