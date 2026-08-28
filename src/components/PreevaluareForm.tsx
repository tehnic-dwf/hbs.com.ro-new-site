import { Camera, Check, ChevronLeft, MessageCircle } from "lucide-react";
import { useState } from "react";

import { contact, whatsappLink } from "@/lib/site";

/**
 * Formular progresiv în 3 pași: Situația → Context → Contact.
 * Site static (GitHub Pages), deci trimiterea merge către un serviciu extern.
 * Până la configurarea cheii Web3Forms, pasul final deschide WhatsApp cu
 * răspunsurile precompletate — canalul real de vânzare al HBS.
 */
const WEB3FORMS_ACCESS_KEY = "";

const situatii = [
  "Pete de umezeală pe tavan sau pe perete",
  "Gresia se ridică sau sună a gol",
  "Apă pe terasă după ploaie",
  "S-a mai reparat și a reapărut",
  "Altceva / nu știu exact",
];

const suprafete = ["Sub 15 mp", "15–30 mp", "30–60 mp", "Peste 60 mp", "Nu știu"];

const istoric = [
  "Nu s-a intervenit niciodată",
  "S-a intervenit o dată",
  "S-a intervenit de mai multe ori",
  "Nu știu",
];

function OptionList({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`flex min-h-12 items-center justify-between rounded-md border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
              selected
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-background text-foreground"
            }`}
            data-field={name}
          >
            {option}
            {selected ? <Check className="ml-3 h-4 w-4 shrink-0 text-primary" aria-hidden /> : null}
          </button>
        );
      })}
    </div>
  );
}

