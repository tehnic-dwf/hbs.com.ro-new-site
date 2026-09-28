import logoAsset from "@/assets/hbs-logo-small.png.asset.json";
import hahneAsset from "@/assets/logo-hahne.png.asset.json";
import teraseHeroAsset from "@/assets/19hidroizolatie-terase-circulabile-e1713777681295.jpg.asset.json";
import teraseGrivitaAsset from "@/assets/3terasa-circulabila-proiect-grivita.jpg.asset.json";
import terase1Asset from "@/assets/terase-circulabile-1.jpg.asset.json";
import terase2Asset from "@/assets/terase-circulabile-2.jpg.asset.json";
import balconAsset from "@/assets/hidroizolatie-balcoane-poza-3.jpg.asset.json";
import reparatiiAsset from "@/assets/reparatii-home-1.jpg.asset.json";
import fundatieAsset from "@/assets/hidroizolatie-fundatie-bloc-001.jpg.asset.json";

type AssetPointer = { url: string };

// Vite injectează BASE_URL din opțiunea `base`; astfel imaginile păstrează
// subfolderul repository-ului inclusiv în HTML-ul prerandat pentru Pages.
const basePath = import.meta.env.BASE_URL || "/";

const url = (asset: unknown) =>
  basePath.replace(/\/$/, "") + (asset as AssetPointer).url;


export const images = {
  logo: url(logoAsset),
  hahne: url(hahneAsset),
  teraseHero: url(teraseHeroAsset),
  teraseGrivita: url(teraseGrivitaAsset),
  terase1: url(terase1Asset),
  terase2: url(terase2Asset),
  balcon: url(balconAsset),
  reparatii: url(reparatiiAsset),
  fundatie: url(fundatieAsset),
};

export const contact = {
  phoneDisplay: "0722 750 380",
  phoneHref: "tel:+40722750380",
  whatsappNumber: "40722750380",
  email: "office@hbs.com.ro",
  company: "SC Hydro Business Systems SRL",
  cui: "RO37187820",
  city: "București",
};

/** Link WhatsApp cu mesaj precompletat, diferit pe fiecare pagină. */
export function whatsappLink(message: string) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  home: "Bună ziua! Am o infiltrație și aș vrea o preevaluare. Trimit poze.",
  terase:
    "Bună ziua! Am o problemă la o terasă circulabilă și aș vrea o preevaluare. Trimit poze.",
  menu: "Bună ziua! Aș vrea să discutăm despre o problemă de infiltrații.",
  ghid: "Bună ziua! Am citit ghidul în 7 puncte și aș vrea o preevaluare. Trimit poze.",
};

/**
 * Reperele de preț NU se afișează public până la validarea cu clientul.
 * Când se aprobă, se pune true și cifrele apar în secțiunea „Ce include prețul”.
 */
export const showPriceFigures = false;

export const proof = {
  rating: "4,8/5",
  reviews: "87 de recenzii Google",
  repairShare: "8 din 10",
  years: "din 2017",
};

export const nav = [
  { to: "/", label: "Acasă" },
  { to: "/hidroizolatii-terase-circulabile", label: "Terase circulabile" },
  { to: "/calculator-pret", label: "Calculator de preț" },
  { to: "/ghid-proprietar-terasa", label: "Ghidul proprietarului" },
] as const;

const SITE = "https://hbs.com.ro";

export type MenuItem = {
  label: string;
  /** Rută internă (implementată în acest site). */
  to?: string;
  /** Link către site-ul actual, pentru paginile încă nemigrate. */
  href?: string;
};

export type MenuGroup = {
  label: string;
  items: MenuItem[];
};

