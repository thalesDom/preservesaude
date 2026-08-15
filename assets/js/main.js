/* =========================================================
   Preserve Saúde — interações do site
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initMobileNav();
  initDropdowns();
  initScrollReveal();
  initCookieBar();
  initBackToTop();
  initPreloader();
  initHeroSlider();
});

/* Slider de fotos do hero — troca sozinho e por clique nos cards numerados */
function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const navButtons = Array.from(document.querySelectorAll("#heroSliderNav button"));
  const counterEl = document.getElementById("heroSliderCurrent");
  const bar = document.getElementById("heroSliderBar");
  const titleEl = document.getElementById("heroTitle");
  const total = slides.length;
  const interval = 5000;

  let current = 0;
  let timer = null;

  function goTo(index) {
    current = (index + total) % total;

    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
    navButtons.forEach((btn, i) => btn.classList.toggle("is-active", i === current));
    if (counterEl) counterEl.textContent = String(current + 1).padStart(2, "0");

    updateTitle(slides[current]);
    restartProgress();
  }

  function updateTitle(slide) {
    if (!titleEl) return;
    const title1 = slide.dataset.title1;
    const title2 = slide.dataset.title2;
    if (title1 === undefined || title2 === undefined) return;

    titleEl.classList.add("is-swapping");
    setTimeout(() => {
      titleEl.innerHTML = `
        <span class="line-1">${title1}</span>
        <span class="line-2">${title2}</span>
      `;
      titleEl.classList.remove("is-swapping");
    }, 250);
  }

  function restartProgress() {
    if (!bar) return;
    bar.classList.remove("is-animating");
    void bar.offsetWidth; // força reflow pra reiniciar a animação
    bar.classList.add("is-animating");
  }

  function next() {
    goTo(current + 1);
  }

  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, interval);
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      goTo(Number(btn.dataset.index));
      startAutoplay();
    });
  });

  goTo(0);
  startAutoplay();
}

/* Tela de carregamento — some quando a página termina de carregar
   (com um tempo mínimo pra não só "piscar" em conexões rápidas) */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const minDisplay = new Promise((resolve) => setTimeout(resolve, 600));
  const pageLoaded = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });

  Promise.all([minDisplay, pageLoaded]).then(() => {
    preloader.classList.add("is-hidden");
    setTimeout(() => preloader.remove(), 600);
  });
}

/* Botão flutuante que aparece ao rolar e volta pro topo suavemente */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle("is-visible", window.scrollY > 500);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Aviso de cookies — fica escondido depois que o visitante aceita */
function initCookieBar() {
  const bar = document.getElementById("cookieBar");
  const accept = document.getElementById("cookieAccept");
  if (!bar || !accept) return;

  if (localStorage.getItem("preserve-cookie-accepted") === "1") {
    bar.remove();
    return;
  }

  setTimeout(() => bar.classList.add("is-visible"), 800);

  accept.addEventListener("click", () => {
    localStorage.setItem("preserve-cookie-accepted", "1");
    bar.classList.remove("is-visible");
  });
}

/* Header muda de aparência ao rolar a página */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  const topBar = document.getElementById("topBar");
  const progress = document.getElementById("scrollProgress");
  if (!header) return;

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    header.classList.toggle("is-scrolled", scrolled);
    topBar?.classList.toggle("is-hidden", scrolled);
    progress?.classList.toggle("is-visible", scrolled);

    if (progress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progress.style.width = pct + "%";
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Menu mobile (hambúrguer) */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const backdrop = document.querySelector(".nav-backdrop");
  const closeBtn = document.querySelector(".nav-close");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-active");
    backdrop?.classList.remove("is-visible");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", willOpen);
    toggle.classList.toggle("is-active", willOpen);
    backdrop?.classList.toggle("is-visible", willOpen);
    document.body.style.overflow = willOpen ? "hidden" : "";
  });

  backdrop?.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);

  // fecha o menu ao clicar num link comum (não nos que abrem o dropdown)
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });
}

/* Dropdown do menu (ex: Intranet) — clique no mobile, hover no desktop */
function initDropdowns() {
  const items = document.querySelectorAll(".nav-item.has-dropdown");

  items.forEach((item) => {
    const link = item.querySelector(".nav-link");
    link?.addEventListener("click", (e) => {
      if (window.matchMedia("(max-width: 860px)").matches) {
        e.preventDefault();
        item.classList.toggle("open");
      }
    });
  });

  document.addEventListener("click", (e) => {
    items.forEach((item) => {
      if (!item.contains(e.target)) item.classList.remove("open");
    });
  });
}

/* Efeito de revelar elementos ao rolar a página */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}
