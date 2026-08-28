import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold leading-tight text-foreground">
        Calculator de preț
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Răspunzi la câteva întrebări despre lucrare și vezi imediat un interval de preț din tabelul
        nostru intern. E o estimare orientativă — devizul final îl primești după ce ne trimiți poze.
      </p>

      <div className="mt-6" id="preevaluare">
        <PriceWizard
          renderFollowUp={(summary) => (
            <PreevaluareForm
              contextLabel="Calculator de preț"
              prefillSummary={summary || "Estimare din calculator"}
            />
          )}
        />
      </div>
    </main>
  );
}
