// ========== Morphing Blobs ==========
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const blobs = [];
const COLORS = ['rgba(100,120,220,', 'rgba(180,100,200,', 'rgba(80,180,220,', 'rgba(200,120,180,'];

class Blob {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 120 + 60;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.speedX = (Math.random() - 0.5) * 0.15;
    this.speedY = (Math.random() - 0.5) * 0.15;
    this.points = [];
    const count = Math.floor(Math.random() * 4 + 6);
    for (let i = 0; i < count; i++) {
      this.points.push({
        angle: (i / count) * Math.PI * 2,
        variance: Math.random() * 0.5 + 0.5,
        speed: (Math.random() - 0.5) * 0.02
      });
    }
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < -200 || this.x > canvas.width + 200) this.speedX *= -1;
    if (this.y < -200 || this.y > canvas.height + 200) this.speedY *= -1;
    this.points.forEach(p => {
      p.angle += p.speed;
    });
  }
  draw() {
    ctx.beginPath();
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      let angle = progress * Math.PI * 2;
      let rad = this.radius;
      this.points.forEach(p => {
        const diff = angle - p.angle;
        const influence = Math.max(0, Math.cos(diff));
        rad += influence * p.variance * (this.radius * 0.3);
      });
      const x = this.x + Math.cos(angle) * rad;
      const y = this.y + Math.sin(angle) * rad;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = this.color + '0.04)';
    ctx.fill();
  }
}

for (let i = 0; i < 6; i++) blobs.push(new Blob());

function animateBlobs() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  blobs.forEach(b => { b.update(); b.draw(); });
  requestAnimationFrame(animateBlobs);
}
animateBlobs();

// ========== Typing Effect ==========
const nameEl = document.getElementById('typedName');
const subtitleEl = document.getElementById('typedSubtitle');

const fullName = 'Александр Соколов';
const fullSubtitle = 'Фотограф';

function typeText(el, text, speed = 80, callback) {
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

// ========== Glitch Photo Reveal ==========
const photoGlitch = document.getElementById('photoGlitch');
const heroPhoto = document.getElementById('heroPhoto');

heroPhoto.style.backgroundImage = 'url("https://images.unsplash.com/photo-1472066719480-ecc7314ed065?w=400&q=80")';
heroPhoto.style.backgroundSize = 'cover';
heroPhoto.style.backgroundPosition = 'center';

// ========== On Load Sequence ==========
window.addEventListener('load', () => {
  // Step 1: show photo with glitch
  setTimeout(() => {
    photoGlitch.classList.add('active');
  }, 300);

  // Step 2: type name
  setTimeout(() => {
    typeText(nameEl, fullName, 100, () => {
      // Step 3: type subtitle after name
      setTimeout(() => {
        typeText(subtitleEl, fullSubtitle, 70);
      }, 300);
    });
  }, 1200);
});

// ========== Scroll Reveal ==========
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

// ========== Skill Bars Animation ==========
// (section removed)

// ========== Parallax on Mouse ==========
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  const photo = document.querySelector('.photo-wrapper');
  if (photo) {
    photo.style.transform = `translate(${x}px, ${y}px)`;
  }
});

// ========== Send to Telegram ==========
const BOT_TOKEN = 'ВАШ_BOT_TOKEN';
const CHAT_ID = 'ВАШ_CHAT_ID';

function showNotification(text) {
  const el = document.getElementById('notification');
  el.textContent = text;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

document.getElementById('sendBtn').addEventListener('click', async () => {
  const name = document.getElementById('msgName').value.trim();
  const phone = document.getElementById('msgPhone').value.trim();
  const text = document.getElementById('msgText').value.trim();
  if (!name || !text) {
    showNotification('Заполните имя и сообщение');
    return;
  }
  const msg = `✉️ Новое сообщение с портфолио\n\nИмя: ${name}\nТелефон: ${phone || 'не указан'}\nСообщение: ${text}`;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
    });
    if (res.ok) {
      showNotification('Сообщение отправлено!');
      document.getElementById('msgName').value = '';
      document.getElementById('msgPhone').value = '';
      document.getElementById('msgText').value = '';
    } else {
      showNotification('Ошибка отправки. Попробуйте позже.');
    }
  } catch {
    showNotification('Ошибка отправки. Попробуйте позже.');
  }
});
