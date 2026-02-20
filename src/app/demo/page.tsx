import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  ArrowLeft,
  ArrowRight,
  Presentation,
  Building2,
  Lock,
  Factory,
  BrainCircuit,
  Users,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Lightbulb,
  Target,
  MessageSquare,
  Workflow,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const demos = [
  {
    slug: "/demo-hemtjanst",
    icon: Lock,
    badge: "Kommun & hemtjänst",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    title: "Nyckelfri hemtjänst",
    subtitle: "Eksunda kommun (fiktiv)",
    description: "Införande av digitala lås i hemtjänsten för en medelstor svensk kommun med 45 000 invånare och 1 200 brukare.",
    stats: [
      { label: "NPV", value: "2 847 tkr" },
      { label: "BCR", value: "1,37" },
      { label: "Payback", value: "3,8 år" },
    ],
    highlights: [
      "Välfärdsteknologi enligt SKR:s riktlinjer",
      "Intressentanalys: brukare, personal, fastighetsägare",
      "Känslighetsanalys med tornadodiagram",
    ],
  },
  {
    slug: "/demo-dataplattform",
    icon: BrainCircuit,
    badge: "Tillverkningsindustri",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    title: "Dataplattform & Beslutsstöd",
    subtitle: "Nordvik Industri AB (fiktivt)",
    description: "Investering i modern dataplattform för ett tillverkningsföretag med 850 mkr i omsättning och 420 anställda.",
    stats: [
      { label: "NPV", value: "62 840 tkr" },
      { label: "BCR", value: "4,55" },
      { label: "Payback", value: "1,3 år" },
    ],
    highlights: [
      "Konkretiserar 'datadrivet' till kronor och ören",
      "Dolda kostnader: datakvalitet, förändringsledning",
      "Nyttoägare i ledningsgruppen med KPI:er",
    ],
  },
];

const modelFeatures = [
  {
    icon: Workflow,
    title: "12 steg i 5 faser",
    description: "Från behovsanalys och mål till effektmätning och lärdomar – en komplett struktur för nyttorealisering.",
  },
  {
    icon: TrendingUp,
    title: "Finansiella nyckeltal",
    description: "Nuvärde (NPV), nyttokostnadskvot (BCR), internränta (IRR), social avkastning (SROI) och payback-tid beräknas automatiskt.",
  },
  {
    icon: BarChart3,
    title: "Känslighetsanalys",
    description: "Testa kalkylens robusthet med scenarioanalys och tornadodiagram. Identifiera vilka antaganden som påverkar mest.",
  },
  {
    icon: Target,
    title: "Nyttoägare & KPI:er",
    description: "Varje nytta tilldelas en ansvarig ägare med definierade mätetal och uppföljningsfrekvens.",
  },
  {
    icon: Users,
    title: "Intressentanalys",
    description: "Kartlägg alla som påverkas, bedöm påverkan och intresse, och planera engagemang för varje grupp.",
  },
  {
    icon: MessageSquare,
    title: "Workshop-format",
    description: "Varje steg inkluderar nyckelinsikter och diskussionsfrågor – perfekt för att skapa samsyn i grupp.",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function DemoHubPage() {
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
          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-1 h-4 w-4" />
                {"Tillbaka"}
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

        <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 text-center sm:pt-24 sm:pb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Presentation className="h-4 w-4" />
            {"Workshop & Interaktiva demos"}
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {"Lär dig nyttokalkyl "}
            <span className="text-primary">genom riktiga exempel</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {"Välj ett scenario nedan och följ alla 12 steg i CVRF-modellen med realistisk data, finansiella beräkningar och diskussionsfrågor. Perfekt som underlag i workshops eller för att förstå hur en komplett nyttokalkyl byggs upp."}
          </p>
        </div>
      </section>

      {/* Demo cards */}
      <section className="border-t border-border/40 bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"Välj scenario"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"Två kompletta genomgångar med realistiska data – från välfärdsteknik till dataplattformar."}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {demos.map((demo) => (
              <Card key={demo.slug} className="border-border/50 bg-card overflow-hidden hover:shadow-lg transition-shadow group">
                <CardContent className="pt-6 pb-6 space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-2 ring-primary/20">
                      <demo.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge className={demo.badgeColor}>{demo.badge}</Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-bold">{demo.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{demo.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {demo.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {demo.stats.map((stat) => (
                      <div key={stat.label} className="rounded-lg bg-primary/5 p-3 text-center">
                        <div className="text-lg font-bold text-primary">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5">
                    {demo.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button asChild size="lg" className="w-full">
                    <Link href={demo.slug}>
                      {"Starta genomgången"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Om CVRF-modellen */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Lightbulb className="h-4 w-4" />
              {"Om modellen"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"CVRF-modellen i varje demo"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"Båda scenarierna följer samma 12-stegsstruktur. Här ser du vad varje demo innehåller."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modelFeatures.map((f) => (
              <Card key={f.title} className="border-border/50 bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md">
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop-tips */}
      <section className="border-t border-border/40 bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {"Tips för workshopledare"}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Projicera på storskärm", text: "Använd presentationsläget i CVRF och gå igenom stegen tillsammans. Varje steg tar 5–10 minuter." },
              { title: "Diskutera efter varje steg", text: "Varje steg har en diskussionsfråga. Låt deltagarna reflektera över hur det relaterar till deras egen organisation." },
              { title: "Jämför scenarierna", text: "Kör båda scenarierna och diskutera skillnader i nyttor, kostnadsstrukturer och intressenter mellan olika typer av organisationer." },
              { title: "Avsluta med egen kalkyl", text: "Efter genomgången kan deltagarna logga in och skapa en egen kalkyl baserad på ett verkligt projekt." },
            ].map((tip) => (
              <Card key={tip.title} className="border-border/50 bg-card/80">
                <CardContent className="pt-5 pb-5 space-y-2">
                  <h3 className="font-semibold text-sm">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-primary/5">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {"Redo att skapa en egen nyttokalkyl?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {"Skapa ett konto och bygg din första kalkyl baserad på ett verkligt projekt i din organisation."}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 text-base">
              <Link href="/register">
                {"Skapa konto kostnadsfritt"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 text-base">
              <Link href="/om">{"Läs mer om metodik"}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background">
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
            {"© "}{new Date().getFullYear()}{" CVRF Nyttokalkyl. Alla rättigheter förbehållna."}
          </p>
        </div>
      </footer>
    </div>
  );
}
