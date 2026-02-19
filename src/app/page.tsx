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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: Workflow,
    title: "12-stegs wizard",
    description:
      "Guidad process fr\u00e5n problembeskrivning till f\u00e4rdig rapport \u2013 steg f\u00f6r steg med inbyggd kvalitetss\u00e4kring.",
  },
  {
    icon: Network,
    title: "Interaktivt nyttotr\u00e4d",
    description:
      "Visualisera och koppla samband mellan aktiviteter, effekter och nyttor i en dynamisk tr\u00e4dstruktur.",
  },
  {
    icon: TrendingUp,
    title: "Finansiella KPI:er",
    description:
      "NPV, BCR, IRR, SROI och payback ber\u00e4knas automatiskt utifr\u00e5n dina inmatade v\u00e4rden.",
  },
  {
    icon: Shield,
    title: "5 beslutsgrindar",
    description:
      "Strukturerade kontrollpunkter s\u00e4kerst\u00e4ller att r\u00e4tt beslut fattas vid r\u00e4tt tidpunkt i processen.",
  },
];

const phases = [
  {
    icon: Lightbulb,
    label: "F\u00d6RST\u00c5",
    description: "Definiera problem och m\u00e5l",
  },
  {
    icon: Search,
    label: "KARTL\u00c4GGA",
    description: "Identifiera nyttor och kostnader",
  },
  {
    icon: Calculator,
    label: "BER\u00c4KNA",
    description: "Kvantifiera och v\u00e4rdera",
  },
  {
    icon: Rocket,
    label: "REALISERA",
    description: "Genomf\u00f6r och f\u00f6lj upp",
  },
  {
    icon: GraduationCap,
    label: "L\u00c4RA",
    description: "Utv\u00e4rdera och f\u00f6rb\u00e4ttra",
  },
];

const stats = [
  { value: "12", label: "Guidade steg", icon: Workflow },
  { value: "5", label: "Beslutsgrindar", icon: Target },
  { value: "4+", label: "Finansiella KPI:er", icon: BarChart3 },
  { value: "PDF", label: "Exportera rapport", icon: FileDown },
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
              <Link href="/login">Logga in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">
                Kom ig\u00e5ng
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
            Kostnadsnyttoanalys f\u00f6r offentlig sektor
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Fr\u00e5n id\u00e9 till{" "}
            <span className="text-primary">evidensbaserat beslut</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            CVRF Nyttokalkyl guidar dig genom hela nyttorealiseringsprocessen
            {" \u2013 "}fr\u00e5n f\u00f6rsta problembeskrivningen till en komplett rapport
            med NPV, BCR, IRR och SROI.
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
            Ingen kreditkortsuppgift kr\u00e4vs. Kom ig\u00e5ng p\u00e5 n\u00e5gra minuter.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/40 bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Allt du beh\u00f6ver f\u00f6r en komplett nyttokalkyl
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ett strukturerat ramverk som s\u00e4kerst\u00e4ller kvalitet i varje steg
              av analysen.
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
              Fem faser f\u00f6r lyckad nyttorealisering
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              CVRF-modellen bygger p\u00e5 en bepr\u00f6vad metodik i fem faser som
              s\u00e4kerst\u00e4ller att nyttan verkligen realiseras.
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
              Byggt f\u00f6r professionella nyttokalkyler
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Allt \u00e4r samlat i ett och samma verktyg {"\u2013"} ingen mer
              kalkylbladskaos.
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
                {[
                  "NPV, BCR, IRR och SROI i realtid",
                  "Intressenthantering och nyttoregister",
                  "Exportera till PDF med ett klick",
                  "Frist\u00e5ende kalkyler eller kopplade till projekt",
                  "K\u00e4nslighetsanalys och scenarioplanering",
                  "Automatisk uppf\u00f6ljning mot effektm\u00e5l",
                ].map((text) => (
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
              F\u00f6r alla som arbetar med nyttorealisering
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Oavsett om du \u00e4r projektledare, controller eller IT-strateg {"\u2013"}{" "}
              CVRF Nyttokalkyl ger dig r\u00e4tt verktyg.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Projektledare",
                text: "F\u00e5 en tydlig bild av f\u00f6rv\u00e4ntade nyttor och kostnader innan projektet startar \u2013 och f\u00f6lj upp under hela livscykeln.",
              },
              {
                icon: BarChart3,
                title: "Ekonomer och controllers",
                text: "Professionella finansiella nyckeltal ber\u00e4knade enligt vedertagen metodik. Exportera snygga rapporter till beslutsfattare.",
              },
              {
                icon: Target,
                title: "Beslutsfattare",
                text: "F\u00e5 ett strukturerat beslutsunderlag med tydliga effektm\u00e5l, beslutsgrindar och nyttoregister.",
              },
            ].map((item) => (
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

      {/* Final CTA */}
      <section className="border-t border-border/40 bg-primary/5">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Redo att skapa din f\u00f6rsta nyttokalkyl?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            B\u00f6rja anv\u00e4nda CVRF Nyttokalkyl idag och ta kontroll \u00f6ver
            nyttorealiseringen i dina projekt.
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
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
              C
            </div>
            <span className="text-sm font-medium">CVRF Nyttokalkyl</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CVRF Nyttokalkyl. Alla
            r\u00e4ttigheter f\u00f6rbeh\u00e5llna.
          </p>
        </div>
      </footer>
    </div>
  );
}
