"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Target,
  Users,
  GitCompareArrows,
  TreePine,
  Coins,
  TrendingUp,
  BarChart3,
  CalendarCheck,
  ClipboardCheck,
  LineChart,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Key,
  Lock,
  Shield,
  Building2,
  UserCheck,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  STEP DATA                                                          */
/* ------------------------------------------------------------------ */

interface Step {
  number: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  phase: string;
  phaseColor: string;
  about: string;
  learningPoint: string;
  discussionPrompt: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Behovsanalys & Mål",
    icon: Target,
    phase: "FÖRSTÅ",
    phaseColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    about: "I det första steget identifierar vi problemet och definierar tydliga, mätbara mål. Utan en klar bild av nuläget och önskat läge blir det omöjligt att värdera nyttan av en förändring.",
    learningPoint: "SMART-mål (Specifikt, Mätbart, Accepterat, Realistiskt, Tidsbundet) är nyckeln till att kunna mäta om nyttan verkligen realiserats.",
    discussionPrompt: "Vilka problem i er organisation skulle kunna kvantifieras på liknande sätt?",
  },
  {
    number: 2,
    title: "Strategisk koppling",
    icon: GitCompareArrows,
    phase: "FÖRSTÅ",
    phaseColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    about: "Här utvärderar vi alternativ och säkerställer att den föreslagna lösningen kopplar till organisationens övergripande strategi. Vi jämför alltid mot nollalternativet.",
    learningPoint: "En nyttokalkyl utan alternativanalys saknar förankring. Beslutsfattare behöver se varför just detta alternativ valdes.",
    discussionPrompt: "Hur värderar ni alternativ idag? Finns det en strukturerad process?",
  },
  {
    number: 3,
    title: "Intressentanalys",
    icon: Users,
    phase: "FÖRSTÅ",
    phaseColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    about: "Vi kartlägger alla som påverkas av eller kan påverka förändringen. Varje intressent bedöms efter påverkan och intresse för att prioritera kommunikationsinsatser.",
    learningPoint: "Intressenterna är nyckeln till nyttorealisering. En nytta som ingen äger kommer aldrig att realiseras.",
    discussionPrompt: "Finns det dolda intressenter som ofta glöms bort i era projekt?",
  },
  {
    number: 4,
    title: "Nollalternativ",
    icon: AlertTriangle,
    phase: "KARTLÄGGA",
    phaseColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    about: "Nollalternativet beskriver vad som händer om vi INTE genomför förändringen. Det är baslinjemätningen som alla nyttor och kostnader beräknas mot.",
    learningPoint: "Nollalternativet är inte \"noll kostnad\" - det kostar alltid att INTE förändra. Att stå still har ett pris.",
    discussionPrompt: "Hur beräknar ni kostnaden för att inte agera i era verksamheter?",
  },
  {
    number: 5,
    title: "Nyttoträd",
    icon: TreePine,
    phase: "KARTLÄGGA",
    phaseColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    about: "Nyttoträdet (Value Map) visualiserar den logiska kedjan från aktiviteter via output och effekter till faktiska nyttor. Det visar orsak-verkan-sambanden.",
    learningPoint: "Om du inte kan rita ett logiskt samband från aktivitet till nytta, finns det antagligen inget sådant samband.",
    discussionPrompt: "Brukar ni visualisera sambanden mellan insatser och nyttor? Vad händer om man hoppar över detta steg?",
  },
  {
    number: 6,
    title: "Kostnader",
    icon: Coins,
    phase: "BERÄKNA",
    phaseColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    about: "Alla kostnader kategoriseras och värderas: investering, drift, utbildning, indirekta kostnader. Vi skiljer mellan engångskostnader och löpande kostnader.",
    learningPoint: "Dolda kostnader (förändringsmotstånd, produktivitetsdipp under införande) underskattas nästan alltid. Räkna med dem!",
    discussionPrompt: "Vilka dolda kostnader brukar dyka upp i era förändringsinitiativ?",
  },
  {
    number: 7,
    title: "Nyttor & Värden",
    icon: TrendingUp,
    phase: "BERÄKNA",
    phaseColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    about: "Här kvantifierar och värderar vi varje nytta i kronor. Vi beräknar nuvärde (NPV), nyttokostnadskvot (BCR), internränta (IRR), social avkastning (SROI) och payback-tid.",
    learningPoint: "Nuvärdesberäkningen (NPV) tar hänsyn till pengars tidsvärde - en krona idag är värd mer än en krona om 5 år.",
    discussionPrompt: "Vilken diskonteringsränta använder er organisation? Varför?",
  },
  {
    number: 8,
    title: "Kalkyl & Känslighet",
    icon: BarChart3,
    phase: "BERÄKNA",
    phaseColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    about: "Känslighetsanalysen testar hur robust kalkylen är genom att variera nyckelparametrar. Vilka antaganden har störst påverkan på resultatet?",
    learningPoint: "En kalkyl utan känslighetsanalys ger falsk precision. Visa alltid osäkerheten - det ökar trovärdigheten.",
    discussionPrompt: "Hur kommunicerar ni osäkerhet i beslutsunderlag till era beslutsfattare?",
  },
  {
    number: 9,
    title: "Realiseringsplan",
    icon: CalendarCheck,
    phase: "REALISERA",
    phaseColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    about: "Varje nytta tilldelas en nyttoansvarsägare och definierade KPI:er. Utan ansvar och mätetal förblir nyttorna teoretiska.",
    learningPoint: "\"Det som mäts blir gjort\" - men bara om någon äger ansvaret. Nyttoägare måste ha mandat att realisera nyttan.",
    discussionPrompt: "Vem äger ansvaret för att nyttor realiseras i era projekt idag?",
  },
  {
    number: 10,
    title: "Uppföljningspunkter",
    icon: ClipboardCheck,
    phase: "REALISERA",
    phaseColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    about: "Strukturerade uppföljningspunkter säkerställer att nyttorna följs upp löpande under hela realiseringsperioden, inte bara vid projektslut.",
    learningPoint: "Kvartalsvis uppföljning ger möjlighet att korrigera kursen i tid. Vänta inte till slutrapporten.",
    discussionPrompt: "Hur ofta följer ni upp effektmål i pågående projekt?",
  },
  {
    number: 11,
    title: "Effektmätning",
    icon: LineChart,
    phase: "LÄRA",
    phaseColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    about: "Här mäter vi faktiskt utfall mot planerade nyttor. Har vi uppnått målen? Vilka nyttor realiserades? Vilka gjorde det inte?",
    learningPoint: "Effektmätning handlar inte om att \"bevisa\" att projektet lyckades - det handlar om att lära sig och förbättra framtida kalkyler.",
    discussionPrompt: "Mäter ni effekter efter genomförda projekt? Om inte - varför?",
  },
  {
    number: 12,
    title: "Lärdomar & Rapport",
    icon: BookOpen,
    phase: "LÄRA",
    phaseColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    about: "Det sista steget sammanfattar hela nyttokalkylen i en rapport och dokumenterar lärdomar för framtida initiativ.",
    learningPoint: "Lärdomarna är kanske det mest värdefulla resultatet. Dokumentera vad som fungerade och vad som inte gjorde det.",
    discussionPrompt: "Hur sprids lärdomar från projekt till projekt i er organisation?",
  },
];

