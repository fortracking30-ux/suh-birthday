let pin = '';
const correctPin = '0910';
let candleBlown = false;

// Restored exact photo captions & back note texts
const cardsData = [
  { img: 'photo1.jpg', caption: 'That’s all my favorite photo of yours ✨', title: 'Favorite Photo 🤍', text: 'This photo easily takes the top spot. Absolutely love this one!' },
  { img: 'photo2.jpg', caption: 'That’s all my favorite photo of yours 🌸', title: 'Favorite Photo 🌸', text: 'Another incredible picture that captures your best vibe!' },
  { img: 'photo3.jpg', caption: 'That’s all my favorite photo of yours 🤍', title: 'Favorite Photo ✨', text: 'Effortless style and pure charm right here.' },
  { img: 'photo4.jpg', caption: 'That’s all my favorite photo of yours 🌼', title: 'Favorite Photo 😂', text: 'Always bringing out the best energy and brightest smile.' },
  { img: 'photo5.jpg', caption: 'That’s all my favorite photo of yours 💫', title: 'Favorite Photo 🎉', text: 'One of the best captures, truly one of a kind!' }
];

const jarNotes = [
  "✨ Your sense of humor always turns ordinary chats into the best conversations.",
  "🌸 You bring so much positive energy every single time we talk.",
  "✨ Thank you for being such a genuine, fun, and amazing friend.",
  "🌸 10/10 main character energy in every text!",
  "✨ Even across distance, your friendship means so much!"
];

document.addEventListener('DOMContentLoaded', () => {
  setupGift();
  setupKeypad();
  setupCandle();
  setupJar();
});

function setupGift() {
  const giftBtn = document.getElementById('gift-btn');
  giftBtn.addEventListener('click', () => {
    const audio = document.getElementById('bg-music');
    if (audio) audio.play().catch(() => {});
    
    document.getElementById('screen-gift').classList.remove('active');
    document.getElementById('screen-lock').classList.add('active');
  });
}

function setupKeypad() {
  document.querySelectorAll('.key[data-val]').forEach(key => {
    key.addEventListener('click', () => {
      if (pin.length < 4) {
        pin += key.getAttribute('data-val');
        updateDots();
        if (pin.length === 4) {
          setTimeout(checkPin, 150);
        }
      }
    });
  });

  document.getElementById('key-del').addEventListener('click', () => {
    pin = pin.slice(0, -1);
    updateDots();
  });
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) dot.classList.toggle('filled', i < pin.length);
  }
}

function checkPin() {
  if (pin === correctPin) {
    document.getElementById('screen-lock').classList.remove('active');
    const main = document.getElementById('screen-main');
    main.classList.add('active');
    
    initCards();
    initScratchCards();

    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  } else {
    alert('Incorrect passkey! Try again.');
    pin = '';
    updateDots();
  }
}

function setupCandle() {
  document.getElementById('flame').addEventListener('click', blowOutCandle);
  document.getElementById('tap-blow-btn').addEventListener('click', blowOutCandle);
  document.getElementById('mic-btn').addEventListener('click', startMicBlow);
}

function blowOutCandle() {
  if (candleBlown) return;
  candleBlown = true;
  document.getElementById('flame').style.display = 'none';
  document.getElementById('candle-controls').style.display = 'none';
  document.getElementById('wish-success').style.display = 'block';
  document.getElementById('candle-subtitle').innerText = "Your wish has been sent into the universe! ✨";
  
  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  }
}

async function startMicBlow() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const mic = audioCtx.createMediaStreamSource(stream);
    mic.connect(analyser);
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);

    function check() {
      if (candleBlown) return;
      analyser.getByteFrequencyData(data);
      let sum = data.reduce((a, b) => a + b, 0);
      if (sum / data.length > 38) {
        blowOutCandle();
        stream.getTracks().forEach(t => t.stop());
      } else {
        requestAnimationFrame(check);
      }
    }
    check();
  } catch (e) {
    alert("Mic access unavailable. Tap the flame or button instead!");
  }
}

function initCards() {
  const deck = document.getElementById('card-deck');
  deck.innerHTML = '';
  cardsData.forEach((c, idx) => {
    const card = document.createElement('div');
    card.className = 'card-item';
    card.style.zIndex = cardsData.length - idx;
    card.innerHTML = `
      <div class="card-front">
        <img src="${c.img}" alt="Photo" onerror="this.src='https://via.placeholder.com/300x200?text=Photo+${idx+1}'">
        <p style="font-family:'Cormorant Garamond',serif; font-weight:600; font-size:1.05rem; color:#702632;">${c.caption}</p>
        <button class="btn btn-secondary swipe-btn">Next ➔</button>
      </div>
      <div class="card-back">
        <h3 style="font-size:1.3rem; margin-bottom:8px;">${c.title}</h3>
        <p style="font-size:0.85rem; color:#555; line-height:1.4;">${c.text}</p>
      </div>
    `;

    card.querySelector('.swipe-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.add('swiped');
    });

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    deck.appendChild(card);
  });
}

function setupJar() {
  document.getElementById('jar-card').addEventListener('click', () => {
    const rand = jarNotes[Math.floor(Math.random() * jarNotes.length)];
    document.getElementById('jar-text').innerText = `"${rand}"`;
  });
}

function initScratchCards() {
  [0, 1, 2].forEach(idx => {
    const canvas = document.getElementById(`scratch-${idx}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#f8bbd0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#702632';
    ctx.font = '12px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal ✨', canvas.width / 2, canvas.height / 2 + 4);

    let drawing = false;
    const scratch = (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
    };

    ['mousedown', 'touchstart'].forEach(evt => canvas.addEventListener(evt, (e) => { drawing = true; scratch(e); }));
    ['mousemove', 'touchmove'].forEach(evt => canvas.addEventListener(evt, scratch));
    ['mouseup', 'touchend'].forEach(evt => canvas.addEventListener(evt, () => drawing = false));
  });
}
