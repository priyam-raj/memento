/* /story — intro sequence, days counter, name-tag 3D, rare glitch.
   Loaded only by story.html. */

// ---------- alive ticker (hero) ----------

function startAliveTicker() {
  const el = document.getElementById('alive-years');
  if (!el) return;
  // 23 March 2002 4:00 AM IST (UTC+5:30) — the public date on the tin
  const birth = Date.UTC(2002, 2, 22, 22, 30);
  const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;
  const tick = () => { el.textContent = ((Date.now() - birth) / YEAR_MS).toFixed(8); };
  tick();
  setInterval(tick, 50);
}

// ---------- days since birth ----------

function calculateDays() {
  // 23 March 2001 4:00 AM IST (UTC+5:30)
  const birthday = new Date(Date.UTC(2001, 2, 22, 22, 30)); // UTC equivalent
  const days = Math.floor((Date.now() - birthday.getTime()) / (1000 * 60 * 60 * 24));
  document.querySelector('#days').textContent = days;

  // Memo to the far future: past-tense the page at 110+ years.
  if (Math.floor(days / 365.25) >= 110) {
    convertToPastTense();
  }
}

function convertToPastTense() {
  const replacements = {
    '\\bis\\b': 'was',
    '\\bare\\b': 'were',
    '\\bhas\\b': 'had',
    '\\bhave\\b': 'had',
    '\\bam\\b': 'was',
    '\\bwill\\b': 'would',
    '\\bcan\\b': 'could',
    '\\bdo\\b': 'did',
    '\\bdoes\\b': 'did',
    '\\bgo\\b': 'went',
    '\\bmake\\b': 'made',
    '\\bcreate\\b': 'created',
    '\\bkeep\\b': 'kept'
  };

  document.querySelectorAll('.story-text, .spider-tag-large').forEach((element) => {
    let text = element.innerHTML;
    for (const [pattern, value] of Object.entries(replacements)) {
      text = text.replace(new RegExp(pattern, 'gi'), value);
    }
    element.innerHTML = text;
  });
}

// ---------- intro sequence ----------

function startStorySequence() {
  const overlay = document.querySelector('.story-overlay');
  const portal = document.querySelector('.portal-effect');
  const webLines = document.querySelector('.web-lines');
  const comicDots = document.querySelector('.comic-dots');
  const speedLines = document.querySelector('.speed-lines');
  const storyContainer = document.querySelector('.story-container');
  const effects = [portal, webLines, comicDots, speedLines];

  effects.forEach((el) => { el.style.display = 'block'; });
  portal.style.opacity = '1';
  portal.classList.add('portal-expand');
  webLines.style.opacity = '0.3';
  speedLines.classList.add('speed-burst');

  setTimeout(() => {
    effects.forEach((el) => { el.style.display = 'none'; });
    overlay.style.opacity = '0';
    storyContainer.style.opacity = '1';

    calculateDays();
    startAliveTicker();
    setupPolaroidGlitches();
    setupLargeSpiderTag3D();

    // start the ambient glitch once heroAppear (2s) has settled
    setTimeout(() => {
      document.querySelector('.spider-tag-large').classList.add('loaded');
    }, 2200);

    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }, 800);
}

// ---------- random multiverse glitches ----------
// Only ever animates ONE polaroid at a time, and only ones on screen.

function setupPolaroidGlitches() {
  const polaroids = document.querySelectorAll('.story-polaroid');
  if (!polaroids.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
  }, { threshold: 0.3 });
  polaroids.forEach((p) => observer.observe(p));

  setInterval(() => {
    // roughly one hit every ~4-5s, somewhere on screen
    if (!visible.size || Math.random() < 0.5) return;
    const pool = [...visible];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    pick.classList.add('glitch-hit');
    setTimeout(() => pick.classList.remove('glitch-hit'), 350);

    // rare: the infant photo briefly swaps universes
    if (pick.classList.contains('infant-glitch') && Math.random() < 0.3) {
      triggerGlitchSwap(pick);
    }
  }, 2200);
}

function triggerGlitchSwap(polaroid) {
  const img = polaroid.querySelector('.story-polaroid-image img');
  const originalSrc = img.src;

  // Single quick flash of the glitch-universe version
  img.src = 'media/glitch-media/infant-priyam-raj.jpeg';

  setTimeout(() => {
    img.src = originalSrc;
  }, 150);
}

// ---------- name-tag 3D hover ----------

function setupLargeSpiderTag3D() {
  const card = document.querySelector('.spider-tag-large');
  const container = document.querySelector('.hero-intro');
  if (!card || !container) return;

  container.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);
    const rotateX = (mouseY / (rect.height / 2)) * -5;
    const rotateY = (mouseX / (rect.width / 2)) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });

  container.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
  });
}

startStorySequence();
