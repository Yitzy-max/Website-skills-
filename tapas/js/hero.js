/* =========================================================================
   Frame-sequence hero — vanilla port of <FrameSequenceHero />
   (originally components/ui/mac-book-neo-hero.tsx)

   The scroll engine below is reproduced 1:1 from the React component. Same
   easing constants, same thresholds, same math, same lifecycle:

     · showFrame()  — src swap, skipped when the index hasn't changed
     · loop()       — rAF lerp toward the target frame (0.28 factor,
                      0.08 snap threshold), self-parking when settled
     · preload      — eagerCount frames first, the remainder after
     · onScroll     — scrollY / (spacer height - viewport height), clamped,
                      mapped to frame index + active step + step-local t

   The only structural change: the stage is `position: sticky` rather than
   fixed, so it releases cleanly into the rest of the page. In the original
   the hero *was* the whole document, so it never had to let go. Progress
   still reaches 1.0 exactly as the stage unpins — see the margin trick in
   hero.css. Everything else is untouched.
   ========================================================================= */
(function (window, document) {
  "use strict";

  function cx() {
    return Array.prototype.filter.call(arguments, Boolean).join(" ");
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function FrameSequenceHero(root, config) {
    if (!root) return null;

    var frameCount = config.frameCount;
    var framePath = config.framePath;
    var eagerCount = config.eagerCount == null ? 140 : config.eagerCount;
    var steps = config.steps || [];

    /* --- refs (were useRef) --- */
    var cache = new Array(frameCount);
    var loaded = 0;
    var targetFrame = 0;
    var displayFrame = 0;
    var lastShown = -1;
    var rafActive = false;

    /* --- elements --- */
    var spacer = root.querySelector(".fsh-spacer");
    var stage = root.querySelector(".fsh-stage");
    var canvas = root.querySelector(".fsh-canvas");
    var nav = root.querySelector(".fsh-nav");
    var sub = root.querySelector(".fsh-sub");
    var loader = root.querySelector(".fsh-loader");
    var loaderText = root.querySelector(".fsh-loader-text");
    var loaderFill = root.querySelector(".fsh-loader-fill");
    var cardsHost = root.querySelector(".fsh-cards");
    var progressFill = root.querySelector(".fsh-progress-fill");

    var loaderDone = false;
    var activeIdx = -1;
    var stepLocal = 0;

    /* ---------------------------------------------------------------
       Cards — rendered from the steps array, exactly as the component
       mapped over steps. Each card keeps its own tick row so the active
       card shows progress through the whole sequence.
       --------------------------------------------------------------- */
    var cardEls = [];

    function buildCards() {
      if (!cardsHost) return;
      steps.forEach(function (s, i) {
        var article = document.createElement("article");
        article.className = "fsh-card";
        article.style.setProperty("--c", s.color);

        var ticks = steps
          .map(function () {
            return '<i class="fsh-tick"><span></span></i>';
          })
          .join("");

        /* A step may be a review instead of a dish. Same card, same
           timing — it just carries a rating and an attribution. */
        var stars = s.stars
          ? '<div class="fsh-card-stars" aria-label="' +
            s.stars.length +
            ' out of 5 stars">' +
            s.stars +
            "</div>"
          : "";
        var cite = s.cite ? '<cite class="fsh-card-cite">' + s.cite + "</cite>" : "";

        article.innerHTML =
          '<div class="fsh-card-inner">' +
          '<span aria-hidden="true" class="fsh-card-glow"></span>' +
          '<div class="fsh-card-head">' +
          '<span class="fsh-card-num"><strong>' +
          s.num +
          "</strong> / " +
          s.total +
          "</span>" +
          '<span aria-hidden="true" class="fsh-card-icon">' +
          (s.icon || "✦") +
          "</span>" +
          "</div>" +
          stars +
          '<h3 class="fsh-card-title">' +
          s.title +
          "</h3>" +
          '<p class="fsh-card-desc">' +
          s.description +
          "</p>" +
          cite +
          '<div class="fsh-card-foot">' +
          '<div class="fsh-ticks">' +
          ticks +
          "</div>" +
          '<span class="fsh-card-label">' +
          s.label +
          "</span>" +
          "</div>" +
          "</div>";

        cardsHost.appendChild(article);
        cardEls.push({
          el: article,
          ticks: Array.prototype.slice.call(article.querySelectorAll(".fsh-tick > span"))
        });
      });
    }

    function paintCards() {
      cardEls.forEach(function (card, i) {
        var isActive = activeIdx === i;
        var isPrev = activeIdx >= 0 && i < activeIdx;
        card.el.className = cx(
          "fsh-card",
          isActive && "fsh-card-active",
          isPrev && "fsh-card-prev"
        );
        /* tick bars only need repainting on the card you can actually see */
        if (!isActive) return;
        card.ticks.forEach(function (span, j) {
          var done = j < activeIdx;
          var cur = j === activeIdx;
          span.style.transform = "scaleX(" + (done ? 1 : cur ? stepLocal : 0) + ")";
          span.style.transition = done ? "none" : "transform 160ms linear";
        });
      });
    }

    /* ---------------------------------------------------------------
       Frame driver — unchanged from the component
       --------------------------------------------------------------- */
    function showFrame(i) {
      if (i === lastShown) return;
      canvas.src = framePath(i + 1);
      lastShown = i;
    }

    function loop() {
      if (rafActive) return;
      rafActive = true;
      var tick = function () {
        var diff = targetFrame - displayFrame;
        if (Math.abs(diff) < 0.08) displayFrame = targetFrame;
        else displayFrame += diff * 0.28;
        var idx = clamp(Math.round(displayFrame), 0, frameCount - 1);
        if (idx !== lastShown) showFrame(idx);
        if (displayFrame !== targetFrame) requestAnimationFrame(tick);
        else rafActive = false;
      };
      requestAnimationFrame(tick);
    }

    /* ---------------------------------------------------------------
       Preloader — eager block first, then the tail
       --------------------------------------------------------------- */
    function preload() {
      var eager = Math.min(eagerCount, frameCount);

      function loadOne(i) {
        var img = new Image();
        img.decoding = "async";
        img.src = framePath(i + 1);
        var onSettle = function () {
          loaded += 1;
          var pct = Math.round((loaded / frameCount) * 100);
          if (loaderText) loaderText.textContent = pct < 100 ? "Loading · " + pct + "%" : "Ready";
          if (loaderFill) loaderFill.style.width = pct + "%";
          if (loaded === eager) {
            loaderDone = true;
            if (loader) loader.className = "fsh-loader fsh-loader-done";
            for (var j = eager; j < frameCount; j++) loadOne(j);
          }
        };
        img.onload = onSettle;
        img.onerror = onSettle;
        cache[i] = img;
      }

      for (var i = 0; i < eager; i++) loadOne(i);
    }

    /* ---------------------------------------------------------------
       Scroll
       --------------------------------------------------------------- */
    function onScroll() {
      if (!spacer) return;
      var total = spacer.offsetHeight - window.innerHeight;
      var p = clamp(window.scrollY / Math.max(1, total), 0, 1);

      targetFrame = p * (frameCount - 1);
      loop();

      if (progressFill) progressFill.style.width = p * 100 + "%";
      if (nav) nav.className = cx("fsh-nav", window.scrollY > 4 && "fsh-nav-scrolled");
      if (sub) sub.className = cx("fsh-sub", window.scrollY > 8 && "fsh-sub-hidden");

      var idx = -1;
      var local = 0;
      for (var i = 0; i < steps.length; i++) {
        var s = steps[i];
        if (p >= s.from && p < s.to) {
          idx = i;
          local = (p - s.from) / (s.to - s.from);
          break;
        }
      }
      activeIdx = idx;
      stepLocal = clamp(local, 0, 1);
      paintCards();

      /* once the sequence is spent the stage has unpinned — stop the hero
         from sitting over the rest of the page on iOS's sticky quirks */
      if (stage) stage.setAttribute("data-spent", p >= 1 ? "true" : "false");
    }

    buildCards();
    preload();
    showFrame(0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return { refresh: onScroll };
  }

  window.FrameSequenceHero = FrameSequenceHero;
})(window, document);
