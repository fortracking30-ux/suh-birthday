let enteredPin = "";
const correctPin = "0910";
let swipedCards = 0;
const totalCards = 5;

let audioContext;
let analyser;
let microphone;
let isBlown = false;

function goToScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

/* Stacked Photo Cards Swipe */
function nextPhotoCard() {
  const stack = document.getElementById('card-stack');
  const cards = stack.getElementsByClassName('stacked-card');
  const visibleCards = Array.from(cards).filter(c => !c.classList.contains('swiped'));

  if (visibleCards.length > 0) {
    const topCard = visibleCards[visibleCards.length - 1];
    topCard.classList.add('swiped');
    swipedCards++;

    if (swipedCards >= totalCards) {
      document.getElementById('photo-finish-btn').style.display = 'block';
    }
  }
}

function openEnvelope() {
  const scroll = document.getElementById('letter-scroll');
  if (scroll) scroll.classList.add('active');
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
