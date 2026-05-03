/* ══════════════════════════════════════════
   TYPING DEFENDER — game.js
══════════════════════════════════════════ */

/* ── WORD POOL ── */
const WORDS = [
  "elma","masa","kedi","köpek","araba","kitap","kalem","dağ","deniz","güneş",
  "yıldız","bulut","nehir","orman","çiçek","kuş","balık","taş","rüzgar","ateş",
  "kapı","pencere","bahçe","yol","köprü","şehir","ev","okul","hastane","market",
  "computer","keyboard","screen","mouse","window","server","network","system","data","cloud",
  "python","java","swift","kotlin","react","angular","docker","linux","github","debug",
  "algorithm","function","variable","boolean","integer","string","array","object","class","method",
  "sunrise","thunder","crystal","phantom","vortex","galaxy","nebula","quantum","cosmic","aurora",
  "dragon","wizard","knight","shield","sword","battle","castle","quest","magic","power",
  "rhythm","puzzle","syntax","binary","signal","vector","matrix","kernel","pixel","render"
];

/* ── GAME STATE ── */
let state = 'idle'; // idle | running | paused | over
let score = 0;
let lives = 3;
let level = 1;
let wordInterval   = null;
let frameId        = null;
let lastTime       = null;
let wordsOnScreen  = [];  // { el, word, x, y, speed }
let scoreThreshold = 0;
const LEVEL_STEP   = 5;  // correct words per level-up

/* ── DOM REFS ── */
const arena      = document.getElementById('arena');
const overlay    = document.getElementById('overlay');
const wordInput  = document.getElementById('word-input');
const btnStart   = document.getElementById('btn-start');
const btnPause   = document.getElementById('btn-pause');
const btnRestart = document.getElementById('btn-restart');
const statScore  = document.getElementById('stat-score');
const statLevel  = document.getElementById('stat-level');
const statHearts = document.getElementById('stat-hearts');
const lvlBanner  = document.getElementById('level-banner');
const btnStartOv = document.getElementById('btn-start-overlay');

/* ── HELPERS ── */
function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function getSpeed() {
  return 40 + level * 12; // px/s
}

function getSpawnInterval() {
  return Math.max(700, 2200 - level * 150); // ms
}

function arenaH() { return arena.clientHeight; }
function arenaW() { return arena.clientWidth; }

/* ── SPAWN WORD ── */
function spawnWord() {
  if (state !== 'running') return;
  const word = randomWord();
  const el   = document.createElement('div');
  el.className   = 'word-chip';
  el.textContent = word;
  arena.appendChild(el);

  const chipW = el.offsetWidth || 100;
  const x     = Math.random() * (arenaW() - chipW);
  const y     = -40;

  el.style.left = x + 'px';
  el.style.top  = y + 'px';

  wordsOnScreen.push({ el, word, x, y, speed: getSpeed() });
}

/* ── GAME LOOP ── */
function gameLoop(ts) {
  if (state !== 'running') return;

  if (!lastTime) lastTime = ts;
  const dt = (ts - lastTime) / 1000; // seconds
  lastTime = ts;

  const bottom = arenaH() - 6; // danger line threshold

  for (let i = wordsOnScreen.length - 1; i >= 0; i--) {
    const w = wordsOnScreen[i];
    w.y += w.speed * dt;
    w.el.style.top = w.y + 'px';

    if (w.y + w.el.offsetHeight >= bottom) {
      removeWordFromScreen(i, false);
      loseLife();
    }
  }

  frameId = requestAnimationFrame(gameLoop);
}

/* ── REMOVE WORD ── */
function removeWordFromScreen(index, success) {
  const w = wordsOnScreen[index];
  wordsOnScreen.splice(index, 1);

  if (success) {
    spawnParticles(w.x + w.el.offsetWidth / 2, w.y + w.el.offsetHeight / 2);
    spawnScorePopup(w.x + w.el.offsetWidth / 2, w.y);
    w.el.classList.add('explode');
    setTimeout(() => w.el.remove(), 400);
  } else {
    w.el.style.borderColor = 'var(--danger)';
    w.el.style.color       = 'var(--danger)';
    setTimeout(() => w.el.remove(), 300);
  }
}

