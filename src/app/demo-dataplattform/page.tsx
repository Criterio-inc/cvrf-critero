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
  Database,
  Shield,
  Building2,
  UserCheck,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BrainCircuit,
  Factory,
  PieChart,
  Gauge,
  PackageSearch,
  DollarSign,
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
    about: "Vi identifierar det underliggande problemet: beslut fattas på magkänsla istället för data. Vi definierar mätbara mål för vad dataplattformen ska åstadkomma i konkreta affärstermer.",
    learningPoint: "Undvik fällan att definiera målet som 'bli datadrivna'. Koppla istället till specifika beslut som ska förbättras och vad bättre beslut är värda i kronor.",
    discussionPrompt: "Vilka är de tre viktigaste besluten i er verksamhet som idag fattas utan tillräckligt dataunderlag?",
  },
  {
    number: 2,
    title: "Strategisk koppling",
    icon: GitCompareArrows,
    phase: "FÖRSTÅ",
    phaseColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    about: "Vi utvärderar alternativa lösningar och kopplar satsningen till företagets affärsstrategi. Nollalternativet visar vad det kostar att fortsätta med silobaserade Excel-rapporter.",
    learningPoint: "En dataplattform utan strategisk koppling till affärsmål blir ett kostsamt teknikprojekt. Börja alltid med 'varför' – inte 'hur'.",
    discussionPrompt: "Hur ser er nuvarande rapportering ut? Hur lång tid tar det att ta fram ett beslutsunderlag idag?",
  },
  {
    number: 3,
    title: "Intressentanalys",
    icon: Users,
    phase: "FÖRSTÅ",
    phaseColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    about: "Vi kartlägger alla som påverkas: från ledningsgruppen som vill ha bättre styrning, till analytiker som behöver verktyg, till medarbetare vars arbetsflöden förändras.",
    learningPoint: "Data-initiativ misslyckas oftare pga. organisation och kultur än teknik. Kartlägg inte bara tekniska intressenter utan även de som måste ändra beteende.",
    discussionPrompt: "Vilka i er organisation skulle vara mest motståndare respektive mest förespråkare av en gemensam dataplattform?",
  },
  {
    number: 4,
    title: "Nollalternativ",
    icon: AlertTriangle,
    phase: "KARTLÄGGA",
    phaseColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    about: "Vad kostar det att INTE investera? Vi kvantifierar kostnaden för dagens situation: manuella rapporter, felbeslut, förlorade marginaler och missade marknadsmöjligheter.",
    learningPoint: "Kostnaden för sämre beslut är ofta osynlig men enorm. Ett inköpsbeslut som är 2% fel på 500 mkr i inköpsvolym kostar 10 mkr om året.",
    discussionPrompt: "Kan ni peka på ett konkret exempel där bättre data hade lett till ett bättre beslut i ert företag?",
  },
  {
    number: 5,
    title: "Nyttoträd",
    icon: TreePine,
    phase: "KARTLÄGGA",
    phaseColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    about: "Vi bygger ett nyttoträd som visar den logiska kedjan: Dataplattform → Automatiserade rapporter → Bättre beslutsunderlag → Konkreta affärsnyttor (ökad marginal, minskad lagerkostnad etc.)",
    learningPoint: "Utan ett nyttoträd är det lätt att hamna i 'datadrivet fluff'. Kedjan måste vara logisk: om du inte kan förklara varför data leder till pengar, gör det antagligen inte det.",
    discussionPrompt: "Vilka konkreta beslut i er verksamhet skulle förbättras mest av bättre dataunderlag?",
  },
  {
    number: 6,
    title: "Kostnader",
    icon: Coins,
    phase: "BERÄKNA",
    phaseColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    about: "Vi kartlägger alla kostnader: plattformslicenser, implementation, datamigrering, utbildning, intern resursåtgång, förändringsledning och löpande förvaltning.",
    learningPoint: "Dataplattformsprojekt har ofta stora dolda kostnader: datakvalitetsarbete (30-40% av total budget), intern tid, och produktivitetsdipp under övergången.",
    discussionPrompt: "Hur mycket tid lägger era medarbetare idag på att 'jaga data' – hämta, rensa och sammanställa information manuellt?",
  },
  {
    number: 7,
    title: "Nyttor & Värden",
    icon: TrendingUp,
    phase: "BERÄKNA",
    phaseColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    about: "Vi värderar nyttorna i kronor: bättre inköpsbeslut, minskad lagerkostnad, effektivare rapportering, förbättrad prissättning och bättre prognoser. NPV, BCR, IRR och SROI beräknas.",
    learningPoint: "Nuvärdesberäkningen (NPV) tar hänsyn till att dataplattformens nyttor växer över tid medan investeringskostnaderna är framtunga. Tålamod behövs – payback kommer först år 2–3.",
    discussionPrompt: "Hur värderar ni idag skillnaden mellan ett 'bra' och ett 'dåligt' inköpsbeslut?",
  },
  {
    number: 8,
    title: "Kalkyl & Känslighet",
    icon: BarChart3,
    phase: "BERÄKNA",
    phaseColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    about: "Känslighetsanalysen testar kalkylens robusthet: vad händer om adoptionsgraden blir lägre? Om datakvalitetsarbetet tar längre tid? Om prisförbättringen bara blir hälften?",
    learningPoint: "En robust kalkyl visar att investeringen lönar sig även i pessimistiskt scenario. Det ger beslutsfattare mod att agera.",
    discussionPrompt: "Vilka antaganden i er kalkyl skulle ni vilja stresstesta mest?",
  },
  {
    number: 9,
    title: "Realiseringsplan",
    icon: CalendarCheck,
    phase: "REALISERA",
    phaseColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    about: "Varje nytta tilldelas en nyttoägare med mandat. CFO äger marginalnyttorna, Inköpschef äger inköpsbesparingarna, Logistikchef äger lageroptimeringen.",
    learningPoint: "'Det som inte ägs, realiseras inte.' En nytta utan ansvarig ägare är bara en siffra i ett dokument.",
    discussionPrompt: "Vem i er ledningsgrupp borde äga vilka nyttor från en dataplattformsinvestering?",
  },
  {
    number: 10,
    title: "Uppföljningspunkter",
    icon: ClipboardCheck,
    phase: "REALISERA",
    phaseColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    about: "Vi definierar kvartalsvis uppföljning av alla KPI:er under två år. Varje checkpoint inkluderar avvikelseanalys och korrigeringsåtgärder.",
    learningPoint: "Dataplattformar levererar sällan full nytta dag ett. Uppföljningen fångar den gradvisa nyttokurvan och korrigerar vid avvikelser.",
    discussionPrompt: "Hur följer ni upp ROI på era IT-investeringar idag?",
  },
  {
    number: 11,
    title: "Effektmätning",
    icon: LineChart,
    phase: "LÄRA",
    phaseColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    about: "Efter 12 månader mäter vi faktiskt utfall: har inköpspriserna minskat? Har lagret optimerats? Har rapporteringstiden minskat? Vi jämför mot baslinje.",
    learningPoint: "Mätningen handlar inte om att 'bevisa' att projektet lyckades – den handlar om att lära och kalibrera framtida kalkyler.",
    discussionPrompt: "Mäter ni effekter av era IT-investeringar 12 månader efter go-live?",
  },
  {
    number: 12,
    title: "Lärdomar & Rapport",
    icon: BookOpen,
    phase: "LÄRA",
    phaseColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    about: "Vi sammanfattar hela kalkylen, dokumenterar lärdomar och skapar en exporterbar rapport. Vad fungerade? Vad underskattades?",
    learningPoint: "Lärdomarna är mer värdefulla än kalkylen själv. De förbättrar kvaliteten på alla framtida investeringsbeslut.",
    discussionPrompt: "Hur tar ni tillvara lärdomar från avslutade IT-projekt i er organisation?",
  },
];

