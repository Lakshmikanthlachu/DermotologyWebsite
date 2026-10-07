/* ============================================================
   Solene Dermatology & Skin Clinic — Shared behaviour
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Page loading buffer (fades out #page-loader once the page's
     fonts/CDN styles/images have finished loading, with a short minimum
     display time so fast loads don't just flash). ---------- */
  (function () {
    const loader = document.getElementById("page-loader");
    if (!loader) return;
    const MIN_VISIBLE_MS = 350;
    const shownAt = Date.now();
    const hideLoader = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt));
      setTimeout(() => loader.classList.add("is-hidden"), wait);
    };
    if (document.readyState === "complete") hideLoader();
    else window.addEventListener("load", hideLoader);
    // Safety net: never let a slow/stalled resource block the page for long.
    setTimeout(() => loader.classList.add("is-hidden"), 3000);
  })();

  /* ---------- Broken image fallback (any <img> that fails to load gets a
     branded placeholder instead of a broken-image icon). Capture phase is
     required because the "error" event does not bubble. ---------- */
  document.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (!img || img.tagName !== "IMG" || img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "1";
      img.classList.add("img-fallback");
      img.removeAttribute("srcset");
      img.alt = img.alt || "Solene Dermatology & Skin Clinic";
      img.src =
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">' +
            '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#2563EB" stop-opacity="0.22"/>' +
            '<stop offset="100%" stop-color="#DB2777" stop-opacity="0.22"/></linearGradient></defs>' +
            '<rect width="100%" height="100%" fill="url(#g)"/>' +
            '<text x="50%" y="50%" font-family="sans-serif" font-size="28" font-weight="700" fill="#2563EB" text-anchor="middle" dominant-baseline="middle">Solene</text>' +
            "</svg>"
        );
    },
    true
  );

  /* ---------- Dark mode ---------- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("solene-theme");
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    root.classList.add("dark");
  }
  function updateThemeIcons() {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      const isDark = root.classList.contains("dark");
      btn.setAttribute("aria-pressed", isDark);
    });
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    root.classList.toggle("dark");
    localStorage.setItem("solene-theme", root.classList.contains("dark") ? "dark" : "light");
    updateThemeIcons();
  });
  updateThemeIcons();

  /* ---------- RTL demo toggle ---------- */
  const savedDir = localStorage.getItem("solene-dir");
  if (savedDir === "rtl") {
    root.setAttribute("dir", "rtl");
    root.setAttribute("lang", "ar");
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-dir-toggle]");
    if (!btn) return;
    const isRtl = root.getAttribute("dir") === "rtl";
    if (isRtl) {
      root.setAttribute("dir", "ltr");
      root.setAttribute("lang", "en");
      localStorage.setItem("solene-dir", "ltr");
    } else {
      root.setAttribute("dir", "rtl");
      root.setAttribute("lang", "ar");
      localStorage.setItem("solene-dir", "rtl");
    }
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Header dropdown menus (Home / Treatments) ----------
     These already open on :hover via CSS (group-hover utilities). This adds
     click support too, so they also work on touch devices/trackpads where
     hover never fires, and for anyone who expects clicking a button with a
     chevron to actually do something. */
  function closeAllDropdowns() {
    document.querySelectorAll("[data-dropdown-panel].is-open").forEach((p) => {
      p.classList.remove("is-open");
      p.closest(".group")?.querySelector("[data-dropdown-btn]")?.setAttribute("aria-expanded", "false");
    });
  }
  document.querySelectorAll("[data-dropdown-btn]").forEach((btn) => {
    const panel = btn.parentElement.querySelector("[data-dropdown-panel]");
    if (!panel) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = panel.classList.contains("is-open");
      closeAllDropdowns();
      if (!wasOpen) {
        panel.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dropdown-btn], [data-dropdown-panel]")) closeAllDropdowns();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllDropdowns(); });

  /* ---------- Mobile menu ---------- */
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileOverlay = document.getElementById("mobile-menu-overlay");
  function toggleMobileMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("open", open);
    mobileOverlay?.classList.toggle("hidden", !open);
    document.body.classList.toggle("overflow-hidden", open);
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-menu-open]")) toggleMobileMenu(true);
    if (e.target.closest("[data-menu-close]")) toggleMobileMenu(false);
  });
  mobileOverlay?.addEventListener("click", () => toggleMobileMenu(false));

  /* ---------- Image fallback (graceful degradation for hotlinked photos) ---------- */
  function svgPlaceholder(label) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#153D34'/><stop offset='100%' stop-color='#C5A059'/>
      </linearGradient></defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' font-family='sans-serif' font-size='28' fill='rgba(255,255,255,0.85)' text-anchor='middle' dominant-baseline='middle'>${label || "Solene Clinic"}</text>
    </svg>`;
    return "data:image/svg+xml;base64," + btoa(svg);
  }
  document.querySelectorAll("img[data-fallback-label], img:not([data-no-fallback])").forEach((img) => {
    img.addEventListener(
      "error",
      function handler() {
        img.removeEventListener("error", handler);
        img.classList.add("img-fallback");
        img.src = svgPlaceholder(img.getAttribute("data-fallback-label") || img.alt);
      },
      { once: true }
    );
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Animated counters ---------- */
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-counter"));
    const suffix = el.getAttribute("data-suffix") || "";
    const decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals")) : 0;
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const duration = 1600;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    });
    io.observe(el);
  });

  /* ---------- Before / After sliders ---------- */
  document.querySelectorAll(".ba-slider").forEach((slider) => {
    const after = slider.querySelector(".ba-after");
    const handle = slider.querySelector(".ba-handle");
    function setPos(pct) {
      pct = Math.max(2, Math.min(98, pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.insetInlineStart = pct + "%";
    }
    function fromEvent(e) {
      const rect = slider.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      setPos((x / rect.width) * 100);
    }
    let dragging = false;
    slider.addEventListener("mousedown", (e) => { dragging = true; fromEvent(e); });
    window.addEventListener("mouseup", () => (dragging = false));
    window.addEventListener("mousemove", (e) => dragging && fromEvent(e));
    slider.addEventListener("touchstart", (e) => { dragging = true; fromEvent(e); });
    window.addEventListener("touchend", () => (dragging = false));
    slider.addEventListener("touchmove", fromEvent);
  });

  /* ---------- Testimonial / logo carousel (simple auto-scroll dots) ---------- */
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = track ? Array.from(track.children) : [];
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    let index = 0;
    if (!track || !slides.length) return;
    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${index * -100}%)`;
      dotsWrap?.querySelectorAll("button").forEach((d, di) => d.classList.toggle("bg-accent", di === index) || d.classList.toggle("opacity-100", di===index));
    }
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "w-2.5 h-2.5 rounded-full bg-primary opacity-30 transition-all";
        dot.addEventListener("click", () => go(i));
        dotsWrap.appendChild(dot);
      });
    }
    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => go(index + 1));
    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => go(index - 1));
    go(0);
    setInterval(() => go(index + 1), 6000);
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll("[data-faq-item]").forEach((item) => {
    const btn = item.querySelector("[data-faq-btn]");
    const panel = item.querySelector("[data-faq-panel]");
    const icon = item.querySelector("[data-faq-icon]");
    btn?.addEventListener("click", () => {
      const isOpen = !panel.style.maxHeight || panel.style.maxHeight === "0px";
      document.querySelectorAll("[data-faq-panel]").forEach((p) => (p.style.maxHeight = "0px"));
      document.querySelectorAll("[data-faq-icon]").forEach((i) => i.classList.remove("rotate-45"));
      if (isOpen) {
        panel.style.maxHeight = panel.scrollHeight + "px";
        icon?.classList.add("rotate-45");
      }
    });
  });

  /* ---------- Generic filter chips (services / gallery / blog / doctors / service-details tabs) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const chips = group.querySelectorAll("[data-filter]");
    const targetSelector = group.getAttribute("data-filter-group");
    const items = document.querySelectorAll(targetSelector + " [data-filter-item]");
    const pagerSelector = group.getAttribute("data-pager");
    const pager = pagerSelector ? document.querySelector(pagerSelector) : null;
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const val = chip.getAttribute("data-filter");
        items.forEach((item) => {
          const cats = (item.getAttribute("data-cats") || "").split(",");
          const show = val === "all" || cats.includes(val);
          item.style.display = show ? "" : "none";
        });
        // Pagination (blog) only makes sense over the full, unfiltered set —
        // hide it while a specific category is active, restore on "all".
        if (pager) pager.style.display = val === "all" ? "" : "none";
        if (pager && val === "all" && pager.__resetPage) pager.__resetPage();
      });
    });
  });

  /* ---------- Blog pagination ---------- */
  document.querySelectorAll("[data-paginate]").forEach((grid) => {
    const perPage = parseInt(grid.getAttribute("data-per-page") || "6", 10);
    const pager = document.querySelector(grid.getAttribute("data-paginate"));
    if (!pager) return;
    const items = Array.from(grid.querySelectorAll("[data-filter-item]"));
    const pageBtns = Array.from(pager.querySelectorAll("[data-page-btn]"));
    const prevBtn = pager.querySelector("[data-page-prev]");
    const nextBtn = pager.querySelector("[data-page-next]");
    const totalPages = pageBtns.length || 1;
    let page = 1;

    function showPage(p) {
      page = Math.min(Math.max(p, 1), totalPages);
      items.forEach((item, i) => {
        item.style.display = i >= (page - 1) * perPage && i < page * perPage ? "" : "none";
      });
      pageBtns.forEach((b) => b.classList.toggle("is-active", parseInt(b.getAttribute("data-page-btn"), 10) === page));
      if (prevBtn) prevBtn.disabled = page === 1;
      if (nextBtn) nextBtn.disabled = page === totalPages;
    }

    pageBtns.forEach((b) => {
      b.addEventListener("click", () => {
        showPage(parseInt(b.getAttribute("data-page-btn"), 10));
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    if (prevBtn) prevBtn.addEventListener("click", () => { showPage(page - 1); grid.scrollIntoView({ behavior: "smooth", block: "start" }); });
    if (nextBtn) nextBtn.addEventListener("click", () => { showPage(page + 1); grid.scrollIntoView({ behavior: "smooth", block: "start" }); });

    // Search also supersedes pagination while a query is active.
    document.querySelectorAll("[data-search-input]").forEach((input) => {
      input.addEventListener("input", () => {
        if (input.value.trim()) { pager.style.display = "none"; }
        else { pager.style.display = ""; showPage(1); }
      });
    });

    pager.__resetPage = () => showPage(1);
    showPage(1);
  });

  /* ---------- Static (non-filtering) pagers, e.g. admin dashboard tables ----------
     Unlike the blog pagination above, these don't hide/show real items — the
     underlying dataset is a static demo table — so paging just moves the
     active-page indicator, enables/disables prev/next, and is transparent
     about being a template demo via the existing toast helper. */
  document.querySelectorAll("[data-static-pager]").forEach((pager) => {
    const pageBtns = Array.from(pager.querySelectorAll("[data-pager-page]"));
    const prevBtn = pager.querySelector("[data-pager-prev]");
    const nextBtn = pager.querySelector("[data-pager-next]");
    const totalPages = pageBtns.length || 1;
    let page = 1;

    function render() {
      pageBtns.forEach((b) => {
        b.classList.toggle("is-active", parseInt(b.getAttribute("data-pager-page"), 10) === page);
      });
      if (prevBtn) prevBtn.disabled = page === 1;
      if (nextBtn) nextBtn.disabled = page === totalPages;
    }

    function goTo(p) {
      p = Math.min(Math.max(p, 1), totalPages);
      if (p === page) return;
      page = p;
      render();
      if (window.soleneToast) window.soleneToast(`Page ${page} — connect a real dataset to load more results.`);
    }

    pageBtns.forEach((b) => {
      b.addEventListener("click", () => goTo(parseInt(b.getAttribute("data-pager-page"), 10)));
    });
    if (prevBtn) prevBtn.addEventListener("click", () => goTo(page - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goTo(page + 1));
    render();
  });

  /* ---------- Live search (blog) ---------- */
  document.querySelectorAll("[data-search-input]").forEach((input) => {
    const targetSelector = input.getAttribute("data-search-input");
    const items = document.querySelectorAll(targetSelector + " [data-search-item]");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      // An empty query means the box was just cleared. When this grid also has
      // pagination (see the [data-paginate] handler above), that handler already
      // restores page 1 on its own "input" listener — if we also ran here we'd
      // set every item's display back to visible and clobber that page-1 reset,
      // showing all posts at once instead of just the first page. So do nothing
      // and let pagination's own reset stand.
      if (!q) return;
      items.forEach((item) => {
        const text = item.getAttribute("data-search-text") || item.textContent;
        item.style.display = text.toLowerCase().includes(q) ? "" : "none";
      });
    });
  });

  /* ---------- Search-icon affordance ----------
     Every search box on the site pairs a decorative fa-magnifying-glass icon
     with a sibling <input> (search filters as you type — there's no separate
     submit step). The icon looks clickable but previously did nothing when
     clicked, which reads as "the search button doesn't work". Clicking it
     now focuses the input, same as clicking directly in the field. Safe to
     apply everywhere: icons that aren't paired with an input (e.g. already
     inside their own <button>, like the admin mobile search toggle) simply
     find no input and no-op. */
  document.addEventListener("click", (e) => {
    const icon = e.target.closest(".fa-magnifying-glass");
    if (!icon || icon.closest("button")) return;
    const input = icon.parentElement?.querySelector("input");
    if (input) input.focus();
  });
  document.querySelectorAll(".fa-magnifying-glass").forEach((icon) => {
    if (icon.closest("button")) return;
    if (icon.parentElement?.querySelector("input")) icon.classList.add("cursor-pointer");
  });

  /* ---------- Password visibility toggle ---------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-pw-toggle]");
    if (!btn) return;
    const input = document.querySelector(btn.getAttribute("data-pw-toggle"));
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    btn.querySelector("i")?.classList.toggle("fa-eye");
    btn.querySelector("i")?.classList.toggle("fa-eye-slash");
  });

  /* ---------- Auth tab switch (login / register) ----------
     Note: data-auth-tab is used on BOTH the top pill buttons AND the inline
     "Register now" / "Log in" text links inside each panel, so several
     elements can share the same target value. The active-state styling must
     always be resolved by target value against the pill buttons specifically
     (".auth-tab-btn"), never by just re-styling whichever element was
     physically clicked — otherwise clicking an inline link mis-styles the
     link itself instead of updating the real tab buttons. */
  document.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-auth-tab");
      document.querySelectorAll(".auth-tab-btn").forEach((t) => {
        t.classList.toggle("is-active", t.getAttribute("data-auth-tab") === target);
      });
      document.querySelectorAll("[data-auth-panel]").forEach((p) => p.classList.add("hidden"));
      document.querySelector(`[data-auth-panel="${target}"]`)?.classList.remove("hidden");
    });
  });

  /* ---------- Dashboard sidebar (patient + admin) ---------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-sidebar-open]")) {
      document.getElementById("dash-sidebar")?.classList.remove("-translate-x-full");
      document.getElementById("dash-sidebar")?.classList.remove("translate-x-full");
      document.getElementById("sidebar-overlay")?.classList.remove("hidden");
    }
    if (e.target.closest("[data-sidebar-close]") || e.target.id === "sidebar-overlay") {
      const rtl = document.documentElement.getAttribute("dir") === "rtl";
      document.getElementById("dash-sidebar")?.classList.add(rtl ? "translate-x-full" : "-translate-x-full");
      document.getElementById("sidebar-overlay")?.classList.add("hidden");
    }
  });
  document.querySelectorAll("[data-tab-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-btn");
      document.querySelectorAll("[data-tab-btn]").forEach((b) => {
        b.classList.toggle("is-active", b.getAttribute("data-tab-btn") === target);
      });
      document.querySelectorAll("[data-tab-panel]").forEach((p) => p.classList.add("hidden"));
      document.querySelector(`[data-tab-panel="${target}"]`)?.classList.remove("hidden");
      // On mobile the sidebar is an off-canvas overlay opened via the hamburger
      // button — picking a section is a natural "I'm done with the menu" signal,
      // so close it automatically instead of forcing a separate tap on the X.
      // (Harmless on desktop: the lg:translate-x-0 utility keeps the sidebar
      // visible there regardless of these classes.)
      const rtl = document.documentElement.getAttribute("dir") === "rtl";
      document.getElementById("dash-sidebar")?.classList.add(rtl ? "translate-x-full" : "-translate-x-full");
      document.getElementById("sidebar-overlay")?.classList.add("hidden");
    });
  });

  /* ---------- Coming soon countdown ---------- */
  const countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    const target = new Date();
    target.setDate(target.getDate() + 21);
    function update() {
      const diff = Math.max(0, target - new Date());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      const set = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = String(v).padStart(2, "0"); };
      set("cd-days", d); set("cd-hours", h); set("cd-mins", m); set("cd-secs", s);
    }
    update();
    setInterval(update, 1000);
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Toast (form submit demo feedback) ---------- */
  window.soleneToast = function (msg) {
    let toast = document.getElementById("solene-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "solene-toast";
      toast.className =
        "fixed bottom-6 inset-inline-end-6 z-[100] bg-ink-fixed text-white px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 translate-y-24 opacity-0 transition-all duration-500";
      toast.innerHTML = '<i class="fa-solid fa-circle-check text-accent"></i><span data-toast-msg></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector("[data-toast-msg]").textContent = msg;
    requestAnimationFrame(() => toast.classList.remove("translate-y-24", "opacity-0"));
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.add("translate-y-24", "opacity-0"), 3200);
  };
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameFields = form.querySelectorAll("input[data-validate-name]");
      const emailFields = form.querySelectorAll('input[type="email"]');
      const phoneFields = form.querySelectorAll('input[type="tel"]');
      const validName = (value) => /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' -]{1,}$/.test(value.trim());
      const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
      const validPhone = (value) => /^[+]?\d[\d\s().-]{6,}$/.test(value.trim());
      const invalid = [
        ...[...nameFields].filter((field) => !validName(field.value)),
        ...[...emailFields].filter((field) => !validEmail(field.value)),
        ...[...phoneFields].filter((field) => field.value.trim() && !validPhone(field.value)),
      ];
      if (invalid.length) {
        invalid.forEach((field) => field.setAttribute("aria-invalid", "true"));
        invalid[0].focus();
        window.soleneToast("Please enter a valid name, email address, and phone number.");
        return;
      }
      window.soleneToast(form.getAttribute("data-demo-form") || "Submitted successfully.");
      form.reset();
    });
  });

  /* Make field feedback immediate as well as enforcing it on submission. */
  document.querySelectorAll('input[type="email"]').forEach((field) => {
    field.addEventListener("input", () => {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim());
      field.setCustomValidity(field.value && !valid ? "Enter a complete email address, for example name@example.com." : "");
      field.toggleAttribute("aria-invalid", Boolean(field.value) && !valid);
    });
  });
  document.querySelectorAll('input[type="tel"]').forEach((field) => {
    field.addEventListener("input", () => {
      const cleaned = field.value.replace(/[^\d+\s().-]/g, "");
      if (field.value !== cleaned) field.value = cleaned;
      const valid = !field.value.trim() || /^[+]?\d[\d\s().-]{6,}$/.test(field.value.trim());
      field.setCustomValidity(valid ? "" : "Enter a valid phone number using digits only.");
      field.toggleAttribute("aria-invalid", !valid);
    });
  });

  /* ---------- Article share buttons ---------- */
  document.addEventListener("click", (e) => {
    const shareBtn = e.target.closest("[data-share]");
    if (shareBtn) {
      const network = shareBtn.getAttribute("data-share");
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      };
      if (shareUrls[network]) window.open(shareUrls[network], "_blank", "noopener,width=600,height=500");
      return;
    }
    const copyBtn = e.target.closest("[data-copy-link]");
    if (copyBtn) {
      const finish = () => window.soleneToast("Link copied to clipboard.");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(finish).catch(finish);
      } else {
        finish();
      }
      return;
    }
    const toastBtn = e.target.closest("[data-demo-toast]");
    if (toastBtn) window.soleneToast(toastBtn.getAttribute("data-demo-toast"));
  });
})();