export function PreevaluareForm({
  contextLabel,
  prefillSummary,
  bare = false,
}: {
  contextLabel: string;
  /** Când e prezent (ex. după calculator), sărim peste întrebările deja răspunse. */
  prefillSummary?: string | undefined;
  /** Când e true, randează fără card propriu — pentru uz în interiorul altui card. */
  bare?: boolean;
}) {
  const contactOnly = Boolean(prefillSummary);
  const [step, setStep] = useState(contactOnly ? 2 : 0);
  const [simptom, setSimptom] = useState("");
  const [suprafata, setSuprafata] = useState("");
  const [interventii, setInterventii] = useState("");
  const [nume, setNume] = useState("");
  const [telefon, setTelefon] = useState("");
  const [eroare, setEroare] = useState("");
  const [trimis, setTrimis] = useState(false);
  const [seTrimite, setSeTrimite] = useState(false);

  const rezumat = (
    contactOnly
      ? [`Preevaluare ${contextLabel}`, prefillSummary ?? "", `Nume: ${nume || "-"}`, `Telefon: ${telefon || "-"}`]
      : [
          `Preevaluare ${contextLabel}`,
          `Simptom: ${simptom || "-"}`,
          `Suprafață: ${suprafata || "-"}`,
          `Intervenții anterioare: ${interventii || "-"}`,
          `Nume: ${nume || "-"}`,
          `Telefon: ${telefon || "-"}`,
        ]
  )
    .filter(Boolean)
    .join("\n");

  async function trimite() {
    if (!nume.trim() || telefon.replace(/\D/g, "").length < 9) {
      setEroare("Avem nevoie de nume și de un număr de telefon valid ca să îți răspundem.");
      return;
    }
    setEroare("");
    setSeTrimite(true);

    if (WEB3FORMS_ACCESS_KEY) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `Preevaluare HBS – ${contextLabel}`,
            message: rezumat,
          }),
        });
      } catch {
        /* trecem oricum la WhatsApp — nu pierdem lead-ul */
      }
    }

    setSeTrimite(false);
    setTrimis(true);
  }

  if (trimis) {
    return (
      <div className="rounded-lg border-2 border-primary bg-accent p-5">
        <h3 className="font-display text-xl font-bold text-foreground">
          Am notat. Mai lipsesc pozele.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          Din poze putem confirma tipul de intervenție fără să venim pe teren. Trimite 3–4 poze:
          zona cu problema, o poză de ansamblu și una de aproape pe rosturi sau pe scurgere.
        </p>
        <a
          href={whatsappLink(`${rezumat}\n\nTrimit pozele acum.`)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex h-14 items-center justify-center gap-2 rounded-md bg-primary text-base font-bold text-primary-foreground"
        >
          <Camera className="h-5 w-5" aria-hidden />
          Trimite pozele pe WhatsApp
        </a>
        <p className="mt-3 text-xs text-muted-foreground">
          Îți spunem ce informații mai sunt necesare și care este următorul pas. Dacă preferi
          telefonul:{" "}
          <a href={contact.phoneHref} className="font-semibold text-foreground underline">
            {contact.phoneDisplay}
          </a>
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        {(contactOnly ? [2] : [0, 1, 2]).map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      {step === 0 ? (
        <div>
          <h3 className="font-display text-lg font-bold">Ce vezi acum?</h3>
          <p className="mb-3 mt-1 text-sm text-muted-foreground">
            Alege ce se potrivește cel mai bine. Nu trebuie să știi cauza — asta e treaba noastră.
          </p>
          <OptionList name="simptom" options={situatii} value={simptom} onChange={setSimptom} />
          <button
            type="button"
            disabled={!simptom}
            onClick={() => setStep(1)}
            className="mt-4 flex h-14 w-full items-center justify-center rounded-md bg-primary text-base font-bold text-primary-foreground disabled:opacity-40"
          >
            Continuă
          </button>
        </div>
      ) : null}

      {step === 1 ? (
        <div>
          <h3 className="font-display text-lg font-bold">Despre suprafață</h3>
          <p className="mb-3 mt-1 text-sm text-muted-foreground">
            Aproximativ e suficient. „Nu știu” e un răspuns valid.
          </p>
          <OptionList
            name="suprafata"
            options={suprafete}
            value={suprafata}
            onChange={setSuprafata}
          />
          <p className="mb-2 mt-5 text-sm font-semibold">S-a mai intervenit acolo?</p>
          <OptionList
            name="istoric"
            options={istoric}
            value={interventii}
            onChange={setInterventii}
          />
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-border"
              aria-label="Înapoi"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              disabled={!suprafata || !interventii}
              onClick={() => setStep(2)}
              className="flex h-14 flex-1 items-center justify-center rounded-md bg-primary text-base font-bold text-primary-foreground disabled:opacity-40"
            >
              Continuă
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <h3 className="font-display text-lg font-bold">Unde îți răspundem</h3>
          <p className="mb-3 mt-1 text-sm text-muted-foreground">
            Doar nume și telefon. Nu te sună nimeni în mod repetat.
          </p>
          <label className="block text-sm font-medium" htmlFor="nume">
            Nume
          </label>
          <input
            id="nume"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            autoComplete="name"
            className="mb-4 mt-1 h-12 w-full rounded-md border-2 border-border bg-background px-3 text-base outline-none focus:border-primary"
          />
          <label className="block text-sm font-medium" htmlFor="telefon">
            Telefon
          </label>
          <input
            id="telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="mt-1 h-12 w-full rounded-md border-2 border-border bg-background px-3 text-base outline-none focus:border-primary"
          />
          {eroare ? <p className="mt-2 text-sm font-medium text-destructive">{eroare}</p> : null}
          <div className="mt-4 flex gap-2">
            {contactOnly ? null : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-border"
              aria-label="Înapoi"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            )}
            <button
              type="button"
              onClick={trimite}
              disabled={seTrimite}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-base font-bold text-primary-foreground disabled:opacity-60"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              {seTrimite ? "Se trimite…" : "Trimite pentru preevaluare"}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Pasul următor: trimiți 3–4 poze pe WhatsApp. Trimiterea solicitării nu te obligă să
            accepți o lucrare.
          </p>

        </div>
      ) : null}
    </div>
  );
}
