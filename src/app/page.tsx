import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Workflow, Network, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "12-stegs wizard",
    description:
      "Fran problembeskrivning till fardig rapport -- steg for steg.",
  },
  {
    icon: Network,
    title: "Interaktivt nyttotrad",
    description:
      "Dra och koppla samband mellan aktiviteter, effekter och nyttor.",
  },
  {
    icon: TrendingUp,
    title: "Finansiella KPI:er",
    description:
      "NPV, BCR, IRR, SROI och payback beraknas automatiskt.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-3xl mx-auto text-center px-6 space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            CVRF Nyttokalkyl
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Berakna nyttan av dina investeringar
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            NPV, BCR, IRR och SROI -- allt i ett verktyg.
            Fran ide till beslut med strukturerad nyttoanalys.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="px-8">
            <Link href="/login">Logga in</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link href="/register">Skapa konto</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-left border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6 space-y-3">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
