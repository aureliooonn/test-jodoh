// ponytail: canvas-confetti library for love fireworks, minimal canvas rain for sad theme
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let rainActive = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function startRain() {
  rainActive = true;
  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 8 + Math.random() * 7,
    len: 15 + Math.random() * 15
  }));
}

function stopRain() {
  rainActive = false;
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderRain() {
  if (rainActive) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(174, 194, 214, 0.7)';
    particles.forEach(p => {
      ctx.fillRect(p.x, p.y, 2, p.len);
      p.y += p.speed;
      p.x -= 1;
      if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
    });
  }
  requestAnimationFrame(renderRain);
}
renderRain();

// Elements
const name1El = document.getElementById('name1');
const name2El = document.getElementById('name2');
const heartBtn = document.getElementById('heartBtn');
const percentText = document.getElementById('percentText');
const resultText = document.getElementById('resultText');
const resetBtn = document.getElementById('resetBtn');

function checkFormComplete() {
  const g1 = document.querySelector('input[name="gender1"]:checked');
  const g2 = document.querySelector('input[name="gender2"]:checked');
  const valid = Boolean(name1El.value.trim() && name2El.value.trim() && g1 && g2);
  heartBtn.disabled = !valid;
  heartBtn.classList.toggle('ready', valid);
  return valid;
}

[name1El, name2El].forEach(el => el.addEventListener('input', checkFormComplete));
document.querySelectorAll('input[type="radio"]').forEach(el => el.addEventListener('change', checkFormComplete));

function getMatchScore(n1, n2) {
  const names = [n1.trim().toLowerCase(), n2.trim().toLowerCase()];
  const isDhitaPair = names.includes('dhita') && (names.includes('heeseung') || names.includes('evan'));
  return isDhitaPair ? 0.001 : Math.floor(Math.random() * 100) + 1;
}

function getMatchResult(pct) {
  return pct >= 60
    ? { text: "selamattt kalian cocokk", theme: "theme-love" }
    : { text: "yahhh kaciannya kalian tidak cocok", theme: "theme-sad" };
}

let isCalculating = false;

heartBtn.addEventListener('click', () => {
  if (isCalculating || !checkFormComplete()) return;
  isCalculating = true;

  document.body.className = '';
  stopRain();
  resultText.textContent = '';
  resetBtn.classList.add('hidden');
  heartBtn.classList.add('computing');

  const finalScore = getMatchScore(name1El.value, name2El.value);
  const rollTimer = setInterval(() => {
    percentText.textContent = `${Math.floor(Math.random() * 100) + 1}%`;
  }, 50);

  setTimeout(() => {
    clearInterval(rollTimer);
    percentText.textContent = `${finalScore}%`;
    heartBtn.classList.remove('computing');

    const outcome = getMatchResult(finalScore);
    document.body.className = outcome.theme;
    resultText.textContent = outcome.text;

    if (finalScore >= 60) {
      if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      startRain();
    }

    resetBtn.classList.remove('hidden');
    isCalculating = false;
  }, 2000);
});

resetBtn.addEventListener('click', () => {
  name1El.value = '';
  name2El.value = '';
  document.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
  document.body.className = '';
  stopRain();
  percentText.textContent = '?';
  resultText.textContent = '';
  resetBtn.classList.add('hidden');
  checkFormComplete();
});

// Runnable sanity check
console.assert(getMatchScore('dhita', 'heeseung') === 0.001, "Easter egg Dhita+Heeseung failed");
console.assert(getMatchScore('evan', 'Dhita') === 0.001, "Easter egg Evan+Dhita failed");
console.assert(getMatchResult(59).theme === "theme-sad", "Sad test failed");
console.assert(getMatchResult(60).theme === "theme-love", "Love test failed");
