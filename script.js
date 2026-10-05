let audioContext;
let analyser;
let microphone;
let isBlown = false;

function goToPage(pageNumber) {
  // Play music on first navigation click
  const music = document.getElementById('bg-music');
  if (music && music.paused) {
    music.play().catch(e => console.log("Audio deferred:", e));
  }

  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  // Show requested page
  const targetPage = document.getElementById(`page-${pageNumber}`);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function playfulNo() {
  alert("Wrong answer! Tapping Yes for you 😉❤️");
  goToPage(1);
}

document.addEventListener('DOMContentLoaded', () => {
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
      colors: ['#ff85a1', '#f7cad0', '#ffda79', '#ffffff']
    });
  }

  setTimeout(() => {
    if (modal) modal.classList.add('active');
  }, 700);
}
