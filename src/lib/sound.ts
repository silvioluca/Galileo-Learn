let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return null;
    ctx = new AudioCtor();
  }
  return ctx;
}

function tone(
  frequency: number,
  startTime: number,
  duration: number,
  audio: AudioContext,
  peakGain = 0.15,
  type: OscillatorType = "sine",
  attack = 0.015,
) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/** Breve arpeggio ascendente: feedback sonoro per risposta corretta. */
export function playCorrectSound(): void {
  const audio = getContext();
  if (!audio) return;
  const now = audio.currentTime;
  tone(587.33, now, 0.14, audio); // re5
  tone(880, now + 0.09, 0.18, audio); // la5
}

/** Breve tono discendente: feedback sonoro per risposta errata. */
export function playIncorrectSound(): void {
  const audio = getContext();
  if (!audio) return;
  const now = audio.currentTime;
  tone(220, now, 0.16, audio, 0.12); // la3
  tone(174.61, now + 0.08, 0.18, audio, 0.12); // fa3
}

/** Tick leggero e breve: feedback mentre si trascina un punto (uno scatto per valore). */
export function playTickSound(): void {
  const audio = getContext();
  if (!audio) return;
  tone(1400, audio.currentTime, 0.03, audio, 0.05, "sine", 0.002);
}

/** Tocco morbido, come una carta poggiata sul tavolo: feedback quando una
 * tessera numerica viene rilasciata in una casella. Rumore filtrato invece di
 * un tono puro, per un timbro caldo e non elettronico. */
export function playClackSound(): void {
  const audio = getContext();
  if (!audio) return;
  const now = audio.currentTime;
  const duration = 0.09;

  const bufferSize = Math.max(1, Math.floor(audio.sampleRate * duration));
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) ** 2;
  }

  const noise = audio.createBufferSource();
  noise.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 700;
  filter.Q.value = 0.7;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  noise.start(now);
  noise.stop(now + duration);
}