/** Structura completă de servicii, preluată din meniul site-ului actual. */
export const menuGroups: MenuGroup[] = [
  {
    label: "Hidroizolații terase și acoperișuri",
    items: [
      { label: "Hidroizolație terasă circulabilă", to: "/hidroizolatii-terase-circulabile" },
      { label: "Hidroizolare terasă", href: `${SITE}/hidroizolatii-terase/` },
      { label: "Hidroizolație terasă exterioară", href: `${SITE}/hidroizolatie-terasa-exterioara/` },
      {
        label: "Acoperișuri / terase necirculabile",
        href: `${SITE}/hidroizolatii-acoperisuri-terase-necirculabile/`,
      },
      { label: "Hidroizolație acoperiș", href: `${SITE}/hidroizolatie-acoperis/` },
    ],
  },
  {
    label: "Balcoane, băi și interior",
    items: [
      { label: "Hidroizolație balcon", href: `${SITE}/hidroizolatie-balcoane/` },
      { label: "Hidroizolații baie", href: `${SITE}/hidroizolatii-baie/` },
      { label: "Hidroizolație interior", href: `${SITE}/hidroizolatie-interior/` },
      { label: "Hidroizolație exterior", href: `${SITE}/hidroizolatie-exterior/` },
      { label: "Hidroizolație lichidă exterior", href: `${SITE}/hidroizolatie-lichida-exterior/` },
    ],
  },
  {
    label: "Fundații, demisol și beci",
    items: [
      { label: "Hidroizolație fundație", href: `${SITE}/hidroizolatii-fundatii/` },
      { label: "Fundație casă veche", href: `${SITE}/hidroizolatie-fundatie-casa-veche/` },
      { label: "Hidroizolație demisol / beci", href: `${SITE}/hidroizolatie-demisol-beci/` },
      { label: "Barieră orizontală", href: `${SITE}/hidroizolatie-demisol-beci/bariera-orizontala/` },
      {
        label: "Injectarea fisurilor",
        href: `${SITE}/hidroizolatie-demisol-beci/injectarea-fisurilor/`,
      },
      {
        label: "Sistem renovare tencuială",
        href: `${SITE}/hidroizolatie-demisol-beci/renovare-tencuiala/`,
      },
      { label: "Sistem WTA", href: `${SITE}/hidroizolatie-demisol-beci/wta/` },
      {
        label: "Sistem Ruck-Zuck",
        href: `${SITE}/hidroizolatie-demisol-beci/hidroizolatie-demisol-beci-ruck-zuck/`,
      },
    ],
  },
  {
    label: "Pardoseli și finisaje",
    items: [
      { label: "Pardoseală epoxidică", href: `${SITE}/hidroizolatie-pardoseli/` },
      { label: "Pardoseală poliuretanică", href: `${SITE}/pardoseala-poliuretanica/` },
      { label: "Covor piatră naturală / marmură", href: `${SITE}/covor-piatra-naturala-marmura/` },
      { label: "Microciment", href: `${SITE}/microciment/` },
    ],
  },
  {
    label: "Proiecte",
    items: [
      {
        label: "Terase circulabile",
        href: `${SITE}/proiecte-de-hidroizolatii/proiecte-hidroizolatii-terase-circulabile/`,
      },
      {
        label: "Acoperișuri / terase necirculabile",
        href: `${SITE}/proiecte-de-hidroizolatii/proiecte-hidroizolatii-acoperisuri/`,
      },
      {
        label: "Balcoane",
        href: `${SITE}/proiecte-de-hidroizolatii/proiecte-hidroizolatii-balcoane/`,
      },
      {
        label: "Pardoseli epoxidice",
        href: `${SITE}/proiecte-de-hidroizolatii/proiecte-hidroizolatii-pardoseli/`,
      },
      {
        label: "Fundații",
        href: `${SITE}/proiecte-de-hidroizolatii/proiecte-hidroizolatii-fundatii/`,
      },
      {
        label: "Reparații",
        href: `${SITE}/proiecte-de-hidroizolatii/proiecte-hidroizolatii-reparatii/`,
      },
      { label: "Baie", href: `${SITE}/proiecte-de-hidroizolatii/proiecte-hidroizolatii-baie/` },
      {
        label: "Covor piatră naturală / marmură",
        href: `${SITE}/proiecte-de-hidroizolatii/proiecte-piatra-naturala/`,
      },
      { label: "Video", href: `${SITE}/proiecte-de-hidroizolatii/video/` },
    ],
  },
  {
    label: "Resurse și companie",
    items: [
      { label: "Ghidul proprietarului de terasă (7 verificări)", to: "/ghid-proprietar-terasa" },
      { label: "Despre noi", href: `${SITE}/despre-noi/` },
      { label: "Importanța hidroizolațiilor", href: `${SITE}/importanta-hidroizolatiilor/` },
      { label: "Costuri & proces", href: `${SITE}/costuri-hidroizolatie/` },
      { label: "Broșuri", href: `${SITE}/resurse/brosuri/` },
      { label: "Fișe tehnice", href: `${SITE}/resurse/fise-tehnice/` },
      { label: "Parteneri", href: `${SITE}/home/parteneri/` },
      { label: "Testimoniale", href: `${SITE}/testimoniale/` },
      { label: "Blog", href: `${SITE}/blog-hidroizolatii/` },
      { label: "Contact", href: `${SITE}/contact/` },
    ],
  },
];