/* ── PARTICLES ── */
function spawnParticles(cx, cy) {
  const colors = ['#00d4ff','#7c3aed','#22c55e','#f59e0b','#ffffff'];
  for (let i = 0; i < 12; i++) {
    const p    = document.createElement('div');
    const ang  = Math.random() * 360;
    const dist = 30 + Math.random() * 50;
    const dx   = Math.cos(ang * Math.PI / 180) * dist;
    const dy   = Math.sin(ang * Math.PI / 180) * dist;
    const sz   = 4 + Math.random() * 6;
    p.className    = 'particle';
    p.style.cssText = `
      left:${cx}px; top:${cy}px;
      width:${sz}px; height:${sz}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      --dx:${dx}px; --dy:${dy}px;
    `;
    arena.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}

function spawnScorePopup(cx, cy) {
  const el       = document.createElement('div');
  el.className   = 'score-popup';
  el.textContent = '+' + (level * 10);
  el.style.left  = cx + 'px';
  el.style.top   = cy + 'px';
  arena.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

/* ── LIFE SYSTEM ── */
function loseLife() {
  lives = Math.max(0, lives - 1);
  updateHUD();
  arena.style.boxShadow = '0 0 40px var(--danger)';
  setTimeout(() => arena.style.boxShadow = '', 400);
  if (lives === 0) endGame();
}

/* ── SCORING & LEVEL ── */
function addScore() {
  const pts = level * 10;
  score += pts;
  scoreThreshold += pts;
  updateHUD();
  checkLevelUp();
}

function checkLevelUp() {
  const needed = level * LEVEL_STEP * 10;
  if (scoreThreshold >= needed) {
    scoreThreshold = 0;
    level++;
    updateHUD();
    showLevelBanner();
    restartWordTimer();
  }
}

function showLevelBanner() {
  lvlBanner.textContent = `⬆ SEVİYE ${level}`;
  lvlBanner.className   = 'show';
  setTimeout(() => lvlBanner.className = '', 1700);
}

/* ── HUD ── */
function updateHUD() {
  statScore.textContent  = score;
  statLevel.textContent  = level;
  statHearts.textContent = '❤️'.repeat(lives) || '💀';
}

/* ── INPUT HANDLING ── */
wordInput.addEventListener('input', () => {
  if (state !== 'running') return;
  const typed = wordInput.value.trim().toLowerCase();

  wordsOnScreen.forEach(w => {
    if (w.word.startsWith(typed) && typed.length > 0) {
      w.el.classList.add('partial');
      w.el.classList.remove('highlight');
    } else {
      w.el.classList.remove('partial', 'highlight');
    }
  });

  const idx = wordsOnScreen.findIndex(w => w.word === typed);
  if (idx !== -1) {
    wordsOnScreen[idx].el.classList.add('highlight');
    removeWordFromScreen(idx, true);
    addScore();
    wordInput.value = '';
    wordInput.classList.remove('error');
    wordsOnScreen.forEach(w => w.el.classList.remove('partial', 'highlight'));
  }
});

wordInput.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    const typed = wordInput.value.trim().toLowerCase();
    if (!typed) return;
    const idx = wordsOnScreen.findIndex(w => w.word === typed);
    if (idx === -1) {
      wordInput.classList.add('error');
      setTimeout(() => wordInput.classList.remove('error'), 400);
    } else {
      wordsOnScreen[idx].el.classList.add('highlight');
      removeWordFromScreen(idx, true);
      addScore();
      wordInput.value = '';
      wordsOnScreen.forEach(w => w.el.classList.remove('partial', 'highlight'));
    }
  }
});

/* ── WORD TIMER ── */
function startWordTimer() {
  clearInterval(wordInterval);
  wordInterval = setInterval(spawnWord, getSpawnInterval());
}

function restartWordTimer() {
  startWordTimer();
}

/* ── GAME FLOW ── */
function startGame() {
  score = 0; lives = 3; level = 1; scoreThreshold = 0;
  wordsOnScreen.forEach(w => w.el.remove());
  wordsOnScreen = [];
  updateHUD();
  overlay.classList.add('hidden');
  state = 'running';
  wordInput.disabled  = false;
  wordInput.focus();
  btnStart.disabled   = true;
  btnPause.disabled   = false;
  btnRestart.disabled = false;
  lastTime = null;
  startWordTimer();
  frameId = requestAnimationFrame(gameLoop);
}

function pauseGame() {
  if (state === 'running') {
    state = 'paused';
    clearInterval(wordInterval);
    cancelAnimationFrame(frameId);
    lastTime = null;
    btnPause.textContent = '▶ Devam';
    wordInput.disabled   = true;
  } else if (state === 'paused') {
    state = 'running';
    btnPause.textContent = '⏸ Duraklat';
    wordInput.disabled   = false;
    wordInput.focus();
    startWordTimer();
    frameId = requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  state = 'over';
  clearInterval(wordInterval);
  cancelAnimationFrame(frameId);
  wordInput.disabled = true;
  btnPause.disabled  = true;
  btnStart.disabled  = false;
  overlay.innerHTML  = `
    <h2>OYUN BİTTİ</h2>
    <p>Tüm canlarını kaybettin!</p>
    <div class="final-score">${score}</div>
    <p style="font-size:.75rem;color:var(--muted)">PUAN &nbsp;|&nbsp; Seviye ${level}</p>
    <button class="btn" id="btn-gameover-restart"
      style="margin-top:8px;background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#fff;font-size:.85rem;padding:12px 28px;">
      ↺ TEKRAR OYNA
    </button>
  `;
  overlay.classList.remove('hidden');
  document.getElementById('btn-gameover-restart').addEventListener('click', startGame);
}

function restartGame() {
  state = 'idle';
  clearInterval(wordInterval);
  cancelAnimationFrame(frameId);
  wordsOnScreen.forEach(w => w.el.remove());
  wordsOnScreen = [];
  wordInput.value      = '';
  wordInput.disabled   = true;
  btnStart.disabled    = false;
  btnPause.disabled    = true;
  btnRestart.disabled  = true;
  btnPause.textContent = '⏸ Duraklat';
  score = 0; lives = 3; level = 1; scoreThreshold = 0;
  updateHUD();
  overlay.innerHTML = `
    <h2>TYPING DEFENDER</h2>
    <p>Düşen kelimeleri yazarak savun!<br>Hızlı ol, hayatta kal! 🎯</p>
    <button class="btn" id="btn-start-overlay2"
      style="margin-top:8px;background:linear-gradient(135deg,#059669,#22c55e);color:#fff;font-size:.85rem;padding:12px 28px;">
      ▶ OYUNU BAŞLAT
    </button>
  `;
  overlay.classList.remove('hidden');
  document.getElementById('btn-start-overlay2').addEventListener('click', startGame);
}

/* ── BUTTON EVENTS ── */
btnStart.addEventListener('click', startGame);
btnPause.addEventListener('click', pauseGame);
btnRestart.addEventListener('click', restartGame);
btnStartOv.addEventListener('click', startGame);
