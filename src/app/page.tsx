import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Workflow,
  Network,
  TrendingUp,
  Shield,
  BarChart3,
  FileDown,
  Users,
  Target,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Search,
  Calculator,
  Rocket,
  GraduationCap,
  Landmark,
  Building2,
  ClipboardCheck,
  HeartHandshake,
  Presentation,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: Workflow,
    title: "12-stegs wizard",
    description:
      "Guidad process från problembeskrivning till färdig rapport – steg för steg med inbyggd kvalitetssäkring.",
  },
  {
    icon: Network,
    title: "Interaktivt nyttoträd",
    description:
      "Visualisera och koppla samband mellan aktiviteter, effekter och nyttor i en dynamisk trädstruktur.",
  },
  {
    icon: TrendingUp,
    title: "Finansiella nyckeltal",
    description:
      "Nuvärde (NPV), nyttokostnadskvot (BCR), internränta (IRR), social avkastning (SROI) och payback-tid beräknas automatiskt.",
  },
  {
    icon: Shield,
    title: "5 beslutsgrindar",
    description:
      "Strukturerade kontrollpunkter säkerställer att rätt beslut fattas vid rätt tidpunkt i processen.",
  },
];

const phases = [
  {
    icon: Lightbulb,
    label: "FÖRSTÅ",
    description: "Definiera problem och mål",
  },
  {
    icon: Search,
    label: "KARTLÄGGA",
    description: "Identifiera nyttor och kostnader",
  },
  {
    icon: Calculator,
    label: "BERÄKNA",
    description: "Kvantifiera och värdera",
  },
  {
    icon: Rocket,
    label: "REALISERA",
    description: "Genomför och följ upp",
  },
  {
    icon: GraduationCap,
    label: "LÄRA",
    description: "Utvärdera och förbättra",
  },
];

const stats = [
  { value: "12", label: "Guidade steg", icon: Workflow },
  { value: "5", label: "Beslutsgrindar", icon: Target },
  { value: "4+", label: "Finansiella nyckeltal", icon: BarChart3 },
  { value: "PDF", label: "Exportera rapport", icon: FileDown },
];

const highlights = [
  "Nuvärde, nyttokostnadskvot, internränta och social avkastning i realtid",
  "Intressenthantering och nyttoregister",
  "Exportera till PDF med ett klick",
  "Fristående kalkyler eller kopplade till projekt",
  "Känslighetsanalys och scenarioplanering",
  "Automatisk uppföljning mot effektmål",
];

const audiences = [
  {
    icon: Users,
    title: "Projektledare & programledare",
    text: "Få en tydlig bild av förväntade nyttor och kostnader innan projektet startar – och följ upp under hela livscykeln.",
  },
  {
    icon: BarChart3,
    title: "Business analysts & controllers",
    text: "Professionella finansiella nyckeltal beräknade enligt vedertagen metodik. Exportera snygga rapporter till beslutsfattare.",
  },
  {
    icon: Target,
    title: "CIO:er & beslutsfattare",
    text: "Få ett strukturerat beslutsunderlag med tydliga effektmål, beslutsgrindar och nyttoregister – oavsett om det gäller IT, AI eller verksamhetsutveckling.",
  },
];

