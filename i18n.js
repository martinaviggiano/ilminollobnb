// Il Minollo B&B — i18n (IT/EN), vanilla JS, no dependencies

(() => {
  const STORAGE_KEY = "minollo-lang";
  const DEFAULT_LANG = "it";

  const translations = {
    it: {
      meta: {
        title: "Il Minollo B&B Postiglione",
        description:
          "Il Minollo B&B: casa vacanze indipendente a Postiglione, nel cuore del Parco Nazionale del Cilento, Vallo di Diano e Alburni.",
      },
      skip: {
        link: "Vai al contenuto",
      },
      nav: {
        casa: "La casa",
        dettagli: "Gli spazi",
        dove: "Dove siamo",
        cta: "Scrivici",
        openMenu: "Apri il menu",
      },
      hero: {
        eyebrow:
          "Postiglione (SA) · Parco Nazionale del Cilento, Vallo di Diano e Alburni",
        h1: "Il Minollo<span>&nbsp;B&amp;B</span>",
        lede:
          "Una casa vacanze indipendente tra i borghi di pietra e i monti Alburni, nel cuore del Cilento patrimonio UNESCO.",
        btnPrimary: "Scopri la casa",
        btnGhost: "Contattaci",
        scrollLabel: "Scorri verso il basso",
      },
      casa: {
        eyebrow: "La casa",
        h2: "Uno spazio tutto vostro, tra le colline del Cilento",
        p1:
          "Il Minollo è una casa vacanze indipendente pensata per chi cerca tranquillità e autenticità: un'ampia e accogliente zona giorno con cucina, due camere da letto, un bagno e un piccolo terrazzino affacciato sul paesaggio di Postiglione.",
        p2:
          "Il punto di partenza ideale per esplorare i monti Alburni, il Vallo di Diano e i sentieri del Parco Nazionale del Cilento.",
        imgAlt: "Zona giorno con cucina della casa",
      },
      spazi: {
        eyebrow: "Gli spazi",
        h2: "Cosa trovate al Minollo",
        card1: {
          h3: "Zona giorno & cucina",
          p: "Ampio soggiorno luminoso con angolo cottura, pensato per sentirsi come a casa.",
        },
        card2: {
          h3: "Due camere da letto",
          p: "Spazi curati e silenziosi per riposare dopo una giornata tra sentieri e borghi.",
        },
        card3: {
          h3: "Bagno",
          p: "Un bagno completo e funzionale a disposizione degli ospiti.",
        },
        card4: {
          h3: "Terrazzino",
          p: "Un piccolo spazio all'aperto dove godersi l'aria del Cilento in totale relax",
        },
      },
      dove: {
        eyebrow: "Dove siamo",
        h2: "Postiglione, tra Vallo di Diano e Alburni",
        p:
          "La casa si trova a Corso Vittorio Emanuele 49A, Postiglione, un piccolo borgo nel Parco Nazionale del Cilento, Vallo di Diano e Alburni, riconosciuto Riserva della Biosfera UNESCO. Da qui potete raggiungere facilmente i sentieri di montagna, le grotte degli Alburni e i borghi storici della zona.",
        btn: "Apri in Google Maps",
      },
      contatti: {
        eyebrow: "Contatti",
        h2: "Prenota il tuo soggiorno",
        btnEmail: "Scrivi una email",
        facebookAria: "Il Minollo B&B su Facebook",
      },
    },
    en: {
      meta: {
        title: "Il Minollo B&B Postiglione",
        description:
          "Il Minollo B&B: an independent holiday home in Postiglione, in the heart of the Cilento, Vallo di Diano and Alburni National Park.",
      },
      skip: {
        link: "Skip to content",
      },
      nav: {
        casa: "The house",
        dettagli: "The spaces",
        dove: "Where we are",
        cta: "Get in touch",
        openMenu: "Open menu",
      },
      hero: {
        eyebrow:
          "Postiglione (SA) · Cilento, Vallo di Diano and Alburni National Park",
        h1: "Il Minollo<span>&nbsp;B&amp;B</span>",
        lede:
          "An independent holiday home among stone villages and the Alburni mountains, in the heart of Cilento's UNESCO heritage.",
        btnPrimary: "Discover the house",
        btnGhost: "Get in touch",
        scrollLabel: "Scroll down",
      },
      casa: {
        eyebrow: "The house",
        h2: "A space all your own, in the hills of Cilento",
        p1:
          "Il Minollo is an independent holiday home designed for those seeking peace and authenticity: a bright, welcoming living area with kitchen, two bedrooms, one bathroom, and a small terrace overlooking the Postiglione landscape.",
        p2:
          "The ideal starting point for exploring the Alburni mountains, the Vallo di Diano and the trails of the Cilento National Park.",
        imgAlt: "Living area with kitchen inside the house",
      },
      spazi: {
        eyebrow: "The spaces",
        h2: "What you'll find at Il Minollo",
        card1: {
          h3: "Living area & kitchen",
          p: "A bright, spacious living room with a kitchenette, designed to feel like home.",
        },
        card2: {
          h3: "Two bedrooms",
          p: "Quiet, carefully appointed rooms to rest after a day among trails and villages.",
        },
        card3: {
          h3: "Bathroom",
          p: "A full, functional bathroom available to guests.",
        },
        card4: {
          h3: "Terrace",
          p: "A small outdoor space to enjoy the Cilento air in total relaxation",
        },
      },
      dove: {
        eyebrow: "Where we are",
        h2: "Postiglione, between Vallo di Diano and the Alburni",
        p:
          "The house is located at Corso Vittorio Emanuele 49A, Postiglione, a small village in the Cilento, Vallo di Diano and Alburni National Park, a UNESCO Biosphere Reserve. From here you can easily reach mountain trails, the Alburni caves and the area's historic villages.",
        btn: "Open in Google Maps",
      },
      contatti: {
        eyebrow: "Contact",
        h2: "Book your stay",
        btnEmail: "Send an email",
        facebookAria: "Il Minollo B&B on Facebook",
      },
    },
  };

  function getValue(obj, path) {
    return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  function detectInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "it" || saved === "en") return saved;
    const browserLang = (navigator.language || "").toLowerCase();
    return browserLang.startsWith("it") ? "it" : "en";
  }

  function applyLang(lang) {
    const dict = translations[lang] || translations[DEFAULT_LANG];

    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getValue(dict, key);
      if (typeof value === "string") el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const value = getValue(dict, key);
      if (typeof value === "string") el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-attr-alt]").forEach((el) => {
      const value = getValue(dict, el.getAttribute("data-i18n-attr-alt"));
      if (typeof value === "string") el.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-i18n-attr-aria-label]").forEach((el) => {
      const value = getValue(dict, el.getAttribute("data-i18n-attr-aria-label"));
      if (typeof value === "string") el.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-attr-content]").forEach((el) => {
      const value = getValue(dict, el.getAttribute("data-i18n-attr-content"));
      if (typeof value === "string") el.setAttribute("content", value);
    });

    const langLabel = document.getElementById("langLabel");
    if (langLabel) langLabel.textContent = lang.toUpperCase();

    document.querySelectorAll("#langMenu [role='option']").forEach((li) => {
      const isActive = li.getAttribute("data-lang") === lang;
      li.setAttribute("aria-selected", String(isActive));
    });

    localStorage.setItem(STORAGE_KEY, lang);
    window.__minolloLang = lang;
  }

  function initLangSwitch() {
    const switchEl = document.getElementById("langSwitch");
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");
    if (!switchEl || !btn || !menu) return;

    const closeMenu = () => {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    };
    const openMenu = () => {
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains("is-open");
      if (isOpen) closeMenu();
      else openMenu();
    });

    menu.querySelectorAll("li[role='option']").forEach((li) => {
      li.querySelector("button").addEventListener("click", () => {
        applyLang(li.getAttribute("data-lang"));
        closeMenu();
      });
    });

    document.addEventListener("click", (e) => {
      if (!switchEl.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLangSwitch();
    applyLang(detectInitialLang());
  });
})();
