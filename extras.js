// Detalhes extras: ondinha de clique, pets que acompanham o mouse e botões "ímã".
(function () {
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fino = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ondinha no ponto do clique
  document.querySelectorAll(".wa-pill, .btn, .btn-wa, .add, .btn-outline, .see-all, .cta").forEach(function (el) {
    el.addEventListener("pointerdown", function (e) {
      if (reduz) return;
      var r = el.getBoundingClientRect(), d = Math.max(r.width, r.height);
      var s = document.createElement("span");
      s.className = "ripple";
      s.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (e.clientX - r.left - d / 2) + "px;top:" + (e.clientY - r.top - d / 2) + "px";
      el.appendChild(s);
      s.addEventListener("animationend", function () { s.remove(); });
    });
  });

  if (reduz || !fino) return;

  // pets acompanham o mouse de leve
  var hero = document.querySelector(".hero-in");
  if (hero) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (((e.clientX - r.left) / r.width) - 0.5) * 22);
      hero.style.setProperty("--my", (((e.clientY - r.top) / r.height) - 0.5) * 10);
    });
    hero.addEventListener("pointerleave", function () {
      hero.style.setProperty("--mx", 0);
      hero.style.setProperty("--my", 0);
    });
  }

  // botões principais "puxam" um pouco para o cursor
  document.querySelectorAll(".cta, .btn.solid, .btn-wa, .wa-pill").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.translate = (((e.clientX - r.left) / r.width) - 0.5) * 8 + "px " + (((e.clientY - r.top) / r.height) - 0.5) * 6 + "px";
    });
    el.addEventListener("pointerleave", function () { el.style.translate = ""; });
  });
})();
