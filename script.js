// --- STATE MANAGEMENT ---
let currentPin = '';
const correctPin = '0910';
let candleBlown = false;

// Data for 5 Photos
const cardsData = [
  { img: 'photo1.jpg', caption: 'Endless Late Chats ✨', title: 'A Special Note 💌', text: 'Thank you for bringing so much brightness into every single conversation!' },
  { img: 'photo2.jpg', caption: 'Good Vibes Always 🌸', title: 'Always Dependable 🌟', text: 'Talking to you always turns an ordinary day into something cheerful.' },
  { img: 'photo3.jpg', caption: 'Main Character Energy 🤍', title: 'Truly One of a Kind ✨', text: 'Never lose your effortless charm, humor, and awesome spirit!' },
  { img: 'photo4.jpg', caption: 'Pure Joy & Smiles 🌼', title: 'Unfiltered Laughter 😂', text: 'For all the random giggles, fun banter, and shared jokes.' },
  { img: 'photo5.jpg', caption: 'Best Memories Ahead 💫', title: 'To Another Great Year 🎉', text: 'Wishing you the happiest year ahead full of success and pure joy!' }
];

// Jar Reasons Data
const jarNotes = [
  "✨ Your sense of humor always brightens up the entire conversation.",
  "🌸 You bring effortless positive energy every single time we talk.",
  "✨ Thank you for being such a genuine, fun, and reliable friend.",
  "🌸 10/10 main character energy in every text message!",
  "✨ Even across distance, your friendship means so much."
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  setupGift();
  setupKeypad();
});

// --- STEP 1: GIFT UNWRAP ---
function setupGift() {
  const giftBtn = document.getElementById('gift-btn');
  giftBtn.addEventListener('click', () => {
    // Play Music safely
    const audio = document.getElementById('bg-music');
    if (audio) audio.play().catch(() => {});

    switchCard('step-gift', 'step-lock');
  });
}

// --- CARD SWITCHER ---
function switchCard(hideId, showId) {
  const hideElem = document.getElementById(hideId);
  const showElem = document.getElementById(showId);

  if (hideElem) hideElem.classList.remove('active');
  if (showElem) showElem.classList.add('active');
}

// --- STEP 2: KEYPAD LOCK ---
function setupKeypad() {
  document.querySelectorAll('.key[data-val]').forEach(key => {
    key.addEventListener('click', () => {
      if (currentPin.length < 4) {
        currentPin += key.getAttribute('data-val');
        updatePinDots();
        if (currentPin.length === 4) {
          setTimeout(validatePin, 150);
        }
      }
    });
  });

  document.getElementById('key-del').addEventListener('click', () => {
    currentPin = currentPin.slice(0, -1);
    updatePinDots();
  });
}

function updatePinDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) dot.classList.toggle('filled', i < currentPin.length);
  }
}

function validatePin() {
  if (currentPin === correctPin) {
    // Hide lock screen
    const lockScreen = document.getElementById('step-lock');
    if (lockScreen) lockScreen.classList.remove('active');

    // Show main content
    const mainContent = document.getElementById('step-main');
    if (mainContent) {
      mainContent.classList.add('active');
      mainContent.style.display = 'flex'; // Ensures visibility on mobile browsers
    }

    // Build interactive elements
    initDeck();
    initScratchCards();
  } else {
    alert('Incorrect PIN! Try again.');
    currentPin = '';
    updatePinDots();
  }
}


// --- STEP 3: CANDLE BLOW ---
function blowOutCandle() {
  if (candleBlown) return;
  candleBlown = true;

  const flame = document.getElementById('flame');
  if (flame) flame.style.display = 'none';

  document.querySelector('.wish-controls').style.display = 'none';
  document.getElementById('wish-instruction').innerText = "Your wish has been launched into the universe! ✨";
  document.getElementById('wish-message').style.display = 'block';
}

async function initMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const mic = audioCtx.createMediaStreamSource(stream);
    mic.connect(analyser);
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);

    function checkSound() {
      if (candleBlown) return;
      analyser.getByteFrequencyData(data);
      let volume = data.reduce((a, b) => a + b, 0) / data.length;
      if (volume > 38) {
        blowOutCandle();
        stream.getTracks().forEach(t => t.stop());
      } else {
        requestAnimationFrame(checkSound);
      }
    }
    checkSound();
  } catch (err) {
    alert("Microphone permission denied. Use the 'Tap to Blow' button instead!");
  }
}

// --- 3D DECK OF CARDS ---
function initDeck() {
  const container = document.getElementById('deck-container');
  container.innerHTML = '';

  cardsData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card-item';
    card.style.zIndex = cardsData.length - index;

    card.innerHTML = `
      <div class="card-front">
        <img src="${item.img}" alt="Photo" onerror="this.src='https://via.placeholder.com/300x200?text=Photo+${index+1}'">
        <span class="card-caption">${item.caption}</span>
        <button class="action-btn secondary" onclick="event.stopPropagation(); swipeCard(this)">Next ➔</button>
      </div>
      <div class="card-back">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    container.appendChild(card);
  });
}

function swipeCard(btn) {
  const card = btn.closest('.card-item');
  if (card) card.classList.add('swiped');
}

// --- REASON JAR ---
function drawJarNote() {
  const randomIndex = Math.floor(Math.random() * jarNotes.length);
  document.getElementById('jar-text').innerText = `"${jarNotes[randomIndex]}"`;
}

// --- SCRATCH CARDS ---
function initScratchCards() {
  document.querySelectorAll('.scratch-canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill scratch surface
    ctx.fillStyle = '#f48fb1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#702632';
    ctx.font = '600 12px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal ✨', canvas.width / 2, canvas.height / 2 + 4);

    let isScratching = false;

    const scratch = (e) => {
      if (!isScratching) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
    };

    ['mousedown', 'touchstart'].forEach(evt => canvas.addEventListener(evt, (e) => { isScratching = true; scratch(e); }));
    ['mousemove', 'touchmove'].forEach(evt => canvas.addEventListener(evt, scratch));
    ['mouseup', 'touchend'].forEach(evt => canvas.addEventListener(evt, () => isScratching = false));
  });
}

// --- BACKGROUND CANVAS ANIMATION ---
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const petals = Array.from({ length: 22 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 5 + 3,
    sy: Math.random() * 0.8 + 0.4,
    sx: Math.random() * 0.4 - 0.2
  }));

  function render() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(244, 143, 177, 0.45)';
    petals.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.sy;
      p.x += p.sx;
      if (p.y > h) { p.y = -10; p.x = Math.random() * w; }
    });
    requestAnimationFrame(render);
  }

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  render();
}
