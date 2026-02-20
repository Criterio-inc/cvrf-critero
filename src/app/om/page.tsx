import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  BookOpen,
  Shield,
  Building2,
  Landmark,
  ClipboardCheck,
  BookMarked,
  Award,
  GraduationCap,
  Lock,
  Server,
  Globe,
  UserCheck,
  Trash2,
  Mail,
  Cookie,
  Scale,
  ArrowLeft,
  ExternalLink,
  ArrowRight,
  ArrowRightLeft,
  CheckCircle2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const knowledgeSources = [
  {
    icon: Landmark,
    title: "Ekonomistyrningsverket (ESV)",
    description:
      "CVRF bygger på ESV:s riktlinjer och metodik för samhällsekonomiska analyser och kostnadsnyttokalkyler – en beprövad grund som ursprungligen utvecklats för offentlig sektor men som är lika relevant för alla organisationer.",
    link: "https://www.esv.se",
  },
  {
    icon: ClipboardCheck,
    title: "PRINCE2 & MSP",
    description:
      "Ramverkets struktur med beslutsgrindar och fasindelning inspireras av PRINCE2 och Managing Successful Programmes (MSP) inom nyttorealisering.",
    link: null,
  },
  {
    icon: BookMarked,
    title: "HM Treasury Green Book",
    description:
      "Den brittiska statens Green Book-metodik har bidragit med principer kring diskontering, nuvärdesberäkning och värdering av icke-monetära nyttor.",
    link: "https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government",
  },
  {
    icon: Award,
    title: "Benefits Realisation Management",
    description:
      "Etablerad BRM-metodik (Benefits Realisation Management) ligger till grund för nyttoregistret, intressenthanteringen och uppföljningsprocessen.",
    link: null,
  },
  {
    icon: GraduationCap,
    title: "Akademisk forskning",
    description:
      "CVRF integrerar forskningsbaserade metoder inom samhällsekonomi, beteendeekonomi och programteori för att säkerställa vetenskaplig förankring.",
    link: null,
  },
];

