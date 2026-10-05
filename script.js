let currentSlide = 0;
let slides;
let totalSlides = 0;

let audioContext;
let analyser;
let microphone;
let isBlown = false;

document.addEventListener('DOMContentLoaded', () => {
  slides = document.querySelectorAll('.slide');
  totalSlides = slides.length;

  const welcomeOverlay = document.getElementById('welcome-overlay');
  const startBtn = document.getElementById('start-btn');
  const music = document.getElementById('bg-music');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (music) {
        music.currentTime = 0;
        music.play().catch(e => console.log("Audio play deferred:", e));
      }
      if (welcomeOverlay) {
        welcomeOverlay.classList.add('hidden');
      }
    });
  }

  // Slideshow Controls
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

  // Blowout & Modal Logic
  const micBtn = document.getElementById('mic-btn');
  const flame = document.getElementById('candle-flame');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (micBtn) micBtn.addEventListener('click', enableMic);
  if (flame) flame.addEventListener('click', triggerBlowout);
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      document.getElementById('wish-modal').classList.remove('active');
    });
  }
});

function changeSlide(direction) {
  if (!slides || totalSlides === 0) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  slides[currentSlide].classList.add('active');
  
  const counter = document.getElementById('slide-counter');
  if (counter) {
    counter.innerText = `${currentSlide + 1} / ${totalSlides}`;
  }
}

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

    if (status) status.innerText = "🎙️ Mic active! BLOW directly into your microphone now!";
    if (btn) btn.style.display = "none";

    listenForBlow();
  } catch (err) {
    if (status) status.innerText = "Mic access blocked. Tap the flame directly to blow it out!";
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

  // Confetti Blast
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#f3d2cf', '#a4c3b2', '#ffda79', '#ffffff']
  });

  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }, 350);

  // Show special message pop-up
  setTimeout(() => {
    if (modal) modal.classList.add('active');
  }, 800);
}
