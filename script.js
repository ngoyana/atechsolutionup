// ─── EmailJS initialisation ───
(function() {
  emailjs.init({
    publicKey: "jnovTN8nYC1zGiMOb",
  });
})();

// ─── Custom cursor ───
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── Hero canvas particle animation ───
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const mouse = { x: 0, y: 0 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  function Particle() {
    this.reset = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.6 + 0.1;
      this.gold = Math.random() > 0.75;
    };
    this.reset();
  }

  function init() {
    const count = Math.min(Math.floor((W * H) / 10000), 180);
    particles = Array.from({ length: count }, () => new Particle());
  }
  init();

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(201,168,76,0.04)';
    ctx.lineWidth = 1;
    const gSize = 80;
    for (let x = 0; x < W; x += gSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += gSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    particles.forEach(p => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        p.x -= dx * 0.012;
        p.y -= dy * 0.012;
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201,168,76,${p.alpha})`
        : `rgba(232,232,240,${p.alpha * 0.5})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(201,168,76,${0.25 * (1 - d / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    const t = Date.now() * 0.001;
    [
      [W * 0.5, H * 0.5, 180],
      [W * 0.2, H * 0.3, 90],
      [W * 0.8, H * 0.7, 60]
    ].forEach(([cx, cy, r], i) => {
      ctx.beginPath();
      ctx.arc(
        cx + Math.sin(t + i) * 20,
        cy + Math.cos(t * 0.7 + i) * 15,
        r,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `rgba(201,168,76,${0.06 - i * 0.015})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Reveal animations ───
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ─── Animated counters ───
const statNums = document.querySelectorAll('.stat-num[data-target]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = (current < target ? Math.floor(current) : target) + (el.dataset.target === '98' ? '%' : '+');
        if (current >= target) clearInterval(timer);
      }, 25);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObs.observe(el));

// ─── Parallax hero movement ───
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.transform = `translateY(${window.scrollY * 0.18}px)`;
  }
});

// ─── Modal functions ───
function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('modal-form-content').style.display = 'block';
  document.getElementById('modal-success').style.display = 'none';
  document.getElementById('modal-error').style.display = 'none';
  const loader = document.getElementById('modal-loader');
  if (loader) loader.style.display = 'none';
  document.getElementById('modal-submit-btn').disabled = false;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) {
    closeModal();
  }
}

function toggleChip(el) {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => chip.classList.remove('active'));
  el.classList.add('active');
}

// ─── EmailJS form submission ───
async function submitModal() {
  const fname = document.getElementById('m-fname').value.trim();
  const lname = document.getElementById('m-lname').value.trim();
  const email = document.getElementById('m-email').value.trim();
  const phone = document.getElementById('m-phone').value.trim();
  const company = document.getElementById('m-company').value.trim();
  const budget = document.getElementById('m-budget').value;
  const message = document.getElementById('m-message').value.trim();
  const activeChip = document.querySelector('.chip.active');
  const selectedService = activeChip
    ? activeChip.getAttribute('data-service') || activeChip.innerText
    : 'Not specified';

  const errDiv = document.getElementById('modal-error');
  if (!fname) {
    errDiv.style.display = 'block';
    errDiv.textContent = 'Please enter your first name.';
    return;
  }
  if (!email || !email.includes('@')) {
    errDiv.style.display = 'block';
    errDiv.textContent = 'Please enter a valid email address.';
    return;
  }
  errDiv.style.display = 'none';

  const submitBtn = document.getElementById('modal-submit-btn');
  const loader = document.getElementById('modal-loader');
  submitBtn.disabled = true;
  loader.style.display = 'block';

  const templateParams = {
    from_name: `${fname} ${lname}`,
    from_email: email,
    phone: phone,
    company: company || 'Not provided',
    service: selectedService,
    budget: budget || 'Not specified',
    message: message || 'No additional details',
    to_email: 'anelengoyana@gmail.com'
  };

  try {
    await emailjs.send('service_kyrf8eg', 'template_94vnem9', templateParams);
    document.getElementById('modal-form-content').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
  } catch (error) {
    errDiv.style.display = 'block';
    errDiv.textContent = 'There was an error sending your request. Please try again later.';
    console.error('EmailJS error:', error);
  } finally {
    loader.style.display = 'none';
    submitBtn.disabled = false;
  }
}