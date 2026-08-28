import { useMemo, useState } from "react";
import { ArrowLeft, Camera, MessageCircle, Phone } from "lucide-react";

import { contact, whatsappLink } from "@/lib/site";
import {
  estimate,
  eur,
  optionsFor,
  stepKeys,
  stepLabels,
  thresholdsFor,
  unitFor,
  type Selection,
  type StepKey,
} from "@/lib/pricing";

type Zone = "bucuresti" | "alta" | null;

const wizardWhatsapp =
  "Bună ziua! Am folosit calculatorul de preț de pe site și aș vrea o confirmare. Trimit poze.";

function Option({
  label,
  onClick,
  hint,
}: {
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border-2 border-border bg-background px-4 py-4 text-left text-base font-semibold text-foreground transition-colors hover:border-primary"
    >
      {label}
      {hint ? <span className="mt-1 block text-sm font-normal text-muted-foreground">{hint}</span> : null}
    </button>
  );
}

function ManualFallback({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border-2 border-border bg-muted/30 p-5">
      <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-base text-muted-foreground">{body}</p>
      <div className="mt-5 flex flex-col gap-3">
        <a
          href="#preevaluare"
          className="flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-bold text-primary-foreground"
        >
          <Camera className="h-5 w-5" aria-hidden />
          Trimite poze pentru o preevaluare
        </a>
        <a
          href={whatsappLink(wizardWhatsapp)}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 items-center justify-center gap-2 rounded-md border-2 border-border px-4 text-base font-semibold text-foreground"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Trimite pozele pe WhatsApp
        </a>
        <a
          href={contact.phoneHref}
          className="flex h-14 items-center justify-center gap-2 rounded-md border-2 border-border px-4 text-base font-semibold text-foreground"
        >
          <Phone className="h-5 w-5" aria-hidden />
          {contact.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

export function PriceWizard() {
  const [zone, setZone] = useState<Zone>(null);
  const [sel, setSel] = useState<Selection>({});
  const [suprafata, setSuprafata] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /** Pașii rămași de completat, calculați din date: se sare peste cei cu o singură variantă. */
  const pending = useMemo(() => {
    const next: { key: StepKey; options: string[] }[] = [];
    const partial: Selection = { ...sel };
    for (const key of stepKeys) {
      if (partial[key]) continue;
      const options = optionsFor(key, partial);
      if (options.length === 0) continue;
      if (options.length === 1) {
        partial[key] = options[0];
        continue;
      }
      next.push({ key, options });
      break;
    }
    return { step: next[0], resolved: partial };
  }, [sel]);

  const unit = unitFor(pending.resolved);
  const thresholds = thresholdsFor(pending.resolved);
  const numericArea = Number.parseFloat(suprafata.replace(",", "."));
  const result =
    submitted && Number.isFinite(numericArea) && numericArea > 0
      ? estimate(pending.resolved, numericArea)
      : null;

  const reset = () => {
    setZone(null);
    setSel({});
    setSuprafata("");
    setSubmitted(false);
  };

  const back = () => {
    setSubmitted(false);
    const filled = stepKeys.filter((k) => sel[k]);
    const last = filled[filled.length - 1];
    if (last) {
      const copy = { ...sel };
      delete copy[last];
      setSel(copy);
      return;
    }
    setZone(null);
  };

  const canGoBack = zone !== null;

  return (
    <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
      {canGoBack ? (
        <button
          type="button"
          onClick={back}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Înapoi
        </button>
      ) : null}

      {zone === null ? (
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Unde e lucrarea?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Lucrăm în București și Ilfov. În rest, evaluăm caz cu caz, pe poze.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Option label="București sau Ilfov" onClick={() => setZone("bucuresti")} />
            <Option label="Altă zonă din țară" onClick={() => setZone("alta")} />
          </div>
        </div>
      ) : zone === "alta" ? (
        <ManualFallback
          title="În afara zonei noastre curente"
          body="Nu avem un preț standard pentru lucrări în afara Bucureștiului și Ilfovului. Trimite-ne poze și îți spunem dacă putem prelua lucrarea și în ce condiții."
        />
      ) : result ? (
        result.kind === "price" ? (
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Estimare orientativă
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {result.row.pretMin === result.row.pretMax
                ? `${eur(result.row.pretMin ?? 0)} €/${unit}`
                : `${eur(result.row.pretMin ?? 0)} – ${eur(result.row.pretMax ?? 0)} €/${unit}`}
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              Total estimat:{" "}
              {result.totalMin === result.totalMax
                ? `${eur(result.totalMin)} €`
                : `${eur(result.totalMin)} – ${eur(result.totalMax)} €`}{" "}
              fără TVA, pentru {result.suprafata} {unit}
            </p>

            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              {stepKeys.map((k) =>
                pending.resolved[k] ? (
                  <div key={k} className="flex gap-2">
                    <dt className="w-40 shrink-0 text-muted-foreground">{stepLabels[k]}</dt>
                    <dd className="font-semibold text-foreground">{pending.resolved[k]}</dd>
                  </div>
                ) : null,
              )}
              <div className="flex gap-2">
                <dt className="w-40 shrink-0 text-muted-foreground">Prag suprafață</dt>
                <dd className="font-semibold text-foreground">
                  {result.row.pragSuprafata} {unit}
                </dd>
              </div>
            </dl>

            {result.outOfRange ? (
              <p className="mt-4 rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
                Suprafața introdusă e în afara pragurilor din tabelul nostru. Am folosit pragul cel
                mai apropiat — cifra reală poate diferi.
              </p>
            ) : null}

            <p className="mt-4 text-sm text-muted-foreground">
              Aceasta este o estimare orientativă, nu o ofertă fermă. Devizul detaliat vine după ce
              ne trimiți pozele.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <a
                href="#preevaluare"
                className="flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-bold text-primary-foreground"
              >
                <Camera className="h-5 w-5" aria-hidden />
                Trimite poze pentru confirmare
              </a>
              <a
                href={whatsappLink(wizardWhatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-md border-2 border-border px-4 text-base font-semibold text-foreground"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Trimite pozele pe WhatsApp
              </a>
              <button
                type="button"
                onClick={reset}
                className="text-sm font-semibold text-muted-foreground underline"
              >
                Începe o estimare nouă
              </button>
            </div>
          </div>
        ) : (
          <ManualFallback
            title="Aici nu avem un preț standard"
            body="Pentru această combinație fiecare caz e diferit — prețul depinde de ce găsim sub finisaj. Trimite-ne poze și îți răspundem personal."
          />
        )
      ) : pending.step ? (
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            {stepLabels[pending.step.key]}
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {pending.step.options.map((opt) => (
              <Option
                key={opt}
                label={opt}
                onClick={() => setSel((prev) => ({ ...pending.resolved, ...prev, [pending.step!.key]: opt }))}
              />
            ))}
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <h2 className="font-display text-xl font-bold text-foreground">
            Ce suprafață are lucrarea?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aproximativ, în {unit}. Praguri de preț: {thresholds.join(" · ")} {unit}.
          </p>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            step="any"
            required
            value={suprafata}
            onChange={(e) => setSuprafata(e.target.value)}
            placeholder={`ex. 35 ${unit}`}
            className="mt-4 h-14 w-full rounded-md border-2 border-border bg-background px-4 text-base text-foreground"
            aria-label={`Suprafață în ${unit}`}
          />
          <button
            type="submit"
            className="mt-4 flex h-14 w-full items-center justify-center rounded-md bg-primary px-4 text-base font-bold text-primary-foreground"
          >
            Vezi estimarea
          </button>
        </form>
      )}
    </div>
  );
}
