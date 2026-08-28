import csvRaw from "@/data/hbs-flux-preturi.csv?raw";

export type PriceRow = {
  id: string;
  serviciu: string;
  tipLucrare: string;
  varianta: string;
  variantaSecundara: string;
  amplasament: string;
  pragSuprafata: string;
  unitate: string;
  pretMin: number | null;
  pretMax: number | null;
  arePret: boolean;
  eticheta: string;
  textRezultat: string;
};

/** Parser CSV minimal (suportă ghilimele și virgule în interiorul câmpurilor). */
function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  const text = input.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

const num = (v: string) => {
  const n = Number.parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

export const priceRows: PriceRow[] = (() => {
  const parsed = parseCsv(csvRaw);
  const header = parsed[0] ?? [];
  const body = parsed.slice(1);
  const idx = (name: string) => header.indexOf(name);
  const c = {
    id: idx("id"),
    serviciu: idx("serviciu"),
    tip: idx("tip_lucrare"),
    varianta: idx("varianta_finisaj_sistem_stare"),
    secundara: idx("varianta_secundara"),
    amplasament: idx("amplasament_cladire"),
    prag: idx("prag_suprafata"),
    unitate: idx("unitate_masura"),
    min: idx("pret_min_eur"),
    max: idx("pret_max_eur"),
    are: idx("are_pret_predefinit"),
    eticheta: idx("eticheta_selectie"),
    text: idx("text_rezultat_afisat_client"),
  };
  return body.map((r) => ({
    id: r[c.id] ?? "",
    serviciu: (r[c.serviciu] ?? "").trim(),
    tipLucrare: (r[c.tip] ?? "").trim(),
    varianta: (r[c.varianta] ?? "").trim(),
    variantaSecundara: (r[c.secundara] ?? "").trim(),
    amplasament: (r[c.amplasament] ?? "").trim(),
    pragSuprafata: (r[c.prag] ?? "").trim(),
    unitate: (r[c.unitate] ?? "mp").trim(),
    pretMin: num(r[c.min] ?? ""),
    pretMax: num(r[c.max] ?? ""),
    arePret: (r[c.are] ?? "").trim().toLowerCase() === "da",
    eticheta: (r[c.eticheta] ?? "").trim(),
    textRezultat: (r[c.text] ?? "").trim(),
  }));
})();

export type Selection = {
  serviciu?: string;
  tipLucrare?: string;
  varianta?: string;
  variantaSecundara?: string;
  amplasament?: string;
};

export const stepKeys = [
  "serviciu",
  "tipLucrare",
  "varianta",
  "amplasament",
  "variantaSecundara",
] as const;

export type StepKey = (typeof stepKeys)[number];

export const stepLabels: Record<StepKey, string> = {
  serviciu: "Ce lucrare te interesează?",
  tipLucrare: "Tipul lucrării",
  varianta: "Finisajul / sistemul actual",
  variantaSecundara: "Unde apare infiltrația?",
  amplasament: "Unde e amplasată lucrarea?",
};

export function filterRows(sel: Selection): PriceRow[] {
  return priceRows.filter(
    (r) =>
      (!sel.serviciu || r.serviciu === sel.serviciu) &&
      (!sel.tipLucrare || r.tipLucrare === sel.tipLucrare) &&
      (!sel.varianta || r.varianta === sel.varianta) &&
      (!sel.variantaSecundara || r.variantaSecundara === sel.variantaSecundara) &&
      (!sel.amplasament || r.amplasament === sel.amplasament),
  );
}

/** Opțiunile distincte, non-goale, pentru un pas dat, în contextul selecției curente. */
export function optionsFor(key: StepKey, sel: Selection): string[] {
  const rows = filterRows(sel);
  const values = new Set<string>();
  rows.forEach((r) => {
    const v = r[key];
    if (v) values.add(v);
  });
  return [...values];
}

export type Threshold = { label: string; min: number; max: number };

export function parseThreshold(label: string): Threshold {
  if (label.toLowerCase() === "oricare") {
    return { label, min: 0, max: Number.POSITIVE_INFINITY };
  }
  const [a, b] = label.split("-").map((v) => Number.parseFloat(v));
  return { label, min: a ?? 0, max: b ?? Number.POSITIVE_INFINITY };
}

export type Estimate =
  | { kind: "price"; row: PriceRow; suprafata: number; totalMin: number; totalMax: number; outOfRange: boolean }
  | { kind: "manual"; row?: PriceRow | undefined };

export function estimate(sel: Selection, suprafata: number): Estimate {
  const rows = filterRows(sel);
  if (rows.length === 0) return { kind: "manual" };

  const withoutPrice = rows.find((r) => !r.arePret);
  if (withoutPrice && rows.every((r) => !r.arePret)) {
    return { kind: "manual", row: withoutPrice };
  }

  const priced = rows.filter((r) => r.arePret);
  const inRange = priced.find((r) => {
    const t = parseThreshold(r.pragSuprafata);
    return suprafata >= t.min && suprafata <= t.max;
  });

  const chosen =
    inRange ??
    priced
      .slice()
      .sort((a, b) => {
        const ta = parseThreshold(a.pragSuprafata);
        const tb = parseThreshold(b.pragSuprafata);
        const da = suprafata < ta.min ? ta.min - suprafata : suprafata - ta.max;
        const db = suprafata < tb.min ? tb.min - suprafata : suprafata - tb.max;
        return da - db;
      })[0];

  if (!chosen || chosen.pretMin == null) return { kind: "manual", row: chosen };

  const min = chosen.pretMin;
  const max = chosen.pretMax ?? chosen.pretMin;
  return {
    kind: "price",
    row: chosen,
    suprafata,
    totalMin: Math.round(min * suprafata),
    totalMax: Math.round(max * suprafata),
    outOfRange: !inRange,
  };
}

export function thresholdsFor(sel: Selection): string[] {
  return [...new Set(filterRows(sel).map((r) => r.pragSuprafata))];
}

export function unitFor(sel: Selection): string {
  return filterRows(sel)[0]?.unitate ?? "mp";
}

export const eur = (n: number) => n.toLocaleString("ro-RO", { maximumFractionDigits: 0 });
