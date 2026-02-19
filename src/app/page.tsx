import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-2xl mx-auto text-center px-6 space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Nyttokalkyl
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Beräkna och visualisera nyttan av dina investeringar.
            NPV, BCR, IRR och SROI — allt i ett verktyg.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Logga in</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Skapa konto</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold">12-stegs wizard</h3>
            <p className="text-sm text-muted-foreground">
              Från problembeskrivning till färdig rapport — steg för steg.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Interaktivt nyttoträd</h3>
            <p className="text-sm text-muted-foreground">
              Dra och koppla samband mellan aktiviteter, effekter och nyttor.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Finansiella KPI:er</h3>
            <p className="text-sm text-muted-foreground">
              NPV, BCR, IRR, SROI och payback beräknas automatiskt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
