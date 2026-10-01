/* ============================================================
   IKY landing — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Theme toggle (persisted) ---- */
  var root = document.documentElement;
  var saved = localStorage.getItem("iky-theme");
  if (saved) root.setAttribute("data-theme", saved);
  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("iky-theme", next);
    });
  }

  /* ---- Header scroll state ---- */
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 30) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  function closeMenu() {
    menu.classList.remove("open");
    burger.classList.remove("active");
    document.body.style.overflow = "";
  }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.classList.toggle("active", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---- Countdown to 2026-11-23 06:00 (Cali, UTC-5) ---- */
  var target = new Date("2026-11-23T06:00:00-05:00").getTime();
  var cdEls = {
    d: document.querySelector('[data-cd="d"]'),
    h: document.querySelector('[data-cd="h"]'),
    m: document.querySelector('[data-cd="m"]'),
    s: document.querySelector('[data-cd="s"]')
  };
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    if (!cdEls.d) return;
    var diff = target - Date.now();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    cdEls.d.textContent = pad(d);
    cdEls.h.textContent = pad(h);
    cdEls.m.textContent = pad(m);
    cdEls.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ---- Trust marquee build ---- */
  var items = [
    ["+682", "reseñas 5★ en Google"],
    ["+30", "países representados"],
    ["2009", "formando profesores"],
    ["+300h", "certificación internacional"],
    ["#1", "Único centro de Kankueb Yoga en el Planeta"],
    ["21", "días de inmersión"]
  ];
  var track = document.getElementById("trustTrack");
  if (track) {
    var html = "";
    for (var rep = 0; rep < 2; rep++) {
      items.forEach(function (it) {
        html += '<span class="trust__item"><b>' + it[0] + '</b> ' + it[1] + ' <span class="dot"></span></span>';
      });
    }
    track.innerHTML = html;
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Smooth-scroll offset for fixed header ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* ---- WhatsApp tip pulse (show once after a few seconds) ---- */
  var tip = document.getElementById("waTip");
  if (tip) {
    setTimeout(function () {
      tip.classList.add("show");
      setTimeout(function () { tip.classList.remove("show"); }, 4500);
    }, 3500);
  }

  /* ---- Cal.com placeholder: easy swap point ----
     When you have the embed, replace the #calEmbed inner HTML with your
     <iframe src="https://cal.com/..."></iframe> or paste Cal's embed snippet.
  */
  var CAL_LINK = ""; // e.g. "https://cal.com/iky/charla"
  var calBtn = document.getElementById("calBtn");
  if (calBtn) {
    calBtn.href = CAL_LINK || "https://wa.me/573013473398?text=Hola%20IKY,%20quiero%20agendar%20una%20videollamada%20con%20el%20Maestro";
  }

  /* ============================================================
     >>> LINKS DE PAGO (STRIPE) — EDITA SOLO AQUÍ <<<
     ------------------------------------------------------------
     Pega tu link de Stripe ENTRE LAS COMILLAS "" de cada plan.
     Ejemplo:   privada: "https://buy.stripe.com/abc123",
     - Si dejas el "" vacío, ese botón abre WhatsApp (como antes).
     - No borres las comillas ni la coma del final de cada línea.
     ============================================================ */
  var STRIPE_LINKS = {
    carpa:         "",   // ◀ CAMPING · US$590
    dormitorio:    "",   // ◀ DORMITORIO COMPARTIDO · US$850
    privada:       "",   // ◀ HABITACIÓN PRIVADA · US$1,150
    apartaestudio: "",   // ◀ LOFT PRIVADO · US$1,450
    loft_premium:  "",   // ◀ LOFT PREMIUM · US$2,950
    lujo:          ""    // ◀ (acomodación extra, opcional)
  };
  var WA_RESERVE = "https://wa.me/573013473398?text=Hola%20IKY,%20quiero%20reservar%20con%20el%2010%25%20mi%20cupo%20del%20profesorado%20(noviembre%202026).%20Acomodaci%C3%B3n%3A%20";
  document.querySelectorAll("[data-stripe]").forEach(function (a) {
    var key = a.getAttribute("data-stripe");
    var link = STRIPE_LINKS[key];
    if (link) {
      a.href = link;
    } else {
      a.href = WA_RESERVE + encodeURIComponent(key);
      a.target = "_blank";
      a.rel = "noopener";
    }
  });

  /* ---- Click-to-load video (4 elementos + testimonios) ---- */
  function ytId(url) {
    if (!url) return null;
    var m = url.match(/(?:youtu\.be\/|shorts\/|embed\/|live\/|v=)([\w-]{6,})/);
    return m ? m[1] : null;
  }
  function mountVideo(el, url) {
    if (el.dataset.mounted === "1") return true;   // avoid double-mount
    var id = ytId(url);
    if (!id) return false;
    el.dataset.mounted = "1";
    el.classList.add("is-loading");
    var f = document.createElement("iframe");
    // nocookie domain + autoplay (muted so it ALWAYS starts; user unmutes in-player)
    f.src = "https://www.youtube-nocookie.com/embed/" + id +
            "?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1";
    f.title = "Video IKY";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.allowFullscreen = true;
    f.addEventListener("load", function () { el.classList.remove("is-loading"); });
    // fallback link in case embedding is disabled for a given video
    var fb = document.createElement("a");
    fb.className = "vfallback";
    fb.href = "https://youtu.be/" + id;
    fb.target = "_blank";
    fb.rel = "noopener";
    fb.textContent = "Ver en YouTube ↗";
    el.innerHTML = "";
    el.appendChild(f);
    el.appendChild(fb);
    return true;
  }
  var bigVideo = document.getElementById("elementsVideo");
  if (bigVideo) {
    // Miniatura automática desde data-yt (único punto de edición = el enlace).
    // oardefault = miniatura en su proporción original (vertical para Shorts).
    var bvId = ytId(bigVideo.getAttribute("data-yt"));
    var bvImg = bigVideo.querySelector("img");
    if (bvId && bvImg) {
      bvImg.src = "https://i.ytimg.com/vi/" + bvId + "/oardefault.jpg";
      bvImg.onerror = function () {
        this.onerror = null;
        this.src = "https://i.ytimg.com/vi/" + bvId + "/hqdefault.jpg";
      };
    }
    bigVideo.addEventListener("click", function () {
      mountVideo(bigVideo, bigVideo.getAttribute("data-yt"));
    });
  }
  document.querySelectorAll(".vtest").forEach(function (el) {
    el.addEventListener("click", function () {
      mountVideo(el, el.getAttribute("data-video"));
    });
  });

  /* ---- Pricing: slow auto-advancing slider (desktop + mobile) ---- */
  var priceGrid = document.querySelector(".price-grid");
  var priceHint = document.querySelector(".price-hint");
  if (priceGrid) {
    priceGrid.scrollLeft = 0;            // siempre arranca en carpa (más económico)
    var paused = false, dir = 1, lastTs = 0, ticker = null;
    var SPEED = 32; // px per second — visible drift
    function maxScroll() { return priceGrid.scrollWidth - priceGrid.clientWidth; }
    function step() {
      var now = Date.now();
      if (!lastTs) lastTs = now;
      var dt = Math.min((now - lastTs) / 1000, 0.1); lastTs = now;
      if (paused || maxScroll() <= 4) return;
      var nx = priceGrid.scrollLeft + dir * SPEED * dt;
      if (nx >= maxScroll()) { nx = maxScroll(); dir = -1; paused = true; setTimeout(function(){ paused = false; lastTs = 0; }, 1400); }
      else if (nx <= 0) { nx = 0; dir = 1; }
      priceGrid.scrollLeft = nx;
      if (priceHint) priceHint.style.opacity = priceGrid.scrollLeft > 24 ? "0" : "";
    }
    function run() { if (!ticker) { lastTs = 0; ticker = setInterval(step, 1000 / 60); } }
    // pause on any user interaction, resume shortly after
    var resumeT;
    function pause() { paused = true; clearTimeout(resumeT); resumeT = setTimeout(function () { paused = false; lastTs = 0; }, 2800); }
    ["pointerdown", "wheel", "touchstart", "mouseenter", "focusin"].forEach(function (ev) {
      priceGrid.addEventListener(ev, pause, { passive: true });
    });
    priceGrid.addEventListener("mouseleave", function () { paused = false; lastTs = 0; });
    // respect reduced motion
    var noMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!noMotion) {
      // intro nudge so people notice it scrolls, then continuous drift
      setTimeout(function(){ priceGrid.scrollTo({ left: 110, behavior: "smooth" }); }, 900);
      setTimeout(function(){ priceGrid.scrollTo({ left: 0, behavior: "smooth" }); }, 1650);
      setTimeout(run, 2400);
    }
  }
  /* ---- Dates: slow auto-advancing slider ---- */
  var datesGrid = document.querySelector(".dates-grid");
  if (datesGrid) {
    datesGrid.scrollLeft = 0;
    var dPaused = false, dDir = 1, dLastTs = 0, dTicker = null;
    var D_SPEED = 32;
    function dMaxScroll() { return datesGrid.scrollWidth - datesGrid.clientWidth; }
    function dStep() {
      var now = Date.now();
      if (!dLastTs) dLastTs = now;
      var dt = Math.min((now - dLastTs) / 1000, 0.1); dLastTs = now;
      if (dPaused || dMaxScroll() <= 4) return;
      var nx = datesGrid.scrollLeft + dDir * D_SPEED * dt;
      if (nx >= dMaxScroll()) { nx = dMaxScroll(); dDir = -1; dPaused = true; setTimeout(function(){ dPaused = false; dLastTs = 0; }, 1400); }
      else if (nx <= 0) { nx = 0; dDir = 1; }
      datesGrid.scrollLeft = nx;
    }
    function dRun() { if (!dTicker) { dLastTs = 0; dTicker = setInterval(dStep, 1000 / 60); } }
    var dResumeT;
    function dPause() { dPaused = true; clearTimeout(dResumeT); dResumeT = setTimeout(function () { dPaused = false; dLastTs = 0; }, 2800); }
    ["pointerdown", "wheel", "touchstart", "mouseenter", "focusin"].forEach(function (ev) {
      datesGrid.addEventListener(ev, dPause, { passive: true });
    });
    datesGrid.addEventListener("mouseleave", function () { dPaused = false; dLastTs = 0; });
    
    var dNoMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!dNoMotion) {
      setTimeout(function(){ datesGrid.scrollTo({ left: 110, behavior: "smooth" }); }, 1200);
      setTimeout(function(){ datesGrid.scrollTo({ left: 0, behavior: "smooth" }); }, 1950);
      setTimeout(dRun, 2800);
    }
  }
})();
