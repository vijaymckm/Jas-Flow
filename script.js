/* ============================================================
   RegalFinserrv — Premium animations & interactions
   Vanilla JS · IntersectionObserver · GSAP-free for fast load
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Navbar scroll state ----------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  // ---------- Animated counters ----------
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const duration = 1600;
      const startTime = performance.now();
      const animate = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        const value = target * eased;
        el.textContent = target % 1 === 0
          ? Math.round(value).toLocaleString()
          : value.toFixed(1);
        if (t < 1) requestAnimationFrame(animate);
        else el.textContent = target % 1 === 0
          ? Math.round(target).toLocaleString()
          : target.toFixed(1);
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach((c) => counterObserver.observe(c));

  // ---------- Subtle parallax for hero floating cards ----------
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.matchMedia('(min-width: 980px)').matches) {
    const cards = heroVisual.querySelectorAll('.float-card');
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cards.forEach((card, i) => {
        const depth = (i + 1) * 6;
        card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
    heroVisual.addEventListener('mouseleave', () => {
      cards.forEach((card) => { card.style.transform = ''; });
    });
  }

  // ---------- Smooth anchor scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 40,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ---------- Section enter parallax (subtle drift on hero blob) ----------
  const blob = document.querySelector('.hero-visual .blob');
  if (blob) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      blob.style.transform = `translateY(${y * 0.15}px)`;
    }, { passive: true });
  }

  // ---------- Iframe fallback (in case site blocks embedding) ----------
  const iframe = document.querySelector('.browser-frame iframe');
  if (iframe) {
    let loaded = false;
    iframe.addEventListener('load', () => { loaded = true; });
    setTimeout(() => {
      if (!loaded) {
        const wrap = iframe.parentElement;
        wrap.innerHTML = `
          <div style="display:grid; place-items:center; height:100%; padding:40px; text-align:center; background: linear-gradient(135deg,#fff,#fafafa);">
            <div>
              <div style="width:64px;height:64px;border-radius:18px;background:#F4C542;margin:0 auto 20px;display:grid;place-items:center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
              </div>
              <h3 style="font-size:24px;margin-bottom:10px;">Live Website Preview</h3>
              <p style="color:#6b6b6b;margin-bottom:24px;max-width:420px;">The preview is hosted on Framer. Click below to open it in a new tab for the full interactive experience.</p>
              <a href="http://fundely.framer.website/" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;padding:14px 24px;background:#111;color:#fff;border-radius:999px;font-weight:500;font-size:14px;text-decoration:none;">
                Open Website
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
              </a>
            </div>
          </div>
        `;
      }
    }, 4000);
  }
});
