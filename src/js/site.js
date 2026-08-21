/* CEC — shared interactions: mobile nav, FAQ accordion, educator filter, scroll reveal */
(function () {
  'use strict';

  /* ---- mobile nav ---- */
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item button').forEach(btn => {
    btn.addEventListener('click', () => {
      const ans = btn.closest('.faq-item').querySelector('.ans');
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      ans.style.maxHeight = open ? null : ans.scrollHeight + 'px';
    });
  });

  /* ---- educator filter ---- */
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.edu-card');
  if (filters.length && cards.length) {
    filters.forEach(f => {
      f.addEventListener('click', () => {
        filters.forEach(x => x.classList.remove('active'));
        f.classList.add('active');
        const subj = f.dataset.subject;
        cards.forEach(c => {
          const show = subj === 'all' || c.dataset.subject === subj;
          c.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---- "ver todos" reveal extra educator cards ---- */
  const seeAll = document.querySelector('[data-seeall]');
  if (seeAll) {
    seeAll.addEventListener('click', () => {
      document.querySelectorAll('.edu-card.is-hidden').forEach(c => c.classList.remove('is-hidden'));
      seeAll.remove();
    });
  }

  /* ---- scroll reveal (robust: observer + above-fold + failsafe) ---- */
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  reveals.forEach((el, i) => { el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms'; });

  const show = el => el.classList.add('in');
  const hardShow = el => { el.style.transition = 'none'; el.style.opacity = '1'; el.style.transform = 'none'; };
  const nearViewport = el => {
    const r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || 0) * 0.92 && r.bottom > 0;
  };
  // reveal anything already in view on load
  reveals.forEach(el => { if (nearViewport(el)) show(el); });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach(el => { if (!el.classList.contains('in')) io.observe(el); });
  } else {
    reveals.forEach(show);
  }
  // failsafe: never leave content hidden (also covers paused/offscreen transitions)
  setTimeout(() => reveals.forEach(hardShow), 1400);
  window.addEventListener('load', () => reveals.forEach(el => { if (nearViewport(el)) show(el); }));

  /* ---- active nav link by current file ---- */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a[data-page]').forEach(a => {
    if (a.dataset.page === here) a.classList.add('active');
  });

  /* ---- contact form — mailto ---- */
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nome = (form.querySelector('[name=nome]')?.value || '').trim();
      const email = (form.querySelector('[name=email]')?.value || '').trim();
      const mensagem = (form.querySelector('[name=mensagem]')?.value || '').trim();
      const subject = encodeURIComponent('Contato pelo site — ' + nome);
      const body = encodeURIComponent('Nome: ' + nome + '\nE-mail: ' + email + '\n\nMensagem:\n' + mensagem);
      window.location.href = 'mailto:cec.ufscar.adm@gmail.com?subject=' + subject + '&body=' + body;
    });
  });

})();

/* ---- Relatos Carousel ---- */
(function initRelatosCarousel() {
  const carousel = document.querySelector('.relatos-carousel');
  if (!carousel) return;

  const section = carousel.closest('section');
  const tabs = section ? section.querySelectorAll('[data-tab]') : [];
  const panels = carousel.querySelectorAll('[data-panel]');

  function getCols() {
    const w = window.innerWidth;
    if (w >= 860) return 3;
    if (w >= 560) return 2;
    return 1;
  }

  function initPanel(panel) {
    const track = panel.querySelector('.relatos-track');
    const nav = panel.querySelector('.relatos-nav');
    const prevBtn = panel.querySelector('.relatos-prev');
    const nextBtn = panel.querySelector('.relatos-next');
    const dotsContainer = panel.querySelector('.relatos-dots');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.relato'));
    let page = 0;

    function pageCount() { return Math.ceil(cards.length / getCols()); }
    function needsNav() { return cards.length > getCols(); }

    function render() {
      const cols = getCols();
      const start = page * cols;
      const end = start + cols;

      cards.forEach((c, i) => { c.style.display = (i >= start && i < end) ? '' : 'none'; });

      if (nav) nav.style.display = needsNav() ? 'flex' : 'none';

      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        if (needsNav()) {
          for (let i = 0; i < pageCount(); i++) {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', 'Página ' + (i + 1));
            if (i === page) dot.classList.add('active');
            dot.addEventListener('click', () => { page = i; render(); });
            dotsContainer.appendChild(dot);
          }
        }
      }

      if (prevBtn) prevBtn.disabled = page === 0;
      if (nextBtn) nextBtn.disabled = page >= pageCount() - 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { if (page > 0) { page--; render(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (page < pageCount() - 1) { page++; render(); } });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { page = 0; render(); }, 150);
    });

    render();
  }

  /* tab switching */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      panels.forEach(p => {
        p.hidden = p.dataset.panel !== target;
        if (!p.hidden) initPanel(p);
      });
    });
  });

  /* init visible panel on load */
  panels.forEach(p => { if (!p.hidden) initPanel(p); });
}());
