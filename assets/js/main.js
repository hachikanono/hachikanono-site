(function () {
  "use strict";

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      toggle.textContent = isOpen ? "CLOSE" : "MENU";
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /* ---- header: fade in on scroll ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var revealHeader = function () {
      header.classList.toggle("is-visible", window.scrollY > 10);
    };
    revealHeader();
    window.addEventListener("scroll", revealHeader, { passive: true });
  }

  /* ---- spotlight: dim everything except the hovered work thumbnail ---- */
  var worksBand = document.querySelector(".works-band");
  var spotlightOverlay = document.querySelector(".spotlight-overlay");
  if (worksBand && spotlightOverlay) {
    worksBand.addEventListener("mouseover", function (e) {
      var media = e.target.closest(".featured-media, .work-media");
      if (media) {
        media.classList.add("is-spotlit");
        spotlightOverlay.classList.add("is-active");
      }
    });
    worksBand.addEventListener("mouseout", function (e) {
      var media = e.target.closest(".featured-media, .work-media");
      if (media && !media.contains(e.relatedTarget)) {
        media.classList.remove("is-spotlit");
        spotlightOverlay.classList.remove("is-active");
      }
    });
  }

  /* ---- profile photo hover: one random speech bubble image beside the icon ---- */
  var profilePhoto = document.querySelector(".profile-photo");
  var profileBubble = document.querySelector(".profile-bubble");
  /* NOTE: keep "あなたは何が好き？" (like-2) last — add new bubbles above it */
  var PROFILE_BUBBLE_IMAGES = [
    { src: "assets/images/like-1.png", height: 153, width: 122 },
    { src: "assets/images/like-3.png", height: 130, width: 75 },
    { src: "assets/images/like-4.png", height: 153, width: 115 },
    { src: "assets/images/like-5.png", height: 165, width: 113 },
    { src: "assets/images/like-6.png", height: 195, width: 168 },
    { src: "assets/images/like-2.png", height: 153, width: 106 }
  ];

  var profileBubbleIndex = 0;
  var profileBubbleHovering = false;

  if (profilePhoto && profileBubble) {
    // 初回ホバーで画像の読み込みが間に合わず、前の吹き出しが一瞬見えるのを防ぐため先読みしておく
    PROFILE_BUBBLE_IMAGES.forEach(function (b) { new Image().src = b.src; });

    profilePhoto.addEventListener("mouseenter", function () {
      var pick = PROFILE_BUBBLE_IMAGES[profileBubbleIndex];
      profileBubbleIndex = (profileBubbleIndex + 1) % PROFILE_BUBBLE_IMAGES.length;
      profileBubbleHovering = true;
      profileBubble.classList.remove("is-active");
      profileBubble.src = pick.src;
      profileBubble.style.height = pick.height + "px";
      // 幅も先に固定して、画像の読み込み前後で位置がずれないようにする
      profileBubble.style.width = pick.width + "px";
      // 新しい画像の描画準備ができてから表示する
      var show = function () { if (profileBubbleHovering) profileBubble.classList.add("is-active"); };
      if (profileBubble.decode) profileBubble.decode().then(show, show);
      else show();
    });
    profilePhoto.addEventListener("mouseleave", function () {
      profileBubbleHovering = false;
      profileBubble.classList.remove("is-active");
    });
  }

  /* ---- cursor sparkle trail (site-wide) ---- */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lastSparkleTime = 0;

  function spawnSparkle(x, y) {
    var sparkle = document.createElement("span");
    sparkle.className = "cursor-sparkle";
    sparkle.textContent = "✦";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";
    sparkle.style.setProperty("--drift", (Math.random() * 24 - 12) + "px");
    document.body.appendChild(sparkle);
    sparkle.addEventListener("animationend", function () {
      sparkle.remove();
    });
  }

  if (!prefersReducedMotion) {
    document.addEventListener("mousemove", function (e) {
      var now = Date.now();
      if (now - lastSparkleTime < 70) return;
      lastSparkleTime = now;
      spawnSparkle(e.clientX, e.clientY);
    });
  }

  /* ---- scroll reveal (single quiet fade, respects reduced motion) ---- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---- footer year ---- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- image path helper ---- */
  function imgSrc(file) {
    return "assets/images/" + file;
  }

  /* ---- render: TOP page featured + preview list ---- */
  var featuredMount = document.querySelector("[data-mount='featured']");
  var previewMount = document.querySelector("[data-mount='works-preview']");
  if (window.WORKS && (featuredMount || previewMount)) {
    var works = window.WORKS;
    // featured: true の作品がない間は FEATURED 枠を隠し、全作品を WORKS に並べる
    var featured = works.find(function (w) { return w.featured; });
    var rest = featured ? works.filter(function (w) { return w.slug !== featured.slug; }) : works;

    if (featuredMount && !featured) {
      featuredMount.closest("section").hidden = true;
      if (previewMount) previewMount.closest("section").style.paddingTop = "";
    }

    if (featuredMount && featured) {
      featuredMount.innerHTML =
        '<div class="featured-media reveal">' +
          '<img src="' + imgSrc(featured.thumbnail) + '" alt="' + featured.title.replace(/<br>/g, "") + '" loading="lazy">' +
        "</div>" +
        '<div class="featured-text reveal">' +
          '<p class="featured-index en">' + featured.date + '</p>' +
          '<h3 class="featured-title">' + featured.title + "</h3>" +
          '<p class="featured-meta en">' + featured.type + " / " + featured.pages + " / " + featured.genre + "</p>" +
          '<p class="featured-desc">' + (featured.story || featured.description) + "</p>" +
          (featured.externalLink
            ? '<a class="read-link" href="' + featured.externalLink + '" target="_blank" rel="noopener">' + featured.linkLabel + '<span class="arrow">→</span></a>'
            : "") +
        "</div>";
    }

    if (previewMount) {
      previewMount.innerHTML = rest
        .map(function (w, i) {
          var reverse = i % 2 === 1 ? " reverse" : "";
          return (
            '<div class="work-row' + reverse + '">' +
              '<div class="work-media reveal">' +
                '<img src="' + imgSrc(w.thumbnail) + '" alt="' + w.title.replace(/<br>/g, "") + '" loading="lazy">' +
              "</div>" +
              '<div class="work-text reveal">' +
                '<p class="work-index en">' + w.date + "</p>" +
                '<h3 class="work-title">' + w.title + "</h3>" +
                '<p class="work-meta en">' + w.type + " / " + w.pages + " / " + w.genre + "</p>" +
                '<p class="featured-desc">' + (w.story || w.description) + "</p>" +
                (w.externalLink
                  ? '<a class="read-link" href="' + w.externalLink + '" target="_blank" rel="noopener">' + w.linkLabel + '<span class="arrow">→</span></a>'
                  : "") +
              "</div>" +
            "</div>"
          );
        })
        .join("");
      observeNewReveals();
    }
  }

  function observeNewReveals() {
    var els = document.querySelectorAll(".reveal:not(.is-visible)");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---- contact form: submits to Web3Forms ---- */
  var contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.querySelector("#contact-note");
      var submitBtn = contactForm.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;
      if (note) note.textContent = "送信中…";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (note) {
            note.textContent = data.success
              ? "お問い合わせを受け付けました。5営業日以内を目安に回答させていただきます。"
              : "送信に失敗しました。時間をおいて再度お試しください。";
          }
          if (data.success) contactForm.reset();
        })
        .catch(function () {
          if (note) note.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
