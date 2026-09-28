import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, MessageCircle, Star, ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import {
  contact,
  images,
  menuGroups,
  nav,
  proof,
  whatsappLink,
  whatsappMessages,
} from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(menuGroups[0]?.label ?? null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
      return () => {
      document.body.style.overflow = "";
    };
  }, [open]);


const renderGroup = (group: (typeof menuGroups)[number]) => {
              const expanded = openGroup === group.label;
              return (
                <div key={group.label} className="border-b border-border">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpenGroup(expanded ? null : group.label)}
                    className="flex w-full items-center justify-between gap-3 py-3.5 text-left font-display text-base font-bold text-foreground"
                  >
                    {group.label}
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-primary transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                  {expanded ? (
                    <ul className="pb-3">
                      {group.items.map((item) =>
                        item.to ? (
                          <li key={item.label}>
                            <Link
                              to={item.to}
                              onClick={() => setOpen(false)}
                              className="block py-2.5 pl-3 text-sm font-semibold text-foreground"
                              activeProps={{ className: "text-primary" }}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ) : (
                          <li key={item.label}>
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 py-2.5 pl-3 text-sm text-muted-foreground"
                            >
                              {item.label}
                              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            </a>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : null}
                </div>
              );
  };


  return (
    <>
    <header className="sticky top-0 z-50 border-b border-border bg-background">

      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5">
        <Link to="/" className="min-w-0" onClick={() => setOpen(false)}>
          <img
            src={images.logo}
            alt="HBS – Hydro Business Systems, hidroizolații"
            className="h-9 w-auto"
            width={163}
            height={92}
          />
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={contact.phoneHref}
            aria-label={`Sună la ${contact.phoneDisplay}`}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground"
          >
            <Phone className="h-4 w-4" aria-hidden />
            <span className="hidden xs:inline sm:inline">Sună</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

    </header>
    {open ? (
      <div style={{ zIndex: 9999 }} className="fixed inset-x-0 bottom-0 top-[57px] overflow-y-auto bg-background px-4 pb-10 pt-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Servicii
          </p>
          {menuGroups.filter((g) => !["Proiecte", "Resurse și companie"].some((x) => g.label.startsWith(x))).map(renderGroup)}

          <Link
            to="/calculator-pret"
            onClick={() => setOpen(false)}
            className="my-4 flex items-center justify-between rounded-md bg-primary/10 px-4 py-3.5 font-display text-base font-bold text-primary"
          >
            Calculator de preț
            <span aria-hidden>→</span>
          </Link>

          {menuGroups.filter((g) => ["Proiecte", "Resurse și companie"].some((x) => g.label.startsWith(x))).map(renderGroup)}

          <nav className="mt-6 flex flex-col">
            {nav.filter((item) => item.to !== "/calculator-pret").map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 font-display text-lg font-bold text-foreground"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="#preevaluare"
              onClick={() => setOpen(false)}
              className="flex h-14 items-center justify-center rounded-md bg-primary px-4 text-base font-bold text-primary-foreground"
            >
              Trimite poze pentru o preevaluare
            </a>
            <a
              href={whatsappLink(whatsappMessages.menu)}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 items-center justify-center gap-2 rounded-md border-2 border-border px-4 text-base font-semibold text-foreground"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Scrie pe WhatsApp
            </a>
            <a
              href={contact.phoneHref}
              className="flex h-14 items-center justify-center gap-2 rounded-md border-2 border-border px-4 text-base font-semibold text-foreground"
            >
              <Phone className="h-5 w-5" aria-hidden />
              {contact.phoneDisplay}
            </a>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
            {proof.rating} · {proof.reviews}
          </p>
      </div>
    ) : null}
    </>
  );

}