const gdprItems = [
  {
    icon: Lock,
    title: "Datakryptering",
    description:
      "All data krypteras med TLS vid överföring och AES-256 vid lagring. Dina kalkyler och underlag skyddas enligt branschstandard.",
  },
  {
    icon: Server,
    title: "Datalagring inom EU",
    description:
      "All data lagras på servrar inom EU/EES i enlighet med GDPR. Ingen data överförs till tredjeland utan adekvat skyddsnivå.",
  },
  {
    icon: Globe,
    title: "Inga tredjepartsspårare",
    description:
      "Vi använder inga reklamspårare eller tredjepartsanalysverktyg som delar din data. Din integritet är inte en handelsvara.",
  },
  {
    icon: UserCheck,
    title: "Dina rättigheter",
    description:
      "Du har rätt att begära registerutdrag, rättelse och radering av dina personuppgifter. Kontakta oss så hjälper vi dig inom 30 dagar.",
  },
  {
    icon: Trash2,
    title: "Radering av data",
    description:
      "Du kan när som helst radera enskilda kalkyler eller hela ditt konto. Vid kontoradering tas all din data bort permanent inom 30 dagar.",
  },
  {
    icon: Cookie,
    title: "Cookies",
    description:
      "Vi använder endast nödvändiga funktionscookies för inloggning och sessionhantering. Inga marknadsföringscookies.",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function OmPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation bar */}
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
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pt-24 sm:pb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />
            {"Om CVRF Nyttokalkyl"}
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {"Byggt på "}
            <span className="text-primary">beprövad metodik</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {"CVRF Nyttokalkyl är utvecklat med utgångspunkt i etablerade ramverk och kunskapskällor inom samhällsekonomi och nyttorealisering. Här kan du läsa om våra kunskapskällor, hur vi hanterar din data och om företaget bakom verktyget."}
          </p>
        </div>
      </section>

      {/* Kunskapskällor */}
      <section className="border-t border-border/40 bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"Kunskapskällor och metodik"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"CVRF-ramverket bygger på en kombination av etablerade kunskapskällor och beprövade metoder inom samhällsekonomi och nyttorealisering."}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {knowledgeSources.map((source) => (
              <Card
                key={source.title}
                className="border-border/50 bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <source.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{source.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {source.description}
                  </p>
                  {source.link && (
                    <a
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {"Läs mer"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Metodikjämförelse */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <ArrowRightLeft className="h-4 w-4" />
              {"Kompatibel metodik"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"Så förhåller sig CVRF till andra ramverk"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"CVRF:s 12-stegsmodell är designad för att vara kompatibel med etablerade svenska ramverk. Här ser du hur stegen mappas mot Ineras och ESV:s metodik."}
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {/* Inera mapping */}
            <Card className="border-border/50 bg-card/80">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{"Ineras 9-stegsmodell"}</h3>
                    <p className="text-sm text-muted-foreground">{"Fas 1–3 i Ineras nyttokalkylprocess"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { inera: "1. Avgränsa och definiera", cvrf: "Steg 1–2: Behovsanalys & Strategisk koppling" },
                    { inera: "2. Kartlägg intressenter", cvrf: "Steg 3: Intressentanalys" },
                    { inera: "3. Identifiera nyttor", cvrf: "Steg 5: Nyttoträd" },
                    { inera: "4. Identifiera kostnader", cvrf: "Steg 4 & 6: Nollalternativ & Kostnader" },
                    { inera: "5. Värdera nyttor", cvrf: "Steg 7: Nyttor & Värden" },
                    { inera: "6. Värdera kostnader", cvrf: "Steg 7: Nyttor & Värden" },
                    { inera: "7. Beräkna nyttokalkyl", cvrf: "Steg 8: Kalkyl & Känslighet" },
                    { inera: "8. Analysera resultat", cvrf: "Steg 8: Kalkyl & Känslighet" },
                    { inera: "9. Presentera och besluta", cvrf: "Steg 12: Lärdomar & Rapport" },
                  ].map((row) => (
                    <div key={row.inera} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">{row.inera}</span>
                        <span className="text-muted-foreground">{" → "}{row.cvrf}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ESV mapping */}
            <Card className="border-border/50 bg-card/80">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{"ESV:s samhällsekonomiska analys"}</h3>
                    <p className="text-sm text-muted-foreground">{"Ekonomistyrningsverkets ramverk"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { esv: "Problemformulering", cvrf: "Steg 1: Behovsanalys & Mål" },
                    { esv: "Alternativanalys", cvrf: "Steg 2: Strategisk koppling" },
                    { esv: "Identifiera effekter", cvrf: "Steg 3–5: Intressenter, Nollalternativ, Nyttoträd" },
                    { esv: "Kvantifiera effekter", cvrf: "Steg 6–7: Kostnader, Nyttor & Värden" },
                    { esv: "Värdera i monetära termer", cvrf: "Steg 7: Nyttor & Värden (monetär värdering)" },
                    { esv: "Diskontera till nuvärde", cvrf: "Steg 8: Kalkyl & Känslighet (NPV, BCR, IRR)" },
                    { esv: "Känslighetsanalys", cvrf: "Steg 8: Kalkyl & Känslighet" },
                    { esv: "Rekommendation/beslut", cvrf: "Steg 9–10: Realiseringsplan & Uppföljning" },
                    { esv: "Uppföljning", cvrf: "Steg 11–12: Effektmätning & Lärdomar" },
                  ].map((row) => (
                    <div key={row.esv} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">{row.esv}</span>
                        <span className="text-muted-foreground">{" → "}{row.cvrf}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 mx-auto max-w-3xl text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {"CVRF:s 12 steg inkluderar dessutom nyttorealisering (steg 9–10) och uppföljning (steg 11–12) som går utöver traditionella kalkyler – detta säkerställer att nyttan inte bara beräknas utan faktiskt realiseras."}
            </p>
          </div>
        </div>
      </section>

      {/* GDPR & Datahantering */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              {"Dataskydd och integritet"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"GDPR och datahantering"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {"Din data tillhör dig. Vi följer GDPR och hanterar personuppgifter med högsta möjliga skyddsnivå."}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gdprItems.map((item) => (
              <Card
                key={item.title}
                className="border-border/50 bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 mx-auto max-w-2xl">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-start gap-4 pt-6">
                <Scale className="h-6 w-6 shrink-0 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">{"Rättslig grund"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {"Behandling av personuppgifter sker med stöd av avtal (Art. 6.1b GDPR) när du skapar ett konto och använder tjänsten. Vi behandlar aldrig mer data än vad som krävs för att tillhandahålla tjänsten."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Critero */}
      <section className="border-t border-border/40 bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Building2 className="h-4 w-4" />
              {"Företaget bakom"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {"Critero"}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {"CVRF Nyttokalkyl utvecklas och underhålls av Critero Consulting AB (Critero) – ett svenskt konsultbolag specialiserat på nyttorealisering, verksamhetsutveckling och digital transformation. Modellen har sin grund i offentlig sektors beprövade metodik men är designad för att fungera i alla typer av organisationer."}
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Card className="border-border/50 bg-card/80">
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-lg">{"Vår mission"}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {"Vi vill göra det enklare för organisationer att fatta evidensbaserade beslut genom att tillhandahålla professionella verktyg för nyttorealisering och samhällsekonomisk analys."}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/80">
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-lg">{"Kontakta oss"}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>Critero Consulting AB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href="mailto:kontakt@criteroconsulting.se" className="text-primary hover:underline">
                      kontakt@criteroconsulting.se
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <a href="https://criteroconsulting.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      criteroconsulting.se
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              {"Personuppgiftsansvarig: Critero Consulting AB. För frågor om personuppgiftsbehandling, kontakta oss på "}
              <a href="mailto:kontakt@criteroconsulting.se" className="text-primary hover:underline">kontakt@criteroconsulting.se</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-primary/5">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {"Redo att komma igång?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {"Skapa ett konto och börja bygga din första nyttokalkyl idag."}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 text-base">
              <Link href="/register">
                {"Skapa konto kostnadsfritt"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 text-base">
              <Link href="/login">{"Logga in"}</Link>
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
