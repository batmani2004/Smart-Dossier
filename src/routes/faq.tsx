import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HelpCircle, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CITIZEN_FAQ } from "@/lib/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Pyetje te shpeshta - Smart Dossier" },
      {
        name: "description",
        content: "Pyetje te shpeshta per qytetaret ne Smart Dossier.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [search, setSearch] = useState("");

  const filteredFaq = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CITIZEN_FAQ;
    return CITIZEN_FAQ.filter((item) =>
      [item.category, item.question, item.answer, item.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [search]);

  const categories = useMemo(
    () => Array.from(new Set(CITIZEN_FAQ.map((item) => item.category))),
    [],
  );

  return (
    <AppShell>
      <div className="max-w-6xl space-y-4 p-4 md:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="size-3.5" />
              Rubrike qytetare
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
              Pyetje te shpeshta
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Pyetje te shpeshta per Smart Dossier, shpronesimin per interes publik, privatizimin e
              banesave, dokumentet, pagesat dhe gjurmimin publik.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="rounded-md">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Search className="size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Kerko te pyetjet e shpeshta..."
                className="h-9 border-0 bg-muted/40 focus-visible:ring-1"
              />
            </div>

            <Accordion type="multiple" className="mt-2">
              {filteredFaq.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="gap-3 py-3">
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block text-sm font-semibold">{item.question}</span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        {item.category}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaq.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Nuk u gjet pyetje me kete kerkese.
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
