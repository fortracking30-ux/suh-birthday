let enteredPin = "";
const correctPin = "0910"; // Secret passcode

const jarNotes = [
  "✨ Your sense of humor always turns ordinary chats into the best conversations.",
  "🌸 You bring so much positive energy every single time we talk.",
  "✨ Thank you for being such a genuine, fun, and amazing friend.",
  "🌸 10/10 main character energy in every text!",
  "✨ Even across distance, your friendship means so much!"
];

function openGift() {
  const music = document.getElementById('bg-music');
  if (music) music.play().catch(e => console.log(e));
  
  document.getElementById('sec-gift').classList.remove('active');
  document.getElementById('sec-lock').classList.add('active');
}

function pressKey(num) {
  if (enteredPin.length < 4) {
    enteredPin += num;
    updateDots();
    if (enteredPin.length === 4) setTimeout(checkPin, 200);
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
    if (dot) dot.classList.toggle('filled', i < enteredPin.length);
  }
}

function checkPin() {
  if (enteredPin === correctPin) {
    document.getElementById('sec-lock').classList.remove('active');
    document.getElementById('sec-main').classList.add('active');
    initScratchCards();
    initPetals();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  } else {
    alert("Incorrect passkey! Try again.");
    enteredPin = "";
    updateDots();
  }
}

function flipCard(cardInner) {
  cardInner.classList.toggle('flipped');
}

function swipeTopCard(e, cardId) {
  e.stopPropagation();
  const card = document.getElementById(cardId);
  if (card) card.classList.add('swiped');
}

function drawJarNote() {
  const randomNote = jarNotes[Math.floor(Math.random() * jarNotes.length)];
  const display = document.getElementById('jar-note-text');
  if (display) {
    display.style.opacity = 0;
    setTimeout(() => {
      display.innerText = `"${randomNote}"`;
      display.style.opacity = 1;
    }, 150);
  }
}

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
    
    ctx.font = '14px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#8c3a50';
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

function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const petals = Array.from({ length: 20 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 6 + 4,
    speedY: Math.random() * 0.8 + 0.4,
    speedX: Math.random() * 0.4 - 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(248, 187, 208, 0.6)';

    petals.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y > height) { p.y = -10; p.x = Math.random() * width; }
    });

    requestAnimationFrame(animate);
  }
  animate();
}
