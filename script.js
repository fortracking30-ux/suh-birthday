let audioContext;
let analyser;
let microphone;
let isBlown = false;

async function enableMic() {
  const status = document.getElementById('mic-status');
  const btn = document.getElementById('mic-btn');
  const music = document.getElementById('bg-music');

  if (music) {
    music.play().catch(e => console.log("Audio playback waiting for interaction:", e));
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    microphone.connect(analyser);

    if (status) status.innerText = "🎙️ Microphone active! BLOW directly into your mic now!";
    if (btn) btn.style.display = "none";

    listenForBlow();
  } catch (err) {
    if (status) status.innerText = "Mic access denied. Tap the flame directly to blow it out!";
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

  if (flame) flame.classList.add('out');
  if (status) status.innerText = "✨ Happy Birthday Suh! Wish granted! ✨";

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
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mic-btn');
  const flame = document.getElementById('candle-flame');

  if (btn) btn.addEventListener('click', enableMic);
  if (flame) flame.addEventListener('click', triggerBlowout);
});
