let enteredPin = "";
const correctPin = "0910";
let swipedCards = 0;
const totalCards = 5;

let audioContext;
let analyser;
let microphone;
let isBlown = false;

/* Jar Notes Pool - Adjusted for online/remote friendship */
const jarNotes = [
  "✨ Your laugh and sense of humor always make my day brighter through every text.",
  "🌸 You bring the absolute best effortless vibes to every single conversation.",
  "✨ Talking to you is easily one of the best parts of my routine.",
  "🌸 You have this incredible natural talent for making long chats feel like minutes.",
  "✨ Undisputed 10/10 main character energy, always!",
  "🌸 Never change how sweet, hilarious, and genuine you are across every message!"
];
let unusedNotes = [...jarNotes];

function drawJarNote() {
  if (unusedNotes.length === 0) {
    unusedNotes = [...jarNotes];
  }
  const randomIndex = Math.floor(Math.random() * unusedNotes.length);
  const note = unusedNotes.splice(randomIndex, 1)[0];

  const display = document.getElementById('jar-note-text');
  if (display) {
    display.style.opacity = 0;
    setTimeout(() => {
      display.innerText = `"${note}"`;
      display.style.opacity = 1;
    }, 150);
  }
}

function goToScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (screenId === 'screen-coupons') {
      initScratchCards();
    }
  }
}

function unlockBlossom() {
  const music = document.getElementById('bg-music');
  if (music) {
    music.play().catch(e => console.log("Audio waiting for user action:", e));
  }
  goToScreen('screen-passcode');
}

/* Keypad Logic */
function pressKey(num) {
  if (enteredPin.length < 4) {
    enteredPin += num;
    updateDots();

    if (enteredPin.length === 4) {
      setTimeout(checkPin, 200);
    }
  }
}

function deleteKey() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updateDots();
  }
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      if (i < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    }
  }
}

function checkPin() {
  if (enteredPin === correctPin) {
    goToScreen('screen-intro');
  } else {
    alert("Incorrect passcode! Check the hint 😉");
    enteredPin = "";
    updateDots();
  }
}

function playfulNo() {
  alert("Wrong choice! Tapping Yes for you 😉❤️");
  goToScreen('screen-photos');
}

/* 3D Flip Card */
function flipCard(cardInner) {
  cardInner.classList.toggle('flipped');
}

/* Swipe Photo Deck */
function swipeTopCard(e, cardId) {
  e.stopPropagation();
  const card = document.getElementById(cardId);
  if (card && !card.classList.contains('swiped')) {
    card.classList.add('swiped');
    swipedCards++;

    if (swipedCards >= totalCards) {
      const stack = document.getElementById('card-stack');
      const sub = document.getElementById('deck-sub');
      if (stack) stack.classList.add('shrink');
      if (sub) sub.style.display = 'none';
      document.getElementById('photo-finish-btn').style.display = 'block';
    }
  }
}

function openEnvelope() {
  const scroll = document.getElementById('letter-scroll');
  if (scroll) scroll.classList.add('active');
}

/* Scratch-Off Canvas Logic */
function initScratchCards() {
  ['canvas-1', 'canvas-2', 'canvas-3'].forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas || canvas.dataset.inited) return;
    canvas.dataset.inited = "true";

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#f8bbd0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '14px Poppins, sans-serif';
    ctx.fillStyle = '#880e4f';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal ✨', canvas.width / 2, canvas.height / 2 + 5);

    let isDrawing = false;

    function scratch(e) {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    ['mousedown', 'touchstart'].forEach(evt => canvas.addEventListener(evt, (e) => { isDrawing = true; scratch(e); }));
    ['mousemove', 'touchmove'].forEach(evt => canvas.addEventListener(evt, scratch));
    ['mouseup', 'touchend'].forEach(evt => canvas.addEventListener(evt, () => isDrawing = false));
  });
}

/* Parallax Tilt Physics */
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.tilt-card');
  const x = (window.innerWidth / 2 - e.pageX) / 30;
  const y = (window.innerHeight / 2 - e.pageY) / 30;

  cards.forEach(card => {
    card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });
});

/* Floating Petals Physics */
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = Array.from({ length: 25 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 8 + 6,
    speedY: Math.random() * 1 + 0.5,
    speedX: Math.random() * 0.5 - 0.25,
    rotation: Math.random() * 360,
    rotSpeed: Math.random() * 2 - 1
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

    petals.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > height) {
        p.y = -10;
        p.x = Math.random() * width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* Music Player Controls */
function toggleAudio() {
  const music = document.getElementById('bg-music');
  const btn = document.getElementById('audio-toggle-btn');

  if (music) {
    if (music.paused) {
      music.play();
      if (btn) btn.innerText = "⏸️";
    } else {
      music.pause();
      if (btn) btn.innerText = "▶️";
    }
  }
}

/* Candle Blowout */
document.addEventListener('DOMContentLoaded', () => {
  initPetals();

  const micBtn = document.getElementById('mic-btn');
  const flame = document.getElementById('candle-flame');

  if (micBtn) micBtn.addEventListener('click', enableMic);
  if (flame) flame.addEventListener('click', triggerBlowout);
});

async function enableMic() {
  const status = document.getElementById('mic-status');
  const btn = document.getElementById('mic-btn');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    microphone.connect(analyser);

    if (status) status.innerText = "🎙️ Mic active! BLOW into your mic now!";
    if (btn) btn.style.display = "none";

    listenForBlow();
  } catch (err) {
    if (status) status.innerText = "Mic blocked. Tap the flame directly to blow it out!";
  }
}

function listenForBlow() {
  if (isBlown || !analyser) return;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  let totalVolume = 0;
  for (let i = 0; i < dataArray.length; i++) {
    totalVolume += dataArray[i];
  }
  let averageVolume = totalVolume / dataArray.length;

  if (averageVolume > 38) {
    triggerBlowout();
    return;
  }

  requestAnimationFrame(listenForBlow);
}

function triggerBlowout() {
  if (isBlown) return;
  isBlown = true;

  const flame = document.getElementById('candle-flame');
  const status = document.getElementById('mic-status');
  const modal = document.getElementById('wish-modal');

  if (flame) flame.classList.add('out');
  if (status) status.innerText = "✨ Wish granted! ✨";

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ec407a', '#f8bbd0', '#ffda79', '#ffffff']
    });
  }

  setTimeout(() => {
    if (modal) modal.classList.add('active');
  }, 700);
}

function closeWishModal() {
  const modal = document.getElementById('wish-modal');
  if (modal) modal.classList.remove('active');
}

