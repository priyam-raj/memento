let polaroids = document.querySelectorAll('.polaroid')

polaroids.forEach(item => {
  const randomRotation = Math.floor(Math.random() * (6 - -6 + 1) + -6)

  item.style.transform = `rotate(${randomRotation}deg)`
})

function calculateDays() {
  // 23 March 2001 4:00 AM IST (UTC+5:30)
  const birthday = new Date(Date.UTC(2001, 2, 22, 22, 30)); // UTC time equivalent
  const today = new Date();
  const timeDiff = today.getTime() - birthday.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  document.querySelector('#days').innerHTML = days;

  // Check if age is 110 years or more
  const ageInYears = Math.floor(days / 365.25);
  if (ageInYears >= 110) {
    convertToPastTense();
  }
}

function convertToPastTense() {
  const elements = document.querySelectorAll('.paragraph, .spider-tag, .birthday-area');
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

  elements.forEach(element => {
    let text = element.innerHTML;
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(key, 'gi');
      text = text.replace(regex, value);
    }
    element.innerHTML = text;
  });
}

// calculateDays(); // Only runs on archives page now

// Calculate age for main page
function calculateAge() {
  const birthday = new Date(2002, 2, 23); // March 23, 2002 (month is 0-indexed)
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  
  // If birthday hasn't occurred this year, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  
  const ageElement = document.querySelector('#age');
  if (ageElement) {
    ageElement.textContent = age;
  }
}

// Run age calculation on main page
if (!window.location.pathname.includes('story')) {
  calculateAge();
}

// Easter egg trigger
const easterEggTrigger = document.querySelector('.easter-egg-trigger');
const webCrack = document.querySelector('.web-crack');
let clickCount = 0;
let clickTimer;

if (easterEggTrigger) {
  easterEggTrigger.addEventListener('click', (e) => {
    clickCount++;
    
    // Remove all classes first
    easterEggTrigger.classList.remove('click-1', 'click-2', 'click-ready');
    
    // Apply progressive animations based on click count
    if (clickCount === 1) {
      easterEggTrigger.classList.add('click-1');
    } else if (clickCount === 2) {
      easterEggTrigger.classList.add('click-2');
    }
    
    // Reset click count after 2 seconds
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickCount = 0;
      easterEggTrigger.classList.remove('click-1', 'click-2', 'click-ready');
    }, 2000);
    
    // Trigger easter egg on 3 clicks
    if (clickCount === 3) {
      clickCount = 0;
      easterEggTrigger.classList.add('click-ready');
      
      setTimeout(() => {
        window.location.href = '/story.html';
      }, 400);
    }
  });
}

// Functions for story page
if (window.location.pathname.includes('story')) {
  // Start the story sequence directly
  startStorySequence();
}

// Story sequence for archives page
function startStorySequence() {
  const overlay = document.querySelector('.story-overlay');
  const portal = document.querySelector('.portal-effect');
  const webLines = document.querySelector('.web-lines');
  const comicDots = document.querySelector('.comic-dots');
  const speedLines = document.querySelector('.speed-lines');
  const storyContainer = document.querySelector('.story-container');
  
  // Show effects immediately
  portal.style.display = 'block';
  webLines.style.display = 'block';
  comicDots.style.display = 'block';
  speedLines.style.display = 'block';
  
  portal.style.opacity = '1';
  portal.classList.add('portal-expand');
  webLines.style.opacity = '0.3';
  speedLines.classList.add('speed-burst');
  
  setTimeout(() => {
    // Clear effects and show story
    portal.style.display = 'none';
    webLines.style.display = 'none';
    comicDots.style.display = 'none';
    speedLines.style.display = 'none';
    overlay.style.opacity = '0';
    
    // Show story container
    storyContainer.style.opacity = '1';
    
    // Calculate days
    calculateDays();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup 3D effect for large spider tag
    setupLargeSpiderTag3D();
    
    // Add glitch animation after intro
    setTimeout(() => {
      const spiderTagLarge = document.querySelector('.spider-tag-large');
      if (spiderTagLarge) {
        spiderTagLarge.classList.add('loaded');
      }
    }, 500);
    
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }, 800);
}

// Setup scroll animations for story chapters
function setupScrollAnimations() {
  const chapters = document.querySelectorAll('.story-chapter');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class to chapter
        entry.target.classList.add('visible');
        
        // Trigger bubble animation using new class-based system
        const bubble = entry.target.querySelector('.comic-bubble--chapter');
        if (bubble && !bubble.classList.contains('animate')) {
          bubble.classList.add('animate');
        }
        
        // Start multiverse glitch effects for polaroids in this chapter
        setupMultiverseGlitch(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  chapters.forEach(chapter => {
    observer.observe(chapter);
  });
}

// Multiverse glitch effect for polaroids - EXTREMELY RARE multiverse moments
function setupMultiverseGlitch(chapter) {
  const glitchPolaroids = chapter.querySelectorAll('.story-polaroid.has-glitch');
  
  glitchPolaroids.forEach(polaroid => {
    // EXTREMELY rare chance of a single glitch - only 5% chance when section becomes visible
    if (!polaroid.hasGlitched && Math.random() < 0.05) {
      setTimeout(() => {
        triggerGlitchSwap(polaroid);
        polaroid.hasGlitched = true; // Ensure it never glitches again
      }, 5000 + Math.random() * 10000); // Random delay between 5-15 seconds after visibility
    }
  });
}

function triggerGlitchSwap(polaroid) {
  if (polaroid.classList.contains('infant-glitch')) {
    const imageContainer = polaroid.querySelector('.story-polaroid-image');
    const originalImg = imageContainer.querySelector('img');
    const originalSrc = originalImg.src;
    const glitchSrc = 'media/glitch-media/infant-priyam-raj.jpeg';
    
    // Single quick flash of glitch image
    // Show glitch version briefly
    originalImg.src = glitchSrc;
    polaroid.style.filter = 'grayscale(80%) hue-rotate(180deg) contrast(150%)';
    
    // Return to normal after 150ms
    setTimeout(() => {
      originalImg.src = originalSrc;
      polaroid.style.filter = 'grayscale(80%)';
    }, 150);
  }
}

// Setup 3D effect for large spider tag
function setupLargeSpiderTag3D() {
  const card = document.querySelector('.spider-tag-large');
  const container = document.querySelector('.hero-intro');
  
  if (card && container) {
    container.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -5;
      const rotateY = (mouseX / (rect.width / 2)) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    container.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  }
}

// Setup 3D effect for spider tag
function setupSpiderTag3D() {
  const card = document.querySelector('.spider-tag');
  const container = document.querySelector('.container');
  
  if (card && container) {
    container.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -10;
      const rotateY = (mouseX / (rect.width / 2)) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      card.style.boxShadow = `${-mouseX/20}px ${-mouseY/20}px 30px -10px rgba(0,0,0,0.3)`;
    });
    
    container.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.boxShadow = '0 1px 15px -7.5px #000000';
    });
  }
}