/* ------------------------------------------------------------------ */
/*  STEP CONTENT RENDERERS                                             */
/* ------------------------------------------------------------------ */

function Step1Content() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
          Problembeskrivning
        </h4>
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed">
                {"Nordvik Industri AB (fiktivt) är ett medelstort svenskt tillverkningsföretag med "}
                <strong>{"850 mkr i omsättning"}</strong>
                {" och 420 anställda. Företaget har idag data utspritt i 12+ olika system utan gemensam dataplattform. Ledningsgruppen fattar strategiska beslut baserat på manuellt sammanställda Excel-rapporter som tar "}
                <strong>{"3–5 arbetsdagar"}</strong>
                {" att ta fram och ofta innehåller fel."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-background p-3 text-center">
                <div className="text-2xl font-bold text-primary">{"12+"}</div>
                <div className="text-xs text-muted-foreground">{"Separata datasystem"}</div>
              </div>
              <div className="rounded-lg bg-background p-3 text-center">
                <div className="text-2xl font-bold text-primary">{"3–5"}</div>
                <div className="text-xs text-muted-foreground">{"Dagar per beslutsunderlag"}</div>
              </div>
              <div className="rounded-lg bg-background p-3 text-center">
                <div className="text-2xl font-bold text-primary">{"~15%"}</div>
                <div className="text-xs text-muted-foreground">{"Felfrekvens i rapporter"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
          Strategisk koppling
        </h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="shrink-0 mt-0.5">Affärsplan</Badge>
            <span className="text-sm">{"Nordviks tillväxtstrategi 2025–2028: 'Ökad lönsamhet genom datadrivna beslut i hela värdekedjan'"}</span>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="shrink-0 mt-0.5">Styrelse</Badge>
            <span className="text-sm">{"Styrelsen har identifierat marginalförbättring som strategisk prioritet – kräver bättre beslutsstöd"}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
          {"SMART-mål"}
        </h4>
        <div className="space-y-2">
          {[
            { goal: "Minska tid för framtagning av beslutsunderlag från 3–5 dagar till <4 timmar inom 9 månader", color: "bg-blue-500" },
            { goal: "Förbättra inköpspriserna med minst 2,5% (12,5 mkr/år) genom bättre förhandlingsunderlag inom 12 månader", color: "bg-green-500" },
            { goal: "Minska lagervärdet med 15% (9 mkr) genom bättre prognoser och lagerstyrning inom 18 månader", color: "bg-amber-500" },
          ].map((item) => (
            <div key={item.goal} className="flex items-start gap-2">
              <div className={`mt-1.5 h-2 w-2 rounded-full ${item.color} shrink-0`} />
              <span className="text-sm">{item.goal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2Content() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
          Nollalternativ
        </h4>
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-900/10">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="space-y-2 text-sm">
                <p>
                  <strong>{"Fortsätta med nuvarande silobaserade rapportering."}</strong>
                  {" Beräknad årlig kostnad: "}
                  <strong>{"~18,5 mkr"}</strong>
                  {" fördelat på:"}
                </p>
                <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
                  <li>{"8,5 mkr – Suboptimala inköpsbeslut (baserat på 1,7% prisöverbetalning på 500 mkr)"}</li>
                  <li>{"4,2 mkr – Överskottslager och inkurans (60 mkr bundet kapital × 7% lagerhållningskostnad)"}</li>
                  <li>{"3,8 mkr – Manuell rapportering och datasammanställning (8 FTE × 20% av arbetstiden)"}</li>
                  <li>{"2,0 mkr – Förlorade affärsmöjligheter pga. sen marknadsanalys"}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
          Alternativ
        </h4>
        <div className="space-y-3">
          {[
            {
              title: "Modern dataplattform (molnbaserad)",
              badge: "Rekommenderat",
              badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
              pros: "Skalbar, snabb implementation, låg driftkostnad, AI/ML-redo",
              cons: "Kräver förändringsledning och datakvalitetsarbete",
            },
            {
              title: "Utbyggnad av befintligt BI-verktyg",
              badge: "Alternativ B",
              badgeColor: "",
              pros: "Lägre initial kostnad, viss befintlig kompetens",
              cons: "Begränsad skalbarhet, fortsatt datakvalitetsproblem, ingen prediktiv förmåga",
            },
            {
              title: "Manuell förbättring av Excel-processer",
              badge: "Alternativ C",
              badgeColor: "",
              pros: "Minimal investering, ingen tekniskrisk",
              cons: "Löser inte grundproblemet, fortsatt hög felfrekvens, skalerar inte",
            },
          ].map((alt) => (
            <Card key={alt.title} className={alt.badgeColor.includes("green") ? "border-green-200 dark:border-green-800" : "border-border/50"}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h5 className="font-semibold text-sm">{alt.title}</h5>
                  <Badge variant={alt.badgeColor ? "default" : "outline"} className={alt.badgeColor}>
                    {alt.badge}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">{"Fördelar: "}</span>
                    <span className="text-muted-foreground">{alt.pros}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{"Nackdelar: "}</span>
                    <span className="text-muted-foreground">{alt.cons}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3Content() {
  const stakeholders = [
    { name: "Ledningsgruppen (7 pers)", category: "Beslutsfattare", influence: 5, interest: 5, plan: "Sponsorer och nyttomottagare – månatlig styrgrupprapport" },
    { name: "Inköpsavdelningen (18 pers)", category: "Kärnintressent", influence: 4, interest: 5, plan: "Huvudsakliga användare av inköpsanalys – deltar i kravspecifikation" },
    { name: "Ekonomi & Controlling (12 pers)", category: "Kärnintressent", influence: 4, interest: 4, plan: "Producerar idag rapporter manuellt – starkaste förändringsförespråkare" },
    { name: "Logistik & Lager (45 pers)", category: "Användare", influence: 3, interest: 4, plan: "Mottagare av lageroptimering – involveras i pilotfas" },
    { name: "Säljavdelningen (35 pers)", category: "Användare", influence: 3, interest: 3, plan: "Behöver kundinsikter – utbildning och change management" },
    { name: "IT-avdelningen (8 pers)", category: "Genomförare", influence: 4, interest: 5, plan: "Ansvarar för implementation och drift – projektledning" },
    { name: "Produktion (280 pers)", category: "Påverkade", influence: 2, interest: 2, plan: "Indirekt påverkan via bättre planering – information vid utrullning" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Intressent</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-center">{"Påverkan"}</TableHead>
              <TableHead className="text-center">Intresse</TableHead>
              <TableHead className="hidden sm:table-cell">Engagemangsplan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stakeholders.map((s) => (
              <TableRow key={s.name}>
                <TableCell className="font-medium text-sm">{s.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{s.category}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-2 w-2 rounded-full ${i < s.influence ? "bg-primary" : "bg-muted"}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-2 w-2 rounded-full ${i < s.interest ? "bg-primary" : "bg-muted"}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{s.plan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Step4Content() {
  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="pt-4 pb-4 space-y-4">
          <h5 className="font-semibold text-sm">{"Detaljerad beskrivning av nollalternativet"}</h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {"Utan en gemensam dataplattform fortsätter Nordvik Industri att förlita sig på manuellt sammanställda Excel-rapporter. Controllers lägger ~20% av sin tid på datasammanställning istället för analys. Inköpsbeslut baseras på ofullständiga data vilket leder till 1,7% överbetalning i genomsnitt. Lagerstyrningen saknar prediktiv förmåga, vilket binder ~15% mer kapital än nödvändigt."}
          </p>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h6 className="text-xs font-medium text-muted-foreground mb-2">{"Konsekvenser om 3 år"}</h6>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                  <span>{"Konkurrenter med bättre dataförmåga tar marknadsandelar"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                  <span>{"Kumulativ förlust på ~55 mkr i suboptimala beslut"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                  <span>{"Risk att tappa nyckelkompetens som vill arbeta med moderna verktyg"}</span>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="text-xs font-medium text-muted-foreground mb-2">{"Risker"}</h6>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <Shield className="h-3 w-3 text-red-500 mt-1 shrink-0" />
                  <span>{"Regulatorisk risk: ökade krav på spårbarhet och rapportering (CSRD)"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-3 w-3 text-red-500 mt-1 shrink-0" />
                  <span>{"Datakvalitetsrisk: fel i manuella rapporter kan leda till felaktiga strategibeslut"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-3 w-3 text-red-500 mt-1 shrink-0" />
                  <span>{"Beroenderisk: nyckelkompetens ('Excel-gurun') skapar flaskhalsar"}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step5Content() {
  const treeNodes = [
    { level: 0, label: "Dataplattform", type: "Aktivitet", color: "bg-blue-500" },
    { level: 1, label: "Centraliserad datakatalog", type: "Output", color: "bg-cyan-500" },
    { level: 1, label: "Automatiserade dashboards", type: "Output", color: "bg-cyan-500" },
    { level: 1, label: "Prediktiva modeller", type: "Output", color: "bg-cyan-500" },
    { level: 2, label: "Bättre inköpsbeslut", type: "Effekt", color: "bg-amber-500" },
    { level: 2, label: "Optimerad lagerstyrning", type: "Effekt", color: "bg-amber-500" },
    { level: 2, label: "Snabbare rapportering", type: "Effekt", color: "bg-amber-500" },
    { level: 2, label: "Bättre prissättning", type: "Effekt", color: "bg-amber-500" },
    { level: 3, label: "Minskade inköpskostnader (12,5 mkr/år)", type: "Nytta", color: "bg-green-500" },
    { level: 3, label: "Minskad lagerkostnad (4,2 mkr/år)", type: "Nytta", color: "bg-green-500" },
    { level: 3, label: "Frigjord arbetstid (3,8 mkr/år)", type: "Nytta", color: "bg-green-500" },
    { level: 3, label: "Ökad marginal genom prissättning (2,5 mkr/år)", type: "Nytta", color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {treeNodes.map((node, i) => (
          <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${node.level * 28}px` }}>
            {node.level > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="w-4 h-px bg-border" />
                <ChevronRight className="h-3 w-3" />
              </div>
            )}
            <div className={`h-2.5 w-2.5 rounded-full ${node.color} shrink-0`} />
            <Badge variant="outline" className="text-xs shrink-0">{node.type}</Badge>
            <span className="text-sm">{node.label}</span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Aktivitet", color: "bg-blue-500", count: 1 },
          { label: "Output", color: "bg-cyan-500", count: 3 },
          { label: "Effekt", color: "bg-amber-500", count: 4 },
          { label: "Nytta", color: "bg-green-500", count: 4 },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <div className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-muted-foreground">{item.count} {item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step6Content() {
  const costs = [
    { category: "Investering", items: [
      { name: "Plattformslicens (3 år)", amount: "2 400" },
      { name: "Implementationspartner", amount: "3 200" },
      { name: "Datamigrering och kvalitetssäkring", amount: "1 800" },
      { name: "Intern projektresurs (6 FTE-månader)", amount: "1 200" },
    ]},
    { category: "Utbildning & Change management", items: [
      { name: "Utbildning användare (120 pers)", amount: "480" },
      { name: "Förändringsledning och kommunikation", amount: "350" },
    ]},
    { category: "Löpande drift (per år)", items: [
      { name: "Plattformslicens årlig", amount: "960" },
      { name: "Förvaltning och support (1,5 FTE)", amount: "1 200" },
      { name: "Vidareutveckling", amount: "400" },
    ]},
  ];

  return (
    <div className="space-y-6">
      {costs.map((group) => (
        <div key={group.category}>
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
            {group.category}
          </h4>
          <div className="space-y-1.5">
            {group.items.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30">
                <span className="text-sm">{item.name}</span>
                <span className="font-mono text-sm font-medium">{item.amount} tkr</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <Card className="border-border/50">
          <CardContent className="pt-3 pb-3">
            <div className="text-xl font-bold text-primary">{"9 430"}</div>
            <div className="text-xs text-muted-foreground">{"Total investering (tkr)"}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-3 pb-3">
            <div className="text-xl font-bold text-primary">{"2 560"}</div>
            <div className="text-xs text-muted-foreground">{"Årlig drift (tkr)"}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-3 pb-3">
            <div className="text-xl font-bold text-primary">{"24 790"}</div>
            <div className="text-xs text-muted-foreground">{"Totalt 6 år (tkr)"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Step7Content() {
  const yearlyData = [
    { year: "År 1", benefits: 8750, costs: 12990, net: -4240 },
    { year: "År 2", benefits: 18500, costs: 2560, net: 15940 },
    { year: "År 3", benefits: 21000, costs: 2560, net: 18440 },
    { year: "År 4", benefits: 23000, costs: 2560, net: 20440 },
    { year: "År 5", benefits: 23000, costs: 2560, net: 20440 },
    { year: "År 6", benefits: 23000, costs: 2560, net: 20440 },
  ];

  const maxVal = 25000;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Nyttor per kategori (tkr/år vid full effekt)"}
        </h4>
        <div className="space-y-2">
          {[
            { name: "Förbättrade inköpspriser (−2,5% på 500 mkr)", value: "12 500", pct: 54 },
            { name: "Lageroptimering (−15% på 60 mkr bundet kapital)", value: "4 200", pct: 18 },
            { name: "Frigjord arbetstid – rapportering (8 FTE × 20%)", value: "3 800", pct: 17 },
            { name: "Förbättrad prissättning och marknadsrespons", value: "2 500", pct: 11 },
          ].map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-mono font-medium">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary/70" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Kalkylöversikt (tkr)"}
        </h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Nyttor</TableHead>
                <TableHead className="text-right">Kostnader</TableHead>
                <TableHead className="text-right">Netto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearlyData.map((row) => (
                <TableRow key={row.year}>
                  <TableCell className="font-medium">{row.year}</TableCell>
                  <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                    {row.benefits.toLocaleString("sv-SE")}
                  </TableCell>
                  <TableCell className="text-right font-mono text-red-600 dark:text-red-400">
                    {row.costs.toLocaleString("sv-SE")}
                  </TableCell>
                  <TableCell className={`text-right font-mono font-medium ${row.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {row.net.toLocaleString("sv-SE")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold">Totalt</TableCell>
                <TableCell className="text-right font-mono font-bold text-green-600 dark:text-green-400">117 250</TableCell>
                <TableCell className="text-right font-mono font-bold text-red-600 dark:text-red-400">25 790</TableCell>
                <TableCell className="text-right font-mono font-bold text-green-600 dark:text-green-400">91 460</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">{"Visuell jämförelse per år (tkr)"}</h4>
        <div className="space-y-3">
          {yearlyData.map((row) => (
            <div key={row.year} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{row.year}</span>
                <span>{"Netto: "}{row.net.toLocaleString("sv-SE")}{" tkr"}</span>
              </div>
              <div className="flex gap-1 h-5">
                <div className="bg-green-500/70 rounded-sm" style={{ width: `${(row.benefits / maxVal) * 100}%` }} title={`Nyttor: ${row.benefits}`} />
                <div className="bg-red-400/70 rounded-sm" style={{ width: `${(row.costs / maxVal) * 100}%` }} title={`Kostnader: ${row.costs}`} />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-green-500/70" /> Nyttor</div>
            <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-red-400/70" /> Kostnader</div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        {[
          { label: "NPV", value: "62 840 tkr", sub: "3% diskontring" },
          { label: "BCR", value: "4,55", sub: "Nyttokostnadskvot" },
          { label: "IRR", value: "148%", sub: "Internränta" },
          { label: "SROI", value: "4,55", sub: "Social avkastning" },
          { label: "Payback", value: "1,3 år", sub: "Återbetalningstid" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-primary/20 bg-primary/5">
            <CardContent className="pt-3 pb-3">
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
              <div className="text-lg font-bold text-primary">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Step8Content() {
  const scenarios = [
    { label: "Pessimistiskt (−25%)", npv: "41 200", color: "text-amber-600 dark:text-amber-400" },
    { label: "Troligt", npv: "62 840", color: "text-green-600 dark:text-green-400" },
    { label: "Optimistiskt (+25%)", npv: "84 600", color: "text-green-600 dark:text-green-400" },
  ];

  const tornado = [
    { variable: "Inköpsprisförbättring", low: -15800, high: 15800, base: "2,5%" },
    { variable: "Lagerreduktion", low: -6300, high: 6300, base: "15%" },
    { variable: "Adoptionsgrad användare", low: -9400, high: 4700, base: "80%" },
    { variable: "Implementationskostnad", low: -4800, high: 4800, base: "3,2 mkr" },
    { variable: "Rapporteringstid frigjord", low: -5700, high: 5700, base: "20% FTE" },
  ];

  const maxTornado = 16000;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Scenarioanalys
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          {scenarios.map((s) => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="pt-3 pb-3">
                <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                <div className={`text-lg font-bold ${s.color}`}>{s.npv}</div>
                <div className="text-xs text-muted-foreground">NPV (tkr)</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {"Tornadodiagram – NPV-påverkan per variabel (tkr)"}
        </h4>
        <div className="space-y-3">
          {tornado.map((t) => (
            <div key={t.variable}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium">{t.variable}</span>
                <span className="text-muted-foreground">{"Bas: "}{t.base}</span>
              </div>
              <div className="flex items-center h-6 relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border z-10" />
                {t.low < 0 && (
                  <div
                    className="absolute h-full bg-red-400/60 rounded-l-sm"
                    style={{
                      right: "50%",
                      width: `${(Math.abs(t.low) / maxTornado) * 50}%`,
                    }}
                  />
                )}
                <div
                  className="absolute h-full bg-green-500/60 rounded-r-sm"
                  style={{
                    left: "50%",
                    width: `${(t.high / maxTornado) * 50}%`,
                  }}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{"← Negativt"}</span>
            <span>{"Positivt →"}</span>
          </div>
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>{"Slutsats: "}</strong>
            {"Kalkylen är robust. Även i pessimistiskt scenario (−25% på alla nyttor) ger investeringen ett positivt NPV på 41 mkr. Den mest kritiska variabeln är inköpsprisförbättringen – om den uteblir helt förskjuts payback-tiden till 2,4 år men NPV är fortfarande starkt positivt (+35 mkr)."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Step9Content() {
  const owners = [
    { benefit: "Inköpsprisförbättring", owner: "Maria Ek, Inköpschef", kpi: "Genomsnittligt inköpspris per kategori", freq: "Månatlig", baseline: "Index 100", target: "Index 97,5" },
    { benefit: "Lageroptimering", owner: "Jonas Berg, Logistikchef", kpi: "Lagervärde och lageromsättningshastighet", freq: "Månatlig", baseline: "60 mkr / 4,2 ggr", target: "51 mkr / 5,8 ggr" },
    { benefit: "Frigjord rapporteringstid", owner: "Karin Holm, CFO", kpi: "Tid per beslutsunderlag", freq: "Kvartalsvis", baseline: "3–5 dagar", target: "<4 timmar" },
    { benefit: "Förbättrad prissättning", owner: "Anders Nyström, Försäljningschef", kpi: "Bruttomarginal per produktgrupp", freq: "Månatlig", baseline: "28,5%", target: "29,5%" },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nytta</TableHead>
              <TableHead>Nyttoägare</TableHead>
              <TableHead className="hidden md:table-cell">KPI</TableHead>
              <TableHead className="hidden sm:table-cell">Frekvens</TableHead>
              <TableHead className="text-right">Baslinje</TableHead>
              <TableHead className="text-right">Mål</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {owners.map((o) => (
              <TableRow key={o.benefit}>
                <TableCell className="font-medium text-sm">{o.benefit}</TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-primary shrink-0" />
                    {o.owner}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{o.kpi}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="text-xs">{o.freq}</Badge>
                </TableCell>
                <TableCell className="text-right text-sm">{o.baseline}</TableCell>
                <TableCell className="text-right text-sm font-medium text-primary">{o.target}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Card className="border-border/50"><CardContent className="pt-3 pb-3"><div className="text-xl font-bold text-primary">4</div><div className="text-xs text-muted-foreground">Nyttoägare</div></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-3 pb-3"><div className="text-xl font-bold text-primary">100%</div><div className="text-xs text-muted-foreground">Täckningsgrad</div></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-3 pb-3"><div className="text-xl font-bold text-primary">4</div><div className="text-xs text-muted-foreground">KPI:er definierade</div></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-3 pb-3"><div className="text-xl font-bold text-primary">23 000</div><div className="text-xs text-muted-foreground">Total målnytta (tkr/år)</div></CardContent></Card>
      </div>
    </div>
  );
}

function Step10Content() {
  const checkpoints = [
    { date: "Q2 2025", type: "Kvartalsvis", status: "Planerad", realization: "15%" },
    { date: "Q3 2025", type: "Kvartalsvis", status: "Planerad", realization: "35%" },
    { date: "Q4 2025", type: "Halvårs", status: "Planerad", realization: "55%" },
    { date: "Q1 2026", type: "Kvartalsvis", status: "Planerad", realization: "70%" },
    { date: "Q2 2026", type: "Halvårs", status: "Planerad", realization: "85%" },
    { date: "Q3 2026", type: "Kvartalsvis", status: "Planerad", realization: "90%" },
    { date: "Q4 2026", type: "Årsvis", status: "Planerad", realization: "95%" },
    { date: "Q4 2027", type: "Slutmätning", status: "Planerad", realization: "100%" },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tidpunkt</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Förväntad realisering</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkpoints.map((cp) => (
              <TableRow key={cp.date}>
                <TableCell className="font-medium">{cp.date}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{cp.type}</Badge></TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    <Clock className="h-3 w-3 mr-1" />{cp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: cp.realization }} />
                    </div>
                    <span className="text-sm font-mono w-10 text-right">{cp.realization}</span>
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

function Step11Content() {
  const measurements = [
    { kpi: "Inköpsprisindex", baseline: "100", target: "97,5", actual: "97,8", pct: 91, trend: "up" as const },
    { kpi: "Lagervärde (mkr)", baseline: "60", target: "51", actual: "53,4", pct: 73, trend: "up" as const },
    { kpi: "Tid per beslutsunderlag", baseline: "3–5 dagar", target: "<4 tim", actual: "2,5 tim", pct: 100, trend: "up" as const },
    { kpi: "Bruttomarginal", baseline: "28,5%", target: "29,5%", actual: "29,1%", pct: 60, trend: "up" as const },
    { kpi: "Rapportfelfrekvens", baseline: "~15%", target: "<3%", actual: "2,1%", pct: 100, trend: "up" as const },
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
                {"Tre av fem KPI:er har nått eller överträffat målvärdet. Inköpsprisförbättringen ligger nära målet (97,8 vs 97,5) och lageroptimeringen är på god väg. Total realiserad nytta: 78% av plan."}
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
              <TableHead className="text-right">{"Måluppfyllnad"}</TableHead>
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
                    {m.pct >= 100 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                    ) : m.pct >= 70 ? (
                      <ArrowUpRight className="h-3 w-3 text-amber-600 dark:text-amber-400" />
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
    { type: "positive", text: "Ekonomiavdelningen blev starkaste förändringsförespråkare – deras tid frigjordes dramatiskt redan i fas 1." },
    { type: "positive", text: "Executive sponsor (CFO) med tydligt mandat var avgörande för att driva adoption i ledningsgruppen." },
    { type: "positive", text: "Att börja med 'quick wins' (automatiserade dashboards) skapade tidigt förtroende för plattformen." },
    { type: "negative", text: "Datakvalitetsarbetet tog 40% längre tid än beräknat – borde ha startats 3 månader före implementation." },
    { type: "negative", text: "Säljavdelningens adoption var lägre än planerat – mer riktad utbildning och use case-workshops behövdes." },
    { type: "insight", text: "Nyttokalkylen var ovärderlig som kommunikationsverktyg mot styrelsen – den skapade samsyn om investeringens värde och tidsperspektiv." },
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

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-4 space-y-4">
          <h4 className="font-semibold">{"Sammanfattning: Dataplattform för Nordvik Industri AB"}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-xl font-bold text-primary">{"62 840"}</div>
              <div className="text-xs text-muted-foreground">{"NPV (tkr)"}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">{"4,55"}</div>
              <div className="text-xs text-muted-foreground">{"BCR"}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">{"78%"}</div>
              <div className="text-xs text-muted-foreground">{"Realisering efter 12 mån"}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">{"1,3 år"}</div>
              <div className="text-xs text-muted-foreground">{"Payback-tid"}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {"Nordvik Industris investering i en modern dataplattform visar ett starkt positivt NPV på 62,8 mkr med BCR 4,55 över 6 år. Payback-tiden är kort (1,3 år) och kalkylen är robust – även i pessimistiskt scenario. Den största nyttan kommer från förbättrade inköpsbeslut (54% av total nytta). Effektmätningen efter 12 månader visar 78% realisering av planerade nyttor, med rapporteringseffektivisering som överträffar förväntningarna."}
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

export default function DemoDataplattformPage() {
  const [currentStep, setCurrentStep] = useState(0);

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
              <Factory className="h-3 w-3 mr-1" />
              {"Privat sektor"}
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
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/3 blur-3xl" />
            </div>

            <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 text-center sm:pt-24 sm:pb-20">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <BrainCircuit className="h-4 w-4" />
                {"Interaktiv workshop – Privat sektor"}
              </div>

              <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                {"Dataplattform för "}
                <span className="text-primary">Nordvik Industri AB</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {"Följ en komplett nyttokalkyl för en investering i dataplattform och beslutsstöd hos ett medelstort tillverkningsföretag. Se hur diffusa mål om att 'bli datadrivna' omvandlas till konkreta, mätbara affärsnyttor – och hur kalkylen säkerställer att nyttorna faktiskt realiseras."}
              </p>
            </div>
          </section>

          <section className="border-t border-border/40 bg-muted/30 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {"Vad du kommer att lära dig"}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {"Genom detta scenario ser du hur nyttokalkylen fungerar för en privat sektors-investering."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: DollarSign, title: "Värdera 'datadrivet' i kronor", desc: "Konkretisera diffusa mål till mätbara affärseffekter" },
                  { icon: PackageSearch, title: "Koppla till affärsbeslut", desc: "Visa hur bättre data leder till bättre inköps- och prissättningsbeslut" },
                  { icon: PieChart, title: "Beräkna ROI på dataplattform", desc: "NPV, BCR, IRR och payback för en plattformsinvestering" },
                  { icon: Gauge, title: "Identifiera dolda kostnader", desc: "Datakvalitet, förändringsledning och intern resursåtgång" },
                  { icon: Target, title: "Tilldela nyttoägare", desc: "Säkerställ att CFO, Inköpschef och Logistikchef äger sina nyttor" },
                  { icon: LineChart, title: "Mäta och följa upp", desc: "KPI:er och milstolpar för att säkerställa faktisk realisering" },
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
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">{"Företag"}</div>
                        <div className="font-semibold">{"Nordvik Industri AB (fiktivt)"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">{"Omsättning"}</div>
                        <div className="font-semibold">{"850 mkr"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">{"Anställda"}</div>
                        <div className="font-semibold">{"420 medarbetare"}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">{"Bransch"}</div>
                        <div className="font-semibold">{"Tillverkning / Industri"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">{"Investering"}</div>
                        <div className="font-semibold">{"Modern dataplattform och beslutsstöd"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">{"Kalkylperiod"}</div>
                        <div className="font-semibold">{"6 år"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="border-t border-border/40 bg-muted/30 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mx-auto max-w-2xl text-center mb-10">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {"12 steg i CVRF-modellen"}
                </h2>
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
