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

  /* ---- Countdown to 2026-07-26 06:00 (Cali, UTC-5) ---- */
  var target = new Date("2026-07-26T06:00:00-05:00").getTime();
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
  setInterval(tick, 2000);

  /* ---- Trust marquee build ---- */
  var items = [
    ["+675", "reseñas 5★ en Google"],
    ["+30", "países representados"],
    ["2009", "formando profesores"],
    ["300h", "certificación internacional"],
    ["#1", "centro de Kankueb en el Planeta"],
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

  /* ---- Stripe checkout links (pricing) ----
     Pega tus links de pago de Stripe aquí. Si quedan vacíos, el botón
     abre WhatsApp para gestionar la reserva manualmente.
  */
  var STRIPE_LINKS = {
    carpa: "https://buy.stripe.com/7sY00igN149I7Is3CHew80b",
    dormitorio: "https://buy.stripe.com/aFa6oGaoD21A0g05KPew80c",
    privada: "https://buy.stripe.com/eVq9AS8gv35E8Mw0qvew80d",
    apartaestudio: "https://buy.stripe.com/cNi7sK7cr49IaUE5KPew80e",
    lujo: ""
  };
  var WA_RESERVE = "https://wa.me/573013473398?text=Hola%20IKY,%20quiero%20reservar%20con%20el%2010%25%20mi%20cupo%20del%20profesorado%20(julio%202026).%20Acomodaci%C3%B3n%3A%20";
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
  function mountVideo(el, url) {
    if (!url) return false;
    var src = url;
    // turn a normal youtube url into an embed url
    var m = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/);
    if (m) src = "https://www.youtube.com/embed/" + m[1] + "?autoplay=1";
    var f = document.createElement("iframe");
    f.src = src;
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    f.allowFullscreen = true;
    el.innerHTML = "";
    el.appendChild(f);
    return true;
  }
  var bigVideo = document.getElementById("elementsVideo");
  if (bigVideo) {
    bigVideo.addEventListener("click", function () {
      mountVideo(bigVideo, bigVideo.getAttribute("data-yt"));
    });
  }
  document.querySelectorAll(".vtest").forEach(function (el) {
    el.addEventListener("click", function () {
      mountVideo(el, el.getAttribute("data-video"));
    });
  });
})();
