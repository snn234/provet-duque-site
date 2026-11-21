// Provet Duque — interações do site (JS puro, sem bibliotecas)
(function () {
  var WA = "https://wa.me/5591986461111";
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) Links de WhatsApp com mensagem pronta (data-wa="texto")
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = WA + "?text=" + encodeURIComponent(a.getAttribute("data-wa"));
  });

  // 2) Favoritar (coração)
  document.querySelectorAll(".heart").forEach(function (b) {
    b.addEventListener("click", function () {
      var on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", String(!on));
      b.classList.remove("pop-heart"); void b.offsetWidth; b.classList.add("pop-heart");
    });
  });

  // 3) Menu: marca a seção visível
  var links = Array.prototype.slice.call(document.querySelectorAll(".menu a"));
  if ("IntersectionObserver" in window && links.length) {
    var ioMenu = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = "#" + e.target.id;
        links.forEach(function (l) {
          var ativo = l.getAttribute("href") === id;
          l.classList.toggle("active", ativo);
          if (ativo) l.setAttribute("aria-current", "page"); else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["inicio", "loja", "avaliacoes", "contato"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) ioMenu.observe(s);
    });
  }

  // 4) Entrada suave dos elementos ao rolar
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });

    var grupos = new Map();
    document.querySelectorAll(
      ".promo-text > *, .perks li, .sec-head, .cat-card, .product-card, .rv-summary > *, .rv-card, .ct-info > *, .ct-map"
    ).forEach(function (el) {
      var pai = el.parentElement, i = grupos.get(pai) || 0;
      grupos.set(pai, i + 1);
      el.style.setProperty("--d", (i * 0.07) + "s");
      el.classList.add("reveal");
      io.observe(el);
    });

    // elementos das faixas "estouram" ao aparecer
    var k = 0;
    document.querySelectorAll(".art > .sticker, .art > .burst, .art > .bag, .art > .bowl, .art > .dog-slot, .art > .dog-face").forEach(function (el) {
      el.classList.add("pop");
      el.style.setProperty("--d", ((k++ % 4) * 0.12) + "s");
      io.observe(el);
    });
  }

  // 5) Contador da nota (4,8)
  var ptbr = function (n, dec) { return n.toFixed(dec).replace(".", ","); };
  document.querySelectorAll("[data-count]").forEach(function (el, idx) {
    var alvo = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || "0", 10);
    if (reduz) { el.textContent = ptbr(alvo, dec); return; }
    el.textContent = ptbr(0, dec);
    var ini = null, atraso = 900 + idx * 120, dur = 1600;
    function passo(t) {
      if (ini === null) ini = t;
      var p = Math.min(Math.max((t - ini - atraso) / dur, 0), 1);
      el.textContent = ptbr(alvo * (1 - Math.pow(1 - p, 3)), dec);
      if (p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  });

  // 6) Barra de progresso + parallax suave (parallax desligado no celular)
  var barra = document.querySelector(".progress");
  var paralax = Array.prototype.slice.call(document.querySelectorAll("[data-speed]"));
  var ticking = false;
  function atualiza() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (barra) barra.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    if (reduz || window.innerWidth <= 720) {
      paralax.forEach(function (el) { el.style.translate = ""; });
      return;
    }
    var meio = window.innerHeight / 2;
    paralax.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      el.style.translate = "0 " + ((r.top + r.height / 2 - meio) * parseFloat(el.dataset.speed)).toFixed(1) + "px";
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(atualiza); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  atualiza();
})();
