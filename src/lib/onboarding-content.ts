export interface StepGuidance {
  title: string;
  description: string;
  tips: string[];
}

export interface PhaseGuidance {
  title: string;
  description: string;
}

export const PHASE_GUIDANCE: Record<number, PhaseGuidance> = {
  1: {
    title: 'Fas 1: FORSTA',
    description:
      'I denna fas definierar du problemet, satter mal och identifierar alternativ. Grunden for hela nyttokalkylen laggs har.',
  },
  2: {
    title: 'Fas 2: KARTLAGGA',
    description:
      'Kartlagg intressenter, beskriv nollalternativet och bygg ett nyttotrad som visar sambanden mellan aktiviteter och nyttor.',
  },
  3: {
    title: 'Fas 3: BERAKNA',
    description:
      'Klassificera nyttor och kostnader, mata in vardeuppskattningar och berakna finansiella nyckeltal som NPV, BCR och SROI.',
  },
  4: {
    title: 'Fas 4: REALISERA',
    description:
      'Planera hur nyttorna ska realiseras med ansvariga, uppfoljningspunkter och malvarden.',
  },
  5: {
    title: 'Fas 5: LARA',
    description:
      'Folj upp effektmalning, dokumentera lardomar och skapa slutrapporten.',
  },
};

export const STEP_GUIDANCE: Record<number, StepGuidance> = {
  1: {
    title: 'Behovsanalys & Mal',
    description:
      'Borja med att beskriva problemet eller behovet som driver forandringen. Definiera SMART-mal som gor det mojligt att mata framgang.',
    tips: [
      'Var specifik om problemets konsekvenser',
      'Koppla till organisationens strategi',
      'Satt malbara SMART-mal med tidsram',
    ],
  },
  2: {
    title: 'Strategisk koppling',
    description:
      'Beskriv nollalternativet (vad hander om inget gors) och definiera de alternativ som ska utredas.',
    tips: [
      'Nollalternativet ar din referenspunkt',
      'Beskriv minst ett realistiskt alternativ',
      'Inklura bade for- och nackdelar per alternativ',
    ],
  },
  3: {
    title: 'Intressentanalys',
    description:
      'Identifiera alla som paverkas av eller kan paverka projektet. Bedom deras inflytande och intresse.',
    tips: [
      'Tank brett: brukare, medarbetare, ledning, samhalle',
      'Bedom bade inflytande (1-5) och intresse (1-5)',
      'Planera hur varje intressent ska engageras',
    ],
  },
  4: {
    title: 'Nollalternativ',
    description:
      'Fordjupa beskrivningen av vad som hander om projektet inte genomfors. Detta ar basen som alla nyttor mats mot.',
    tips: [
      'Beskriv konsekvenser over tid',
      'Inkludera dolda kostnader av att inte agera',
      'Tank pa regulatoriska och juridiska aspekter',
    ],
  },
  5: {
    title: 'Nyttotrad (Value Map)',
    description:
      'Bygg en visuell karta over sambanden fran aktiviteter via effekter till nyttor och mal.',
    tips: [
      'Borja med aktiviteterna (vad ska goras)',
      'Koppla till effekter (vad uppnas)',
      'Avsluta med nyttor och mal (vardet)',
    ],
  },
  6: {
    title: 'Kostnader',
    description:
      'Klassificera alla kostnader i kalkylen efter typ och tidshorisont.',
    tips: [
      'Urskilj investering fran driftskostnader',
      'Glommeji alternativkostnader',
      'Koppla till budgetposter om mojligt',
    ],
  },
  7: {
    title: 'Nyttor & varden',
    description:
      'Uppskatta det ekonomiska vardet av varje nytta med pessimistiskt, troligt och optimistiskt scenario.',
    tips: [
      'Anvand tre-punkts-skattning for battre precision',
      'Dokumentera kalkylantaganden',
      'Ange datakalla for trovardighet',
    ],
  },
  8: {
    title: 'Kalkyl & kanslighet',
    description:
      'Berakna NPV, BCR, IRR och SROI. Kor kanslighetsanalys for att forsta riskerna i kalkylen.',
    tips: [
      'NPV > 0 innebar att nyttan overstiger kostnaden',
      'BCR > 1.0 ar en bra indikator',
      'Testa olika diskonteringsrantor',
    ],
  },
  9: {
    title: 'Realiseringsplan',
    description:
      'Utse nyttoansvariga och satt baslinjer, malvarden och uppfoljningsfrekvens for varje nytta.',
    tips: [
      'Varje nytta bor ha en ansvarig person',
      'Satt malbara KPI:er',
      'Koppla till projektets effektmal',
    ],
  },
  10: {
    title: 'Uppfoljningspunkter',
    description:
      'Planera kontrollpunkter for att folja upp att nyttorna realiseras enligt plan.',
    tips: [
      'Lagg kontrollpunkter vid viktiga milstolpar',
      'Dokumentera avvikelser och atgarder',
      'Folj upp bade under och efter projektet',
    ],
  },
  11: {
    title: 'Effektmatning',
    description:
      'Mat och dokumentera den faktiska realiseringen av nyttorna mot planerade varden.',
    tips: [
      'Jamfor faktiskt utfall mot planerat',
      'Analysera avvikelser',
      'Synka matdata till effektmal',
    ],
  },
  12: {
    title: 'Lardomar & rapport',
    description:
      'Sammanfatta lardomar fran projektet och exportera den fardiga nyttokalkylen.',
    tips: [
      'Dokumentera bade framgangar och misslyckanden',
      'Ge rekommendationer for framtida projekt',
      'Exportera som PDF eller Excel',
    ],
  },
};
