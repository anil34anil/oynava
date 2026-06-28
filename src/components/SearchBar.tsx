"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useT } from "@/lib/useLocaleClient";
import { slugifyTitle } from "@/lib/catalog";

type Item = { i: string; t: string; c: string };

// İndeks tüm SearchBar örnekleri arasında paylaşılır; yalnız bir kez çekilir.
let indexCache: Item[] | null = null;
let indexPromise: Promise<Item[]> | null = null;
function loadIndex(): Promise<Item[]> {
  if (indexCache) return Promise.resolve(indexCache);
  if (!indexPromise) {
    indexPromise = fetch("/api/search-index")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Item[]) => {
        indexCache = Array.isArray(d) ? d : [];
        return indexCache;
      })
      .catch(() => {
        indexPromise = null;
        return [];
      });
  }
  return indexPromise;
}

const norm = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/[ığüşöçâîû]/g, (m) => ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c", â: "a", î: "i", û: "u" }[m] ?? m));

export function SearchBar() {
  const router = useRouter();
  const { t, href } = useT();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // İlk odakta indeksi yükle (tek sefer, paylaşımlı).
  const onFocus = () => {
    loadIndex().then(setItems);
  };

  useEffect(() => {
    if (indexCache) setItems(indexCache);
  }, []);

  const suggestions = useMemo(() => {
    const query = norm(q.trim());
    if (query.length < 2 || !items.length) return [];
    const out: Item[] = [];
    for (const it of items) {
      if (norm(it.t).includes(query)) {
        out.push(it);
        if (out.length >= 8) break;
      }
    }
    return out;
  }, [q, items]);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (it: Item) => {
    setOpen(false);
    setQ("");
    router.push(href(`/oyun/${it.i}/${slugifyTitle(it.t)}`));
  };

  const submit = () => {
    if (q.trim()) {
      setOpen(false);
      router.push(href(`/ara?q=${encodeURIComponent(q.trim())}`));
    }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (active >= 0 && suggestions[active]) go(suggestions[active]);
          else submit();
        }}
      >
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => {
            onFocus();
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, suggestions.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, -1));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={t("common.search")}
          aria-label={t("common.search")}
          autoComplete="off"
          className="w-full rounded-xl border border-line bg-card/80 py-2.5 pl-11 pr-4 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-neon focus:shadow-glow"
        />
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-line bg-card/95 p-1.5 shadow-xl backdrop-blur">
          {suggestions.map((it, idx) => (
            <li key={it.i}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(it)}
                onMouseEnter={() => setActive(idx)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  idx === active ? "bg-neon/15 text-neon" : "text-slate-200 hover:bg-white/5"
                }`}
              >
                <span className="truncate">{it.t}</span>
                <span className="shrink-0 text-xs text-slate-500">{it.c}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
