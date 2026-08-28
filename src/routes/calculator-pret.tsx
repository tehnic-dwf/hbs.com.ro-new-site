import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import { PriceWizard } from "@/components/PriceWizard";
import { PreevaluareForm } from "@/components/PreevaluareForm";

const title = "Calculator de preț hidroizolații — HBS București";
const description =
  "Estimare orientativă de preț pentru hidroizolații terase, balcoane, fundații, pardoseli epoxidice și covoare de marmură. Câțiva pași, un interval de preț, apoi confirmare pe poze.";

export const Route = createFileRoute("/calculator-pret")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  const [showPhotosForm, setShowPhotosForm] = useState(false);
  const [wizardSummary, setWizardSummary] = useState("");

  const handleOutput = useCallback((hasOutput: boolean, summary?: string) => {
    setShowPhotosForm(hasOutput);
    setWizardSummary(summary ?? "");
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold leading-tight text-foreground">
        Calculator de preț
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Răspunzi la câteva întrebări despre lucrare și vezi imediat un interval de preț din tabelul
        nostru intern. E o estimare orientativă — devizul final îl primești după ce ne trimiți poze.
      </p>

      <div className="mt-6">
        <PriceWizard onOutputChange={handleOutput} />
      </div>

      {showPhotosForm ? (
        <section id="preevaluare" className="mt-12 scroll-mt-20">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Trimite poze pentru confirmare
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Am reținut deja răspunsurile din calculator. Mai avem nevoie doar de datele tale de
            contact și de 3–4 poze cu lucrarea.
          </p>
          <div className="mt-5">
            <PreevaluareForm
              contextLabel="Calculator de preț"
              prefillSummary={wizardSummary || undefined}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