const frameworks = [
  {
    icon: Landmark,
    title: "ESV:s riktlinjer",
    description:
      "Samhällsekonomisk analys enligt Ekonomistyrningsverkets etablerade metodik – beprövad grund som fungerar i alla sektorer.",
  },
  {
    icon: Building2,
    title: "Ineras nyttokalkylmodell",
    description:
      "Kompatibel med Ineras 9-stegsmodell och nyttorealiseringsprocess för e-hälsa och välfärdsteknik.",
  },
  {
    icon: HeartHandshake,
    title: "SKR:s ramverk",
    description:
      "Stödjer SKR:s ramverk för välfärdsteknik och digital transformation i kommuner och regioner.",
  },
  {
    icon: ClipboardCheck,
    title: "PRINCE2/MSP-baserad",
    description:
      "Nyttorealisering strukturerad efter PRINCE2 och Managing Successful Programmes (MSP) med beslutsgrindar.",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation bar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              CVRF Nyttokalkyl
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/om">Om</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/demo">Se exempelanalyser</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Logga in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">
                {"Kom igång"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/3 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center sm:pt-28 sm:pb-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <BarChart3 className="h-4 w-4" />
            {"Nyttokalkyl & nyttorealisering"}
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {"Navigera frågan om "}
            <span className="text-primary">nytta och värde</span>
            {" av digitala investeringar"}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {"I en tid där investeringar i IT, AI och digital transformation accelererar behöver organisationer kunna svara på den avgörande frågan: Vad är den faktiska nyttan? CVRF Nyttokalkyl guidar dig hela vägen – från problembeskrivning till evidensbaserat beslut med nuvärde, nyttokostnadskvot och internränta."}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 text-base">
              <Link href="/login">
                Logga in
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 text-base"
            >
              <Link href="/register">Skapa konto kostnadsfritt</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {"Ingen kreditkortsuppgift krävs. Kom igång på några minuter."}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/40 bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"Allt du behöver för en komplett nyttokalkyl"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"Ett strukturerat ramverk som säkerställer kvalitet i varje steg av analysen."}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card
                key={f.title}
                className="border-border/50 bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process / How it works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"Fem faser för lyckad nyttorealisering"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"CVRF-modellen bygger på en beprövad metodik i fem faser som säkerställer att nyttan verkligen realiseras."}
            </p>
          </div>

          {/* Desktop: horizontal flow */}
          <div className="mt-14 hidden lg:flex items-start justify-between gap-4">
            {phases.map((phase, i) => (
              <div key={phase.label} className="flex items-start">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20">
                    <phase.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="mt-4 text-sm font-bold tracking-wider text-primary">
                    {phase.label}
                  </div>
                  <p className="mt-1 max-w-[140px] text-sm text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
                {i < phases.length - 1 && (
                  <div className="mt-7 flex items-center px-2">
                    <div className="h-px w-8 bg-border" />
                    <ChevronRight className="h-4 w-4 shrink-0 text-primary/50" />
                    <div className="h-px w-8 bg-border" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile / Tablet: vertical flow */}
          <div className="mt-14 flex flex-col gap-6 lg:hidden">
            {phases.map((phase, i) => (
              <div key={phase.label} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-2 ring-primary/20">
                    <phase.icon className="h-6 w-6 text-primary" />
                  </div>
                  {i < phases.length - 1 && (
                    <div className="mt-2 h-8 w-px bg-border" />
                  )}
                </div>
                <div className="pt-1">
                  <div className="text-sm font-bold tracking-wider text-primary">
                    {phase.label}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Social proof */}
      <section className="border-t border-border/40 bg-primary/5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"Byggt för professionella nyttokalkyler"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"Allt är samlat i ett och samma verktyg – ingen mer kalkylbladskaos."}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <Card
                key={s.label}
                className="border-border/50 bg-card text-center"
              >
                <CardContent className="flex flex-col items-center gap-3 pt-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {s.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Extra highlights */}
          <div className="mx-auto mt-12 max-w-3xl">
            <Card className="border-primary/20 bg-card">
              <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                {highlights.map((text) => (
                  <div key={text} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"För alla som fattar beslut om digitala investeringar"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"Oavsett om du är projektledare, business analyst, controller, CIO eller verksamhetsutvecklare – CVRF Nyttokalkyl ger dig ett strukturerat ramverk för att kvantifiera och realisera nytta."}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {audiences.map((item) => (
              <Card
                key={item.title}
                className="border-border/50 bg-card/80 transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bygger på svensk offentlig metodik */}
      <section className="border-t border-border/40 bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Landmark className="h-4 w-4" />
              {"Förankrad i etablerade ramverk"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"Bygger på etablerade ramverk"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"CVRF Nyttokalkyl är utformat utifrån vedertagna ramverk och metoder för nyttorealisering och samhällsekonomisk analys – och fungerar lika bra i privat sektor som i offentlig."}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {frameworks.map((fw) => (
              <Card
                key={fw.title}
                className="border-border/50 bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <fw.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{fw.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {fw.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
  {"Modellen har sina rötter i offentlig sektors beprövade metodik, men är designad för att vara universell. CVRF Nyttokalkyl hjälper alla organisationer att kvantifiera nyttan av digitala satsningar – med både monetära och icke-monetära effekter."}
            </p>
          </div>
        </div>
      </section>

      {/* Workshop & Demo teaser */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <Card className="border-primary/20 bg-primary/5 overflow-hidden">
            <CardContent className="flex flex-col items-center gap-6 pt-8 pb-8 text-center sm:pt-10 sm:pb-10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20">
                <Presentation className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {"Workshop och interaktiv demo"}
                </h2>
                <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed">
                  {"Vill din organisation skapa samsyn kring nyttorealisering? Använd CVRF Nyttokalkyl som underlag i workshops – bygg nyttokalkyler interaktivt tillsammans med intressenter och skapa ett gemensamt beslutsunderlag."}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="px-8 text-base">
                  <Link href="/demo">
                    {"Utforska workshop-läget"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 text-base">
                  <Link href="/om">{"Läs mer om metodik"}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/40 bg-primary/5">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {"Redo att skapa din första nyttokalkyl?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {"Börja använda CVRF Nyttokalkyl idag och ta kontroll över nyttorealiseringen i dina projekt."}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 text-base">
              <Link href="/register">
                Skapa konto kostnadsfritt
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 text-base"
            >
              <Link href="/login">Logga in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
                C
              </div>
              <span className="text-sm font-medium">CVRF Nyttokalkyl</span>
            </div>
            <Link href="/om" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Om
            </Link>
            <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Exempelanalyser
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            {"© "}{new Date().getFullYear()}{" CVRF Nyttokalkyl. Alla rättigheter förbehållna."}
          </p>
        </div>
      </footer>
    </div>
  );
}
