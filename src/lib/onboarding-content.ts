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
    title: 'Fas 1: FÖRSTÅ',
    description:
      'I denna fas definierar du problemet, sätter mål och identifierar alternativ. Grunden för hela nyttokalkylen läggs här.',
  },
  2: {
    title: 'Fas 2: KARTLÄGGA',
    description:
      'Kartlägg intressenter, beskriv nollalternativet och bygg ett nyttoträd som visar sambanden mellan aktiviteter och nyttor.',
  },
  3: {
    title: 'Fas 3: BERÄKNA',
    description:
      'Klassificera nyttor och kostnader, mata in värdeuppskattningar och beräkna finansiella nyckeltal som NPV, BCR och SROI.',
  },
  4: {
    title: 'Fas 4: REALISERA',
    description:
      'Planera hur nyttorna ska realiseras med ansvariga, uppföljningspunkter och målvärden.',
  },
  5: {
    title: 'Fas 5: LÄRA',
    description:
      'Följ upp effektmätning, dokumentera lärdomar och skapa slutrapporten.',
  },
};

export const STEP_GUIDANCE: Record<number, StepGuidance> = {
  1: {
    title: 'Behovsanalys & Mål',
    description:
      'Börja med att beskriva problemet eller behovet som driver förändringen. Definiera SMART-mål som gör det möjligt att mäta framgång.',
    tips: [
      'Var specifik om problemets konsekvenser',
      'Koppla till organisationens strategi',
      'Sätt mätbara SMART-mål med tidsram',
    ],
  },
  2: {
    title: 'Strategisk koppling',
    description:
      'Beskriv nollalternativet (vad händer om inget görs) och definiera de alternativ som ska utredas.',
    tips: [
      'Nollalternativet är din referenspunkt',
      'Beskriv minst ett realistiskt alternativ',
      'Inkludera både för- och nackdelar per alternativ',
    ],
  },
  3: {
    title: 'Intressentanalys',
    description:
      'Identifiera alla som påverkas av eller kan påverka projektet. Bedöm deras inflytande och intresse.',
    tips: [
      'Tänk brett: brukare, medarbetare, ledning, samhälle',
      'Bedöm både inflytande (1–5) och intresse (1–5)',
      'Planera hur varje intressent ska engageras',
    ],
  },
  4: {
    title: 'Nollalternativ',
    description:
      'Fördjupa beskrivningen av vad som händer om projektet inte genomförs. Detta är basen som alla nyttor mäts mot.',
    tips: [
      'Beskriv konsekvenser över tid',
      'Inkludera dolda kostnader av att inte agera',
      'Tänk på regulatoriska och juridiska aspekter',
    ],
  },
  5: {
    title: 'Nyttoträd (Value Map)',
    description:
      'Bygg en visuell karta över sambanden från aktiviteter via effekter till nyttor och mål.',
    tips: [
      'Börja med aktiviteterna (vad ska göras)',
      'Koppla till effekter (vad uppnås)',
      'Avsluta med nyttor och mål (värdet)',
    ],
  },
  6: {
    title: 'Kostnader',
    description:
      'Klassificera alla kostnader i kalkylen efter typ och tidshorisont.',
    tips: [
      'Urskilj investering från driftskostnader',
      'Glöm ej alternativkostnader',
      'Koppla till budgetposter om möjligt',
    ],
  },
  7: {
    title: 'Nyttor & värden',
    description:
      'Uppskatta det ekonomiska värdet av varje nytta med pessimistiskt, troligt och optimistiskt scenario.',
    tips: [
      'Använd tre-punkts-skattning för bättre precision',
      'Dokumentera kalkylantaganden',
      'Ange datakälla för trovärdighet',
    ],
  },
  8: {
    title: 'Kalkyl & känslighet',
    description:
      'Beräkna NPV, BCR, IRR och SROI. Kör känslighetsanalys för att förstå riskerna i kalkylen.',
    tips: [
      'NPV > 0 innebär att nyttan överstiger kostnaden',
      'BCR > 1.0 är en bra indikator',
      'Testa olika diskonteringsräntor',
    ],
  },
  9: {
    title: 'Realiseringsplan',
    description:
      'Utse nyttoansvariga och sätt baslinjer, målvärden och uppföljningsfrekvens för varje nytta.',
    tips: [
      'Varje nytta bör ha en ansvarig person',
      'Sätt mätbara KPI:er',
      'Koppla till projektets effektmål',
    ],
  },
  10: {
    title: 'Uppföljningspunkter',
    description:
      'Planera kontrollpunkter för att följa upp att nyttorna realiseras enligt plan.',
    tips: [
      'Lägg kontrollpunkter vid viktiga milstolpar',
      'Dokumentera avvikelser och åtgärder',
      'Följ upp både under och efter projektet',
    ],
  },
  11: {
    title: 'Effektmätning',
    description:
      'Mät och dokumentera den faktiska realiseringen av nyttorna mot planerade värden.',
    tips: [
      'Jämför faktiskt utfall mot planerat',
      'Analysera avvikelser',
      'Synka mätdata till effektmål',
    ],
  },
  12: {
    title: 'Lärdomar & rapport',
    description:
      'Sammanfatta lärdomar från projektet och exportera den färdiga nyttokalkylen.',
    tips: [
      'Dokumentera både framgångar och misslyckanden',
      'Ge rekommendationer för framtida projekt',
      'Exportera som PDF eller Excel',
    ],
  },
};