/* ------------------------------------------------------------------ */
/*  STEP CONTENT RENDERERS                                             */
/* ------------------------------------------------------------------ */

function Step1Content() {
  return (
    <div className="space-y-6">
      {/* Problem description */}
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
          Problembeskrivning
        </h4>
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed">
                {"Hemtjänstpersonal i Eksunda kommun hanterar idag ca "}
                <strong>{"1 200 fysiska nycklar"}</strong>
                {". Personal måste hämta och lämna nycklar vid kontoret före och efter varje hembesök."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-background p-3 text-center">
                <div className="text-2xl font-bold text-primary">{"~6%"}</div>
                <div className="text-xs text-muted-foreground">{"Produktivitetsförlust"}</div>
              </div>
              <div className="rounded-lg bg-background p-3 text-center">
                <div className="text-2xl font-bold text-primary">{"15"}</div>
                <div className="text-xs text-muted-foreground">{"Incidenter/år (borttappade nycklar)"}</div>
              </div>
              <div className="rounded-lg bg-background p-3 text-center">
                <div className="text-2xl font-bold text-primary">{"1 200"}</div>
                <div className="text-xs text-muted-foreground">{"Fysiska nycklar"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic alignment */}
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
          Strategisk koppling
        </h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="shrink-0 mt-0.5">Kommunalt</Badge>
            <span className="text-sm">{"Eksunda kommuns digitaliseringsstrategi 2024–2028, Mål 3: \"Digitalisera hemtjänsten för ökad kvalitet och effektivitet\""}</span>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="shrink-0 mt-0.5">Nationellt</Badge>
            <span className="text-sm">{"SKR:s riktlinjer om välfärdsteknik i hemtjänsten"}</span>
          </div>
        </div>
      </div>

      {/* SMART goals */}
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
          {"SMART-mål"}
        </h4>
        <div className="space-y-2">
          {[
            "Minska antalet inställda besök pga nyckelproblem med 90% inom 12 månader",
            "Minska personalens restid för nyckelhämtning med 95% inom 6 månader",
            "Eliminera alla säkerhetsincidenter med borttappade nycklar inom 12 månader",
          ].map((goal, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span className="text-sm">{goal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2Content() {
  const alternatives = [
    {
      name: "Nollalternativ",
      description: "Fortsätta med fysiska nycklar",
      cost: "~1,8 mkr/år i förlorad arbetstid",
      risk: "Ökande problem, personalmissnöje",
      badge: "Referens",
      badgeVariant: "outline" as const,
    },
    {
      name: "Alt 1: Digitala lås (Phoniro)",
      description: "Beprövad lösning, 85% av kommuner har infört",
      cost: "Investering + drift, se steg 7",
      risk: "Förändringsmotstånd, teknikstöd",
      badge: "Rekommenderat",
      badgeVariant: "default" as const,
    },
    {
      name: "Alt 2: Mekaniskt nyckelskåp",
      description: "Billigare men löser inte restidsproblemet",
      cost: "Lägre investering",
      risk: "Löser inte grundproblemet",
      badge: "Avfördes",
      badgeVariant: "secondary" as const,
    },
    {
      name: "Alt 3: Avvakta regional samordning",
      description: "Invänta gemensam upphandling",
      cost: "Ingen investering nu",
      risk: "1–2 års försening, osäker tidplan",
      badge: "Avfördes",
      badgeVariant: "secondary" as const,
    },
  ];

  return (
    <div className="space-y-4">
      {alternatives.map((alt, i) => (
        <Card key={i} className={`border-border/50 ${i === 1 ? "ring-2 ring-primary/30" : ""}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-sm">{alt.name}</h4>
              <Badge variant={alt.badgeVariant} className="shrink-0">{alt.badge}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{alt.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">{"Kostnad: "}</span>
                <span>{alt.cost}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{"Risk: "}</span>
                <span>{alt.risk}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Step3Content() {
  const stakeholders = [
    { name: "Hemtjänstpersonal", count: "560 medarbetare", impact: "Hög", interest: "Högt", role: "Huvudsakliga användare" },
    { name: "Brukare", count: "1 200 personer", impact: "Hög", interest: "Medel", role: "Mottagare av tjänsten" },
    { name: "IT-avdelningen", count: "12 pers", impact: "Medel", interest: "Högt", role: "Drift och support" },
    { name: "Fastighetsägare", count: "~400 fastigheter", impact: "Medel", interest: "Medel", role: "Installation i fastigheter" },
    { name: "Enhetschefer hemtjänst", count: "8 st", impact: "Hög", interest: "Högt", role: "Verksamhetsansvar" },
    { name: "Kommunledning", count: "–", impact: "Medel", interest: "Högt", role: "Budget och strategi" },
  ];

  const impactColor = (level: string) => {
    if (level === "Hög" || level === "Högt") return "bg-primary/10 text-primary";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Intressent</TableHead>
            <TableHead>Antal</TableHead>
            <TableHead>Påverkan</TableHead>
            <TableHead>Intresse</TableHead>
            <TableHead className="hidden sm:table-cell">Roll</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stakeholders.map((s, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.count}</TableCell>
              <TableCell>
                <Badge variant="outline" className={impactColor(s.impact)}>{s.impact}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={impactColor(s.interest)}>{s.interest}</Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">{s.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Step4Content() {
  return (
    <div className="space-y-6">
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                {"Utan förändring fortsätter personalen hantera fysiska nycklar med alla tillhörande problem. Kostnaderna är inte bara ekonomiska utan påverkar även arbetsmiljö och vårdkvalitet."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Beräknad årskostnad för nollalternativet"}
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <div className="text-sm font-medium">{"Förlorad arbetstid"}</div>
              <div className="text-xs text-muted-foreground">{"6% av arbetstid x 560 medarbetare x 32 000 kr/mån"}</div>
            </div>
            <div className="text-lg font-bold text-primary">{"1 290 tkr"}</div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <div className="text-sm font-medium">{"Administration och nyckelhantering"}</div>
              <div className="text-xs text-muted-foreground">{"Nyckelkopiering, register, utlämning"}</div>
            </div>
            <div className="text-lg font-bold text-primary">{"250 tkr"}</div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <div className="text-sm font-medium">{"Incidentkostnader"}</div>
              <div className="text-xs text-muted-foreground">{"Låsbyte, akutinsatser vid borttappade nycklar"}</div>
            </div>
            <div className="text-lg font-bold text-primary">{"100 tkr"}</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
            <div className="text-sm font-bold">{"Total årlig kostnad för nollalternativet"}</div>
            <div className="text-xl font-bold text-primary">{"~1 640 tkr"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step5Content() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {"Nyttoträdet visar den logiska kedjan från aktivitet till realiserad nytta. Varje steg ska vara spårbart."}
      </p>

      {/* Visual tree representation */}
      <div className="space-y-4">
        {/* Aktivitet */}
        <div className="flex justify-center">
          <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-center max-w-xs">
            <div className="text-xs font-semibold uppercase text-primary mb-1">Aktivitet</div>
            <div className="text-sm font-medium">{"Införa digitala lås i hemtjänsten"}</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="h-6 w-px bg-border" />
        </div>

        {/* Output */}
        <div className="flex justify-center">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-center max-w-xs">
            <div className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1">Output</div>
            <div className="text-sm font-medium">{"1 200 digitala lås installerade"}</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="h-6 w-px bg-border" />
        </div>

        {/* Effekter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            "Minskad restid",
            "Ökad säkerhet",
            "Bättre arbetsmiljö",
          ].map((effect) => (
            <div key={effect} className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3 py-2 text-center">
              <div className="text-xs font-semibold uppercase text-green-600 dark:text-green-400 mb-1">Effekt</div>
              <div className="text-sm font-medium">{effect}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="h-6 w-px bg-border" />
        </div>

        {/* Nyttor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2">
            <div className="text-xs font-semibold uppercase text-amber-600 dark:text-amber-400 mb-1">{"Finansiell nytta"}</div>
            <div className="text-sm font-medium">{"Frigjord arbetstid (1,3 mkr/år)"}</div>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2">
            <div className="text-xs font-semibold uppercase text-amber-600 dark:text-amber-400 mb-1">{"Finansiell nytta"}</div>
            <div className="text-sm font-medium">{"Minskade incidentkostnader (100 tkr/år)"}</div>
          </div>
          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-3 py-2">
            <div className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400 mb-1">{"Kvalitativ nytta"}</div>
            <div className="text-sm font-medium">{"Ökad brukarnöjdhet"}</div>
          </div>
          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-3 py-2">
            <div className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400 mb-1">{"Kvalitativ nytta"}</div>
            <div className="text-sm font-medium">{"Förbättrad arbetsmiljö"}</div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Kostnader */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Investering lås", type: "Engångskostnad" },
            { label: "Installation", type: "Engångskostnad" },
            { label: "Utbildning", type: "Engångskostnad" },
            { label: "Plattformslicens & drift", type: "Löpande kostnad" },
          ].map((cost) => (
            <div key={cost.label} className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2">
              <div className="text-xs font-semibold uppercase text-red-600 dark:text-red-400 mb-1">{cost.type}</div>
              <div className="text-sm font-medium">{cost.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step6Content() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Nyttokategorier"}
        </h4>
        <div className="space-y-3">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-green-600 dark:text-green-400" />
                <h5 className="font-semibold text-sm">{"Finansiella nyttor (kvantifierbara)"}</h5>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                <li>{"Minskad restid personal – direkt tidsvinst som kan omfördelas"}</li>
                <li>{"Minskad administration – färre manuella processer"}</li>
                <li>{"Minskade incidentkostnader – inga låsbyten vid borttappade nycklar"}</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h5 className="font-semibold text-sm">{"Kvalitativa nyttor"}</h5>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                <li>{"Ökad brukarnöjdhet – färre inställda besök"}</li>
                <li>{"Bättre arbetsmiljö – minskad stress, enklare vardag"}</li>
                <li>{"Ökad säkerhet – digital spårbarhet, inga fysiska nycklar"}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Kostnadskategorier"}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Investering", items: ["Digitala lås (hårdvara)", "Installation i fastigheter"] },
            { title: "Drift", items: ["Plattformslicens", "Support & underhåll"] },
            { title: "Övriga", items: ["Utbildning personal", "Projektledning"] },
          ].map((cat) => (
            <Card key={cat.title} className="border-border/50">
              <CardContent className="pt-4 pb-4">
                <h5 className="font-semibold text-sm mb-2">{cat.title}</h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <Minus className="h-3 w-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step7Content() {
  const benefits = [
    { name: "Minskad restid personal", y1: 650, y2: 1300, y3: 1300, y4: 1300, y5: 1300, y6: 1300 },
    { name: "Minskad administration", y1: 125, y2: 250, y3: 250, y4: 250, y5: 250, y6: 250 },
    { name: "Minskade incidentkostnader", y1: 50, y2: 100, y3: 100, y4: 100, y5: 100, y6: 100 },
  ];

  const costs = [
    { name: "Investering lås (1 200 st)", y1: 4200, y2: 0, y3: 0, y4: 0, y5: 0, y6: 0 },
    { name: "Installation", y1: 1200, y2: 0, y3: 0, y4: 0, y5: 0, y6: 0 },
    { name: "Utbildning personal", y1: 350, y2: 0, y3: 0, y4: 0, y5: 0, y6: 0 },
    { name: "Plattformslicens/drift", y1: 480, y2: 480, y3: 480, y4: 480, y5: 480, y6: 480 },
    { name: "Support & underhåll", y1: 180, y2: 180, y3: 180, y4: 180, y5: 180, y6: 180 },
  ];

  const yearKeys = ["y1", "y2", "y3", "y4", "y5", "y6"] as const;

  const totalBenefitsPerYear = yearKeys.map((yk) =>
    benefits.reduce((sum, b) => sum + b[yk], 0)
  );
  const totalCostsPerYear = yearKeys.map((yk) =>
    costs.reduce((sum, c) => sum + c[yk], 0)
  );
  const netPerYear = yearKeys.map((_, i) => totalBenefitsPerYear[i] - totalCostsPerYear[i]);

  const totalBenefits = totalBenefitsPerYear.reduce((s, v) => s + v, 0);
  const totalCosts = totalCostsPerYear.reduce((s, v) => s + v, 0);

  // Find max for chart scaling
  const maxVal = Math.max(...totalBenefitsPerYear, ...totalCostsPerYear);

  return (
    <div className="space-y-6">
      {/* KPI summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "NPV (6 år, 3%)", value: "2 847 tkr", positive: true },
          { label: "BCR", value: "1,37", positive: true },
          { label: "IRR", value: "18,2%", positive: true },
          { label: "SROI", value: "1,52", positive: true },
          { label: "Payback", value: "3,8 år", positive: false },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg bg-muted/30 p-3 text-center">
            <div className={`text-lg font-bold ${kpi.positive ? "text-green-600 dark:text-green-400" : "text-primary"}`}>
              {kpi.value}
            </div>
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* CSS Bar Chart */}
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Nyttor vs. kostnader per år (tkr)"}
        </h4>
        <div className="space-y-3">
          {yearKeys.map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{`År ${i + 1}`}</span>
                <span className={netPerYear[i] >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {netPerYear[i] >= 0 ? "+" : ""}{netPerYear[i].toLocaleString("sv-SE")} tkr netto
                </span>
              </div>
              <div className="flex gap-1 h-5">
                <div
                  className="bg-green-500/80 dark:bg-green-400/80 rounded-sm transition-all"
                  style={{ width: `${(totalBenefitsPerYear[i] / maxVal) * 100}%` }}
                  title={`Nyttor: ${totalBenefitsPerYear[i]} tkr`}
                />
              </div>
              <div className="flex gap-1 h-5">
                <div
                  className="bg-red-400/80 dark:bg-red-500/80 rounded-sm transition-all"
                  style={{ width: `${(totalCostsPerYear[i] / maxVal) * 100}%` }}
                  title={`Kostnader: ${totalCostsPerYear[i]} tkr`}
                />
              </div>
            </div>
          ))}
          <div className="flex gap-4 text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-green-500/80 dark:bg-green-400/80" />
              Nyttor
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-red-400/80 dark:bg-red-500/80" />
              Kostnader
            </div>
          </div>
        </div>
      </div>

      {/* Detailed table */}
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Detaljerad kalkyl (tkr)"}
        </h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                {yearKeys.map((_, i) => (
                  <TableHead key={i} className="text-right">{`År ${i + 1}`}</TableHead>
                ))}
                <TableHead className="text-right">Totalt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="font-bold text-green-700 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10">
                  Nyttor
                </TableCell>
              </TableRow>
              {benefits.map((b) => (
                <TableRow key={b.name}>
                  <TableCell className="text-muted-foreground">{b.name}</TableCell>
                  {yearKeys.map((yk) => (
                    <TableCell key={yk} className="text-right">{b[yk].toLocaleString("sv-SE")}</TableCell>
                  ))}
                  <TableCell className="text-right font-medium">
                    {yearKeys.reduce((sum, yk) => sum + b[yk], 0).toLocaleString("sv-SE")}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-green-50/30 dark:bg-green-900/5">
                <TableCell className="font-bold">Summa nyttor</TableCell>
                {totalBenefitsPerYear.map((v, i) => (
                  <TableCell key={i} className="text-right font-bold">{v.toLocaleString("sv-SE")}</TableCell>
                ))}
                <TableCell className="text-right font-bold text-green-700 dark:text-green-400">{totalBenefits.toLocaleString("sv-SE")}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={8} className="font-bold text-red-700 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10">
                  Kostnader
                </TableCell>
              </TableRow>
              {costs.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="text-muted-foreground">{c.name}</TableCell>
                  {yearKeys.map((yk) => (
                    <TableCell key={yk} className="text-right">{c[yk] > 0 ? c[yk].toLocaleString("sv-SE") : "–"}</TableCell>
                  ))}
                  <TableCell className="text-right font-medium">
                    {yearKeys.reduce((sum, yk) => sum + c[yk], 0).toLocaleString("sv-SE")}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-red-50/30 dark:bg-red-900/5">
                <TableCell className="font-bold">Summa kostnader</TableCell>
                {totalCostsPerYear.map((v, i) => (
                  <TableCell key={i} className="text-right font-bold">{v.toLocaleString("sv-SE")}</TableCell>
                ))}
                <TableCell className="text-right font-bold text-red-700 dark:text-red-400">{totalCosts.toLocaleString("sv-SE")}</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold">Netto</TableCell>
                {netPerYear.map((v, i) => (
                  <TableCell key={i} className={`text-right font-bold ${v >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                    {v >= 0 ? "+" : ""}{v.toLocaleString("sv-SE")}
                  </TableCell>
                ))}
                <TableCell className={`text-right font-bold ${(totalBenefits - totalCosts) >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {(totalBenefits - totalCosts) >= 0 ? "+" : ""}{(totalBenefits - totalCosts).toLocaleString("sv-SE")}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}

function Step8Content() {
  const sensitivities = [
    { param: "Lönekostnad", change: "±20%", npvLow: "1 540 tkr", npvHigh: "4 154 tkr", impact: 96 },
    { param: "Antal brukare", change: "±15%", npvLow: "2 010 tkr", npvHigh: "3 684 tkr", impact: 62 },
    { param: "Installationskostnad", change: "±25%", npvLow: "2 547 tkr", npvHigh: "3 147 tkr", impact: 22 },
    { param: "Driftkostnad", change: "±30%", npvLow: "2 055 tkr", npvHigh: "3 639 tkr", impact: 58 },
    { param: "Diskonteringsränta", change: "1–5%", npvLow: "2 542 tkr", npvHigh: "3 204 tkr", impact: 25 },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {"Tornadodiagrammet visar vilka parametrar som har störst påverkan på nuvärdet (NPV). Ju bredare stapel, desto känsligare är kalkylen för den variabeln."}
      </p>

      {/* Tornado diagram */}
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Tornado – Känslighet per parameter"}
        </h4>
        <div className="space-y-3">
          {sensitivities.map((s) => (
            <div key={s.param} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.param}</span>
                <Badge variant="outline" className="text-xs">{s.change}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16 text-right shrink-0">{s.npvLow}</span>
                <div className="flex-1 h-6 bg-muted/30 rounded-sm relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-1/2 bg-primary/60 rounded-sm"
                    style={{ width: `${s.impact / 2}%`, transform: "translateX(-100%)" }}
                  />
                  <div
                    className="absolute inset-y-0 left-1/2 bg-primary/30 rounded-sm"
                    style={{ width: `${s.impact / 2}%` }}
                  />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-foreground/30" />
                </div>
                <span className="text-xs text-muted-foreground w-16 shrink-0">{s.npvHigh}</span>
              </div>
            </div>
          ))}
          <div className="text-center text-xs text-muted-foreground mt-2">
            {"NPV baskalkyl: 2 847 tkr (mittlinje)"}
          </div>
        </div>
      </div>

      {/* Key findings */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-2">
              <h5 className="font-semibold text-sm">{"Slutsats"}</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {"Kalkylen är mest känslig för antagandet om lönekostnad/timkostnad. Även vid pessimistiskt scenario (−20% lönekostnad) är NPV positivt (1 540 tkr) och BCR > 1. Investeringen är robust."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step9Content() {
  const benefitOwners = [
    { benefit: "Minskad restid personal", owner: "Enhetschef hemtjänst, Maria Johansson", kpi: "Genomsnittlig tid nyckelhämtning per dag", target: "< 5 min/dag (från 45 min/dag)", freq: "Månadsvis" },
    { benefit: "Minskad administration", owner: "Administrativ chef, Lars Eriksson", kpi: "Antal manuella nyckelärenden per månad", target: "< 10 ärenden (från ~80)", freq: "Kvartalsvis" },
    { benefit: "Minskade incidenter", owner: "Säkerhetsansvarig, Anna Bergström", kpi: "Antal nyckelrelaterade säkerhetsincidenter", target: "0 incidenter (från ~15/år)", freq: "Kvartalsvis" },
    { benefit: "Ökad brukarnöjdhet", owner: "Verksamhetschef, Erik Lindqvist", kpi: "Brukarenkät fråga 12 (tillgänglighet)", target: "NKI > 4,2 (från 3,6)", freq: "Halvårsvis" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {"Varje nytta har en ansvarig ägare med mandat att säkerställa att nyttan realiseras, samt definierade KPI:er och mätfrekvens."}
      </p>

      <div className="space-y-4">
        {benefitOwners.map((bo, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h5 className="font-semibold text-sm">{bo.benefit}</h5>
                <Badge variant="outline" className="shrink-0">
                  <UserCheck className="h-3 w-3 mr-1" />
                  {bo.owner.split(",")[0]}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-medium mb-1">KPI</div>
                  <div>{bo.kpi}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Målvärde</div>
                  <div>{bo.target}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Mätfrekvens</div>
                  <div>{bo.freq}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Step10Content() {
  const checkpoints = [
    { quarter: "Q1 2025", focus: "Pilotinstallation (200 lås)", status: "Genomförd", milestone: "Teknik verifierad, utbildningsmaterial klart" },
    { quarter: "Q2 2025", focus: "Fas 2 utrullning (500 lås)", status: "Genomförd", milestone: "Första effektmätning restid" },
    { quarter: "Q3 2025", focus: "Full utrullning (1 200 lås)", status: "Pågår", milestone: "Alla enheter live" },
    { quarter: "Q4 2025", focus: "Stabilisering och optimering", status: "Planerad", milestone: "6-månaders effektmätning" },
    { quarter: "Q1 2026", focus: "Första årliga effektmätning", status: "Planerad", milestone: "NPV-uppföljning" },
    { quarter: "Q2 2026", focus: "Nyttorealisering uppföljning", status: "Planerad", milestone: "BCR/SROI-verifiering" },
    { quarter: "Q3 2026", focus: "Eventuella justeringar", status: "Planerad", milestone: "Korrigering av KPI-mål vid behov" },
    { quarter: "Q4 2026", focus: "Slutrapport nyttorealisering", status: "Planerad", milestone: "Fullständig effektrapport till kommunstyrelsen" },
  ];

  const statusColor = (status: string) => {
    if (status === "Genomförd") return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    if (status === "Pågår") return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {"Kvartalsvis uppföljning under 2 år säkerställer att nyttorna realiseras som planerat."}
      </p>

      <div className="space-y-3">
        {checkpoints.map((cp, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                cp.status === "Genomförd"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : cp.status === "Pågår"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "bg-muted text-muted-foreground"
              }`}>
                {cp.status === "Genomförd" ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              {i < checkpoints.length - 1 && <div className="mt-1 h-6 w-px bg-border" />}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{cp.quarter}</span>
                <Badge variant="outline" className={`text-xs ${statusColor(cp.status)}`}>{cp.status}</Badge>
              </div>
              <div className="text-sm">{cp.focus}</div>
              <div className="text-xs text-muted-foreground">{cp.milestone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step11Content() {
  const measurements = [
    { kpi: "Restid nyckelhämtning", baseline: "45 min/dag", target: "< 5 min/dag", actual: "3 min/dag", pct: 105, trend: "up" },
    { kpi: "Manuella nyckelärenden", baseline: "80/mån", target: "< 10/mån", actual: "6/mån", pct: 106, trend: "up" },
    { kpi: "Säkerhetsincidenter", baseline: "15/år", target: "0/år", actual: "1/år", pct: 93, trend: "up" },
    { kpi: "Brukarnöjdhet (NKI)", baseline: "3,6", target: "> 4,2", actual: "4,4", pct: 110, trend: "up" },
    { kpi: "Ekonomisk besparing", baseline: "–", target: "1 650 tkr/år", actual: "1 580 tkr/år", pct: 96, trend: "flat" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <h5 className="font-semibold text-sm">{"Resultat efter 12 månader"}</h5>
              <p className="text-sm text-muted-foreground mt-1">
                {"Samtliga KPI:er uppnår eller överträffar målvärden. Den ekonomiska besparingen ligger 4% under prognos men bedöms nå målet under år 2."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>KPI</TableHead>
              <TableHead>Baslinje</TableHead>
              <TableHead>Mål</TableHead>
              <TableHead>Utfall</TableHead>
              <TableHead className="text-right">Måluppfyllnad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {measurements.map((m) => (
              <TableRow key={m.kpi}>
                <TableCell className="font-medium">{m.kpi}</TableCell>
                <TableCell className="text-muted-foreground">{m.baseline}</TableCell>
                <TableCell>{m.target}</TableCell>
                <TableCell className="font-medium">{m.actual}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {m.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    )}
                    <Badge
                      variant={m.pct >= 100 ? "default" : "outline"}
                      className={m.pct >= 100 ? "" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"}
                    >
                      {m.pct}%
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Step12Content() {
  const lessons = [
    { type: "positive", text: "Pilotfasen var avgörande – tidig testning i en enhet identifierade tekniska problem innan full utrullning." },
    { type: "positive", text: "Personalens delaktighet i processen minskade förändringsmotståndet markant." },
    { type: "positive", text: "Tydliga nyttoägare med mandat säkerställde att nyttorna verkligen realiserades." },
    { type: "negative", text: "Fastighetsägare borde involverats tidigare – installationsfasen försenades 3 veckor." },
    { type: "negative", text: "Utbildningsinsatsen underskattades – ytterligare repetitionsutbildning behövdes efter 3 månader." },
    { type: "insight", text: "Nyttokalkylen var ovärderlig som kommunikationsverktyg gentemot kommunstyrelsen vid budgetbeslut." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Lärdomar"}
        </h4>
        <div className="space-y-2">
          {lessons.map((l, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
              {l.type === "positive" && <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />}
              {l.type === "negative" && <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />}
              {l.type === "insight" && <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />}
              <span className="text-sm">{l.text}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Summary card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-4 space-y-4">
          <h4 className="font-semibold">{"Sammanfattning: Nyckelfri hemtjänst i Eksunda kommun"}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-xl font-bold text-primary">{"2 847"}</div>
              <div className="text-xs text-muted-foreground">{"NPV (tkr)"}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">{"1,37"}</div>
              <div className="text-xs text-muted-foreground">{"BCR"}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">{"96%"}</div>
              <div className="text-xs text-muted-foreground">{"Genomsnittlig måluppfyllnad"}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">{"3,8 år"}</div>
              <div className="text-xs text-muted-foreground">{"Payback-tid"}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {"Projektet Nyckelfri hemtjänst i Eksunda kommun visar en tydlig positiv nyttokalkyl med NPV på 2 847 tkr och BCR på 1,37 över 6 år. Samtliga SMART-mål har uppnåtts eller överträffats efter 12 månader. De kvalitativa nyttorna (arbetsmiljö, brukarnöjdhet) har också förbättrats signifikant. Kalkylen är robust enligt känslighetsanalysen."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP CONTENT ROUTER                                                */
/* ------------------------------------------------------------------ */

function StepContent({ stepNumber }: { stepNumber: number }) {
  switch (stepNumber) {
    case 1: return <Step1Content />;
    case 2: return <Step2Content />;
    case 3: return <Step3Content />;
    case 4: return <Step4Content />;
    case 5: return <Step5Content />;
    case 6: return <Step6Content />;
    case 7: return <Step7Content />;
    case 8: return <Step8Content />;
    case 9: return <Step9Content />;
    case 10: return <Step10Content />;
    case 11: return <Step11Content />;
    case 12: return <Step12Content />;
    default: return null;
  }
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function DemoWorkshopPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1-12 = steps

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const step = currentStep > 0 ? steps[currentStep - 1] : null;
  const progressPercent = currentStep === 0 ? 0 : (currentStep / 12) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              CVRF Nyttokalkyl
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:inline-flex">
              <Lock className="h-3 w-3 mr-1" />
              {"Workshop Demo"}
            </Badge>
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/demo">
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">{"Alla demos"}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        {currentStep > 0 && (
          <div className="mx-auto max-w-6xl px-6 pb-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {`Steg ${currentStep} av 12`}
              </span>
              <Progress value={progressPercent} className="flex-1" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {`${Math.round(progressPercent)}%`}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Intro view */}
      {currentStep === 0 && (
        <>
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/3 blur-3xl" />
            </div>

            <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 text-center sm:pt-24 sm:pb-20">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Building2 className="h-4 w-4" />
                {"Interaktiv workshop"}
              </div>

              <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                {"Nyckelfri hemtjänst i "}
                <span className="text-primary">Eksunda kommun</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {"Välkommen till denna interaktiva genomgång av en komplett nyttokalkyl! Du kommer att följa alla 12 steg i CVRF-modellen genom ett realistiskt scenario: införande av digitala lås i hemtjänsten för en medelstor svensk kommun (~45 000 invånare)."}
              </p>
            </div>
          </section>

          {/* What you will learn */}
          <section className="border-t border-border/40 bg-muted/30 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {"Vad du kommer att lära dig"}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {"Genom detta scenario ser du hur varje steg i nyttokalkylen byggs upp med konkret data."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Target, title: "Identifiera och kvantifiera problem", desc: "Hur man omvandlar en verksamhetsutmaning till mätbara mål" },
                  { icon: TreePine, title: "Bygga ett nyttoträd", desc: "Visa logiska samband från aktivitet till nytta" },
                  { icon: TrendingUp, title: "Beräkna finansiella nyckeltal", desc: "NPV, BCR, IRR, SROI och payback-tid i praktiken" },
                  { icon: BarChart3, title: "Genomföra känslighetsanalys", desc: "Testa hur robust kalkylen är mot förändrade antaganden" },
                  { icon: CalendarCheck, title: "Planera nyttorealisering", desc: "Tilldela nyttoägare, definiera KPI:er och mätfrekvens" },
                  { icon: LineChart, title: "Mäta och följa upp effekter", desc: "Jämföra faktiskt utfall mot planerade nyttor" },
                ].map((item) => (
                  <Card key={item.title} className="border-border/50 bg-card/80">
                    <CardContent className="pt-5 pb-5 space-y-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Scenario overview */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-6">
              <div className="mx-auto max-w-2xl text-center mb-10">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {"Scenariot"}
                </h2>
              </div>

              <Card className="border-primary/20">
                <CardContent className="pt-6 pb-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Kommun</div>
                        <div className="font-semibold">{"Eksunda kommun (fiktiv)"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Invånare</div>
                        <div className="font-semibold">{"~45 000"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Projekt</div>
                        <div className="font-semibold">{"Nyckelfri hemtjänst (digitala lås)"}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Hemtjänstpersonal</div>
                        <div className="font-semibold">{"560 medarbetare"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Brukare</div>
                        <div className="font-semibold">{"1 200 personer"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Kalkylperiod</div>
                        <div className="font-semibold">{"6 år"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Steps overview */}
          <section className="border-t border-border/40 bg-muted/30 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mx-auto max-w-2xl text-center mb-10">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {"12 steg i CVRF-modellen"}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {"Klicka på \"Starta genomgången\" nedan för att börja, eller klicka direkt på ett steg."}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {steps.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => setCurrentStep(s.number)}
                    className="flex items-center gap-3 p-3 rounded-lg text-left hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {s.number}
                    </div>
                    <div>
                      <div className="text-sm font-medium group-hover:text-primary transition-colors">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.phase}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Button size="lg" className="px-8 text-base" onClick={() => setCurrentStep(1)}>
                  {"Starta genomgången"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>



        </>
      )}

      {/* Step view */}
      {currentStep > 0 && step && (
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-4xl px-6">
            {/* Step navigation pills */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-1 min-w-max pb-2">
                {steps.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => setCurrentStep(s.number)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      s.number === currentStep
                        ? "bg-primary text-primary-foreground"
                        : s.number < currentStep
                          ? "bg-primary/20 text-primary hover:bg-primary/30"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    title={`Steg ${s.number}: ${s.title}`}
                  >
                    {s.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase and step header */}
            <div className="mb-6">
              <Badge variant="outline" className={step.phaseColor}>
                {step.phase}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">
                      {`Steg ${step.number}: ${step.title}`}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm leading-relaxed">
                      {step.about}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StepContent stepNumber={step.number} />
              </CardContent>
            </Card>

            {/* Learning point */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{"Nyckelinsikt"}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.learningPoint}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{"Diskussionsfråga"}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.discussionPrompt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentStep === 1 ? "Intro" : `Steg ${currentStep - 1}`}
              </Button>

              {currentStep < 12 ? (
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  {`Steg ${currentStep + 1}`}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => setCurrentStep(0)}>
                  {"Tillbaka till start"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background mt-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
                C
              </div>
              <span className="text-sm font-medium">CVRF Nyttokalkyl</span>
            </Link>
            <span className="text-border">|</span>
            <span className="text-sm text-muted-foreground">Critero Consulting AB</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {"Workshop-demo – data är fiktiv. "}
            {"© "}{new Date().getFullYear()}{" CVRF Nyttokalkyl."}
          </p>
        </div>
      </footer>
    </div>
  );
}
