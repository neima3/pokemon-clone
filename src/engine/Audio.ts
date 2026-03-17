/**
 * Chip-tune audio system using Web Audio API.
 * All sounds are procedurally generated — no external files needed.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let currentMusic: { stop: () => void } | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(ctx.destination);

    musicGain = ctx.createGain();
    musicGain.gain.value = 0.4;
    musicGain.connect(masterGain);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.6;
    sfxGain.connect(masterGain);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// ── Helpers ──

type WaveType = OscillatorType;

function playTone(freq: number, duration: number, type: WaveType = 'square', dest?: AudioNode, startTime?: number): OscillatorNode {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (startTime ?? 0) + duration);
  osc.connect(gain);
  gain.connect(dest ?? sfxGain!);
  const start = c.currentTime + (startTime ?? 0);
  osc.start(start);
  osc.stop(start + duration);
  return osc;
}

function playNoise(duration: number, startTime = 0) {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.15, c.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startTime + duration);
  source.connect(gain);
  gain.connect(sfxGain!);
  source.start(c.currentTime + startTime);
}

// ── Note frequencies ──

const NOTE: Record<string, number> = {
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, Db5: 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50,
};

// ── Sound Effects ──

export const SFX = {
  menuSelect() {
    playTone(NOTE.E5, 0.08, 'square');
  },

  menuConfirm() {
    playTone(NOTE.C5, 0.06, 'square');
    playTone(NOTE.E5, 0.06, 'square', sfxGain!, 0.06);
    playTone(NOTE.G5, 0.1, 'square', sfxGain!, 0.12);
  },

  menuCancel() {
    playTone(NOTE.E4, 0.06, 'square');
    playTone(NOTE.C4, 0.1, 'square', sfxGain!, 0.06);
  },

  encounter() {
    // Dramatic rising arpeggio
    const notes = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5];
    notes.forEach((n, i) => {
      playTone(n, 0.12, 'square', sfxGain!, i * 0.06);
    });
    playNoise(0.15, 0.02);
  },

  attackHit() {
    playNoise(0.08);
    playTone(NOTE.G3, 0.1, 'square');
  },

  attackMiss() {
    playTone(NOTE.B3, 0.15, 'sine');
    playTone(NOTE.G3, 0.2, 'sine', sfxGain!, 0.1);
  },

  superEffective() {
    playTone(NOTE.C5, 0.08, 'square');
    playTone(NOTE.E5, 0.08, 'square', sfxGain!, 0.08);
    playTone(NOTE.G5, 0.08, 'square', sfxGain!, 0.16);
    playTone(NOTE.C6, 0.15, 'square', sfxGain!, 0.24);
  },

  notEffective() {
    playTone(NOTE.E4, 0.12, 'triangle');
    playTone(NOTE.C4, 0.18, 'triangle', sfxGain!, 0.1);
  },

  faint() {
    const notes = [NOTE.E4, NOTE.D4, NOTE.C4, NOTE.B3, NOTE.A3, NOTE.G3];
    notes.forEach((n, i) => {
      playTone(n, 0.15, 'square', sfxGain!, i * 0.1);
    });
  },

  levelUp() {
    const notes = [NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.A5, NOTE.C6];
    notes.forEach((n, i) => {
      playTone(n, 0.1, 'square', sfxGain!, i * 0.08);
    });
  },

  catchBall() {
    playTone(NOTE.G4, 0.1, 'square');
    playTone(NOTE.C5, 0.15, 'square', sfxGain!, 0.08);
  },

  catchShake() {
    playTone(NOTE.E4, 0.06, 'square');
    playTone(NOTE.G4, 0.06, 'square', sfxGain!, 0.08);
    playTone(NOTE.E4, 0.06, 'square', sfxGain!, 0.16);
  },

  catchSuccess() {
    const notes = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6];
    notes.forEach((n, i) => {
      playTone(n, 0.15, 'square', sfxGain!, i * 0.12);
    });
  },

  catchFail() {
    playTone(NOTE.G4, 0.1, 'square');
    playTone(NOTE.E4, 0.1, 'square', sfxGain!, 0.1);
    playTone(NOTE.C4, 0.15, 'square', sfxGain!, 0.2);
  },

  heal() {
    const notes = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.G5, NOTE.C6];
    notes.forEach((n, i) => {
      playTone(n, 0.12, 'triangle', sfxGain!, i * 0.1);
    });
  },

  evolve() {
    const notes = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.C6];
    notes.forEach((n, i) => {
      playTone(n, 0.18, 'square', sfxGain!, i * 0.14);
    });
  },

  save() {
    playTone(NOTE.E5, 0.08, 'triangle');
    playTone(NOTE.G5, 0.08, 'triangle', sfxGain!, 0.1);
    playTone(NOTE.E5, 0.12, 'triangle', sfxGain!, 0.2);
  },

  bump() {
    playTone(80, 0.06, 'square');
  },

  purchase() {
    playTone(NOTE.C5, 0.06, 'square');
    playTone(NOTE.E5, 0.06, 'square', sfxGain!, 0.08);
    playTone(NOTE.G5, 0.06, 'square', sfxGain!, 0.16);
    playTone(NOTE.C6, 0.12, 'square', sfxGain!, 0.24);
  },

  damage() {
    playNoise(0.06);
    playTone(200, 0.08, 'sawtooth');
  },

  run() {
    playTone(NOTE.G4, 0.06, 'square');
    playTone(NOTE.A4, 0.06, 'square', sfxGain!, 0.06);
    playTone(NOTE.B4, 0.06, 'square', sfxGain!, 0.12);
    playTone(NOTE.C5, 0.1, 'square', sfxGain!, 0.18);
  },

  victory() {
    // Classic Pokemon victory fanfare
    const notes = [NOTE.C5, NOTE.C5, NOTE.C5, NOTE.C5, NOTE.A4, NOTE.B4, NOTE.C5, NOTE.B4, NOTE.C5];
    const durs = [0.12, 0.12, 0.12, 0.2, 0.12, 0.12, 0.2, 0.1, 0.3];
    let time = 0;
    notes.forEach((n, i) => {
      playTone(n, durs[i], 'square', sfxGain!, time);
      time += durs[i];
    });
  },

  shinySparkle() {
    // Magical shimmering sparkle sound
    const notes = [NOTE.E5, NOTE.G5, NOTE.B5, NOTE.E5, NOTE.G5, NOTE.B5, NOTE.C6];
    notes.forEach((n, i) => {
      playTone(n, 0.08, 'sine', sfxGain!, i * 0.05);
    });
    playTone(NOTE.C6, 0.2, 'sine', sfxGain!, 0.35);
  },

  criticalHit() {
    // Sharp, impactful critical hit sound
    playTone(NOTE.G5, 0.04, 'square');
    playTone(NOTE.C6, 0.04, 'square', sfxGain!, 0.04);
    playTone(NOTE.E6, 0.08, 'square', sfxGain!, 0.08);
    playNoise(0.05, 0.02);
  },

  badgeGet() {
    // Triumphant badge fanfare
    const notes = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.G5, NOTE.E5, NOTE.C6];
    const durs = [0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.3];
    let time = 0;
    notes.forEach((n, i) => {
      playTone(n, durs[i], 'triangle', sfxGain!, time);
      time += durs[i] * 0.8;
    });
  },

  weatherChange() {
    // Subtle environmental shift sound
    playTone(NOTE.E4, 0.15, 'sine');
    playTone(NOTE.G4, 0.15, 'sine', sfxGain!, 0.1);
    playTone(NOTE.B4, 0.2, 'sine', sfxGain!, 0.2);
  },

  itemGet() {
    // Item pickup jingle
    const notes = [NOTE.G4, NOTE.A4, NOTE.B4, NOTE.C5];
    notes.forEach((n, i) => {
      playTone(n, 0.08, 'square', sfxGain!, i * 0.07);
    });
  },

  expGain() {
    // Quick EXP gain blip
    playTone(NOTE.C5, 0.06, 'triangle');
    playTone(NOTE.E5, 0.08, 'triangle', sfxGain!, 0.05);
  },

  pokemonHealed() {
    // Healing center jingle
    const notes = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.G5, NOTE.C6];
    notes.forEach((n, i) => {
      playTone(n, 0.1, 'triangle', sfxGain!, i * 0.08);
    });
  },

  runToggle() {
    // Toggle running shoes
    playTone(NOTE.C5, 0.05, 'square');
    playTone(NOTE.G5, 0.08, 'square', sfxGain!, 0.05);
  },

  newGame() {
    // Triumphant ascending fanfare for starting a new game
    const notes = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.C6];
    const durs = [0.1, 0.1, 0.1, 0.1, 0.12, 0.12, 0.15, 0.3];
    let time = 0;
    notes.forEach((n, i) => {
      playTone(n, durs[i], 'square', sfxGain!, time);
      time += durs[i] * 0.85;
    });
  },
};

// ── Music ──

interface MusicPattern {
  notes: Array<{ freq: number; dur: number }>;
  tempo: number; // beats per second
}

function buildBattlePattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 6,
    notes: [
      // Bar 1 - aggressive minor feel
      { freq: n.A3, dur: 0.5 }, { freq: n.C4, dur: 0.5 },
      { freq: n.E4, dur: 0.5 }, { freq: n.A3, dur: 0.5 },
      { freq: n.C4, dur: 0.5 }, { freq: n.E4, dur: 0.25 }, { freq: n.D4, dur: 0.25 },
      // Bar 2
      { freq: n.C4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.G4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.C4, dur: 0.5 }, { freq: n.D4, dur: 0.5 },
      // Bar 3
      { freq: n.F3, dur: 0.5 }, { freq: n.A3, dur: 0.5 },
      { freq: n.C4, dur: 0.5 }, { freq: n.F3, dur: 0.5 },
      { freq: n.A3, dur: 0.5 }, { freq: n.C4, dur: 0.25 }, { freq: n.B3, dur: 0.25 },
      // Bar 4 - resolution
      { freq: n.G3, dur: 0.5 }, { freq: n.B3, dur: 0.5 },
      { freq: n.D4, dur: 0.5 }, { freq: n.G4, dur: 0.5 },
      { freq: n.E4, dur: 0.25 }, { freq: n.D4, dur: 0.25 }, { freq: n.C4, dur: 0.5 },
    ],
  };
}

function buildBattleBass(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 3,
    notes: [
      { freq: n.A3, dur: 1 }, { freq: n.A3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.C4, dur: 1 }, { freq: n.G3, dur: 0.5 }, { freq: n.C4, dur: 0.5 },
      { freq: n.F3, dur: 1 }, { freq: n.F3, dur: 0.5 }, { freq: n.C4, dur: 0.5 },
      { freq: n.G3, dur: 1 }, { freq: n.G3, dur: 0.5 }, { freq: n.D4, dur: 0.5 },
    ],
  };
}

function buildOverworldPattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 4,
    notes: [
      // Cheerful major key
      { freq: n.C4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.G4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.F4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.G4, dur: 1 },
      // Second phrase
      { freq: n.E4, dur: 0.5 }, { freq: n.D4, dur: 0.5 },
      { freq: n.C4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.D4, dur: 0.5 }, { freq: n.C4, dur: 0.5 },
      { freq: n.G3, dur: 1 },
      // Third phrase
      { freq: n.C4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.G4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.G4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.C5, dur: 1 },
      // Resolve
      { freq: n.B4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.G4, dur: 0.5 }, { freq: n.F4, dur: 0.5 },
      { freq: n.E4, dur: 0.5 }, { freq: n.D4, dur: 0.5 },
      { freq: n.C4, dur: 1 },
    ],
  };
}

function buildGymBattlePattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 7,
    notes: [
      // Bar 1 - intense, dramatic
      { freq: n.E4, dur: 0.25 }, { freq: n.E4, dur: 0.25 },
      { freq: n.G4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.G4, dur: 0.25 }, { freq: n.E4, dur: 0.25 },
      // Bar 2
      { freq: n.B4, dur: 0.5 }, { freq: n.A4, dur: 0.25 }, { freq: n.G4, dur: 0.25 },
      { freq: n.E4, dur: 0.5 }, { freq: n.D4, dur: 0.5 },
      // Bar 3 - rising tension
      { freq: n.C4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.G4, dur: 0.5 }, { freq: n.B4, dur: 0.5 },
      // Bar 4 - climax + resolve
      { freq: n.C5, dur: 0.5 }, { freq: n.B4, dur: 0.25 }, { freq: n.A4, dur: 0.25 },
      { freq: n.G4, dur: 0.5 }, { freq: n.E4, dur: 0.25 }, { freq: n.G4, dur: 0.25 },
      // Bar 5 - repeat with variation
      { freq: n.A4, dur: 0.25 }, { freq: n.A4, dur: 0.25 },
      { freq: n.C5, dur: 0.5 }, { freq: n.B4, dur: 0.5 },
      { freq: n.A4, dur: 0.25 }, { freq: n.G4, dur: 0.25 },
      // Bar 6 - resolve low
      { freq: n.F4, dur: 0.5 }, { freq: n.E4, dur: 0.25 }, { freq: n.D4, dur: 0.25 },
      { freq: n.C4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
    ],
  };
}

function buildGymBattleBass(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 3.5,
    notes: [
      { freq: n.E3, dur: 0.5 }, { freq: n.E3, dur: 0.25 }, { freq: n.G3, dur: 0.25 },
      { freq: n.A3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.C3, dur: 0.5 }, { freq: n.G3, dur: 0.5 },
      { freq: n.A3, dur: 0.5 }, { freq: n.B3, dur: 0.25 }, { freq: n.A3, dur: 0.25 },
      { freq: n.F3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.C3, dur: 0.5 }, { freq: n.G3, dur: 0.5 },
    ],
  };
}

function buildRoute4Pattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 5,
    notes: [
      // Energetic, electric-themed
      { freq: n.E4, dur: 0.25 }, { freq: n.E4, dur: 0.25 },
      { freq: n.G4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.G4, dur: 0.25 }, { freq: n.E4, dur: 0.25 },
      { freq: n.D4, dur: 0.5 },
      // Second phrase
      { freq: n.C4, dur: 0.25 }, { freq: n.E4, dur: 0.25 },
      { freq: n.G4, dur: 0.5 }, { freq: n.A4, dur: 0.25 },
      { freq: n.B4, dur: 0.25 }, { freq: n.C5, dur: 0.5 },
      { freq: n.B4, dur: 0.25 }, { freq: n.A4, dur: 0.25 },
      // Resolve
      { freq: n.G4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.C4, dur: 0.5 }, { freq: n.D4, dur: 0.25 },
      { freq: n.E4, dur: 0.25 }, { freq: n.G4, dur: 0.5 },
      { freq: n.E4, dur: 0.5 },
    ],
  };
}

function buildRoute5Pattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 4.5,
    notes: [
      // Mysterious, slightly dark — fire/grass theme
      { freq: n.A3, dur: 0.5 }, { freq: n.C4, dur: 0.5 },
      { freq: n.E4, dur: 0.25 }, { freq: n.F4, dur: 0.25 },
      { freq: n.E4, dur: 0.5 }, { freq: n.D4, dur: 0.5 },
      // Second phrase
      { freq: n.C4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.G4, dur: 0.5 }, { freq: n.A4, dur: 0.25 },
      { freq: n.G4, dur: 0.25 }, { freq: n.F4, dur: 0.5 },
      { freq: n.E4, dur: 0.5 },
      // Rising section
      { freq: n.D4, dur: 0.25 }, { freq: n.E4, dur: 0.25 },
      { freq: n.F4, dur: 0.5 }, { freq: n.G4, dur: 0.5 },
      { freq: n.A4, dur: 0.5 }, { freq: n.G4, dur: 0.25 },
      { freq: n.F4, dur: 0.25 }, { freq: n.E4, dur: 0.5 },
      // Resolve
      { freq: n.C4, dur: 0.5 }, { freq: n.D4, dur: 0.5 },
      { freq: n.E4, dur: 0.5 }, { freq: n.C4, dur: 0.5 },
      { freq: n.A3, dur: 1 },
    ],
  };
}

function buildRoute6Pattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 3,
    notes: [
      // Bar 1 - eerie minor opening, slow and haunting
      { freq: n.E3, dur: 1 }, { freq: n.Bb3, dur: 0.5 },
      { freq: n.A3, dur: 0.5 }, { freq: n.Ab3, dur: 1 },
      // Bar 2 - dissonant tritone intervals, psychic feel
      { freq: n.D4, dur: 0.5 }, { freq: n.Ab4, dur: 0.75 },
      { freq: n.G4, dur: 0.25 }, { freq: n.Fs4, dur: 0.5 },
      { freq: n.E4, dur: 0.5 }, { freq: n.Eb4, dur: 0.5 },
      // Bar 3 - ghostly descending chromatic
      { freq: n.Bb4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.Ab4, dur: 0.5 }, { freq: n.G4, dur: 0.5 },
      { freq: n.Fs4, dur: 0.5 }, { freq: n.F4, dur: 0.5 },
      // Bar 4 - low ominous sustain with creepy ascent
      { freq: n.E3, dur: 1 }, { freq: n.Bb3, dur: 0.5 },
      { freq: n.Db4, dur: 0.5 }, { freq: n.E4, dur: 0.75 },
      { freq: n.Eb4, dur: 0.25 },
      // Bar 5 - minor key wandering, unsettling
      { freq: n.C4, dur: 0.5 }, { freq: n.Eb4, dur: 0.5 },
      { freq: n.Fs4, dur: 0.75 }, { freq: n.G4, dur: 0.25 },
      { freq: n.Eb4, dur: 0.5 }, { freq: n.C4, dur: 0.5 },
      // Bar 6 - resolve to uneasy rest
      { freq: n.Bb3, dur: 0.5 }, { freq: n.A3, dur: 0.5 },
      { freq: n.Ab3, dur: 0.5 }, { freq: n.E3, dur: 1.5 },
    ],
  };
}

function buildRoute6Bass(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 2,
    notes: [
      { freq: n.E3, dur: 1 }, { freq: n.Bb3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.D3, dur: 1 }, { freq: n.Ab3, dur: 0.5 }, { freq: n.D3, dur: 0.5 },
      { freq: n.C3, dur: 1 }, { freq: n.Fs3, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
      { freq: n.E3, dur: 1 }, { freq: n.Bb3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.C3, dur: 1 }, { freq: n.Eb3, dur: 0.5 }, { freq: n.Fs3, dur: 0.5 },
      { freq: n.E3, dur: 1.5 }, { freq: n.E3, dur: 0.5 },
    ],
  };
}

function buildRoute7Pattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 3.5,
    notes: [
      // Bar 1 - dark, industrial, poison-themed
      { freq: n.C3, dur: 0.5 }, { freq: n.Eb3, dur: 0.25 },
      { freq: n.C3, dur: 0.25 }, { freq: n.Eb3, dur: 0.5 },
      { freq: n.Fs3, dur: 0.5 }, { freq: n.G3, dur: 0.5 },
      // Bar 2 - toxic bubbling feel
      { freq: n.Eb4, dur: 0.25 }, { freq: n.D4, dur: 0.25 },
      { freq: n.C4, dur: 0.5 }, { freq: n.Bb3, dur: 0.25 },
      { freq: n.Ab3, dur: 0.25 }, { freq: n.G3, dur: 0.5 },
      { freq: n.Fs3, dur: 0.5 },
      // Bar 3 - creeping chromatic ascent
      { freq: n.C3, dur: 0.5 }, { freq: n.Db4, dur: 0.25 },
      { freq: n.D4, dur: 0.25 }, { freq: n.Eb4, dur: 0.5 },
      { freq: n.E4, dur: 0.25 }, { freq: n.F4, dur: 0.25 },
      { freq: n.Fs4, dur: 0.5 },
      // Bar 4 - descend and resolve darkly
      { freq: n.G4, dur: 0.5 }, { freq: n.Eb4, dur: 0.5 },
      { freq: n.C4, dur: 0.5 }, { freq: n.Ab3, dur: 0.5 },
      { freq: n.G3, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
    ],
  };
}

function buildRoute7Bass(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 2,
    notes: [
      { freq: n.C3, dur: 1 }, { freq: n.Eb3, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
      { freq: n.Ab3, dur: 0.5 }, { freq: n.G3, dur: 0.5 }, { freq: n.Fs3, dur: 0.5 }, { freq: n.G3, dur: 0.5 },
      { freq: n.C3, dur: 1 }, { freq: n.Db4, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
      { freq: n.G3, dur: 1 }, { freq: n.C3, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
    ],
  };
}

function buildRoute8Pattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 5,
    notes: [
      // Bar 1 - fiery, intense volcanic theme in D minor
      { freq: n.D4, dur: 0.25 }, { freq: n.F4, dur: 0.25 },
      { freq: n.A4, dur: 0.5 }, { freq: n.D5, dur: 0.5 },
      { freq: n.C5, dur: 0.25 }, { freq: n.A4, dur: 0.25 },
      // Bar 2 - erupting energy
      { freq: n.Bb4, dur: 0.5 }, { freq: n.A4, dur: 0.25 },
      { freq: n.G4, dur: 0.25 }, { freq: n.F4, dur: 0.5 },
      { freq: n.E4, dur: 0.25 }, { freq: n.F4, dur: 0.25 },
      // Bar 3 - rising heat
      { freq: n.D4, dur: 0.5 }, { freq: n.F4, dur: 0.5 },
      { freq: n.A4, dur: 0.5 }, { freq: n.C5, dur: 0.5 },
      // Bar 4 - explosive climax
      { freq: n.D5, dur: 0.5 }, { freq: n.C5, dur: 0.25 },
      { freq: n.Bb4, dur: 0.25 }, { freq: n.A4, dur: 0.5 },
      { freq: n.F4, dur: 0.25 }, { freq: n.D4, dur: 0.75 },
      // Bar 5 - smoldering calm
      { freq: n.G4, dur: 0.25 }, { freq: n.A4, dur: 0.25 },
      { freq: n.Bb4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.G4, dur: 0.25 }, { freq: n.F4, dur: 0.25 },
      // Bar 6 - resolve with heat
      { freq: n.E4, dur: 0.5 }, { freq: n.F4, dur: 0.5 },
      { freq: n.D4, dur: 1 },
    ],
  };
}

function buildRoute8Bass(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 2.5,
    notes: [
      { freq: n.D3, dur: 1 }, { freq: n.A3, dur: 0.5 }, { freq: n.D3, dur: 0.5 },
      { freq: n.Bb3, dur: 0.5 }, { freq: n.A3, dur: 0.5 }, { freq: n.F3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.D3, dur: 1 }, { freq: n.F3, dur: 0.5 }, { freq: n.A3, dur: 0.5 },
      { freq: n.D3, dur: 0.5 }, { freq: n.Bb3, dur: 0.5 }, { freq: n.A3, dur: 0.5 }, { freq: n.D3, dur: 0.5 },
      { freq: n.G3, dur: 1 }, { freq: n.F3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.D3, dur: 1.5 }, { freq: n.D3, dur: 0.5 },
    ],
  };
}

function buildRoute9Pattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 5,
    notes: [
      // Bar 1 - dramatic march, E minor, final challenge theme
      { freq: n.E4, dur: 0.5 }, { freq: n.G4, dur: 0.25 }, { freq: n.B4, dur: 0.25 },
      { freq: n.E5, dur: 0.5 }, { freq: n.D5, dur: 0.25 }, { freq: n.B4, dur: 0.25 },
      // Bar 2 - tension builds
      { freq: n.C5, dur: 0.5 }, { freq: n.B4, dur: 0.25 }, { freq: n.A4, dur: 0.25 },
      { freq: n.G4, dur: 0.5 }, { freq: n.F4, dur: 0.25 }, { freq: n.E4, dur: 0.25 },
      // Bar 3 - powerful
      { freq: n.D4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.G4, dur: 0.5 }, { freq: n.B4, dur: 0.5 },
      // Bar 4 - rising
      { freq: n.A4, dur: 0.5 }, { freq: n.G4, dur: 0.25 }, { freq: n.F4, dur: 0.25 },
      { freq: n.E4, dur: 0.5 }, { freq: n.D4, dur: 0.25 }, { freq: n.E4, dur: 0.25 },
      // Bar 5 - climactic
      { freq: n.G4, dur: 0.25 }, { freq: n.A4, dur: 0.25 }, { freq: n.B4, dur: 0.5 },
      { freq: n.C5, dur: 0.5 }, { freq: n.B4, dur: 0.5 },
      // Bar 6 - resolve
      { freq: n.A4, dur: 0.5 }, { freq: n.G4, dur: 0.25 }, { freq: n.F4, dur: 0.25 },
      { freq: n.E4, dur: 1 },
    ],
  };
}

function buildRoute9Bass(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 2.5,
    notes: [
      { freq: n.E3, dur: 1 }, { freq: n.B3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.C3, dur: 1 }, { freq: n.G3, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
      { freq: n.D3, dur: 0.5 }, { freq: n.E3, dur: 0.5 }, { freq: n.G3, dur: 0.5 }, { freq: n.B3, dur: 0.5 },
      { freq: n.A3, dur: 0.5 }, { freq: n.G3, dur: 0.5 }, { freq: n.F3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.G3, dur: 1 }, { freq: n.A3, dur: 0.5 }, { freq: n.B3, dur: 0.5 },
      { freq: n.E3, dur: 1.5 }, { freq: n.E3, dur: 0.5 },
    ],
  };
}

function buildPokemonLeaguePattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 3,
    notes: [
      { freq: n.C4, dur: 1 }, { freq: n.G4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.B4, dur: 1 }, { freq: n.A4, dur: 0.5 }, { freq: n.G4, dur: 0.5 },
      { freq: n.E4, dur: 1 }, { freq: n.D4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.G4, dur: 1.5 },
      { freq: n.C4, dur: 1 }, { freq: n.E4, dur: 0.5 }, { freq: n.G4, dur: 0.5 },
      { freq: n.C5, dur: 1 }, { freq: n.B4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.G4, dur: 1 }, { freq: n.A4, dur: 0.5 }, { freq: n.G4, dur: 0.5 },
      { freq: n.E4, dur: 1.5 },
    ],
  };
}

function buildPokemonLeagueBass(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 1.5,
    notes: [
      { freq: n.C3, dur: 2 }, { freq: n.G3, dur: 2 },
      { freq: n.E3, dur: 2 }, { freq: n.G3, dur: 2 },
      { freq: n.A3, dur: 2 }, { freq: n.G3, dur: 2 },
      { freq: n.E3, dur: 2 }, { freq: n.C3, dur: 2 },
    ],
  };
}

function buildChampionPattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 6,
    notes: [
      { freq: n.E4, dur: 0.25 }, { freq: n.E4, dur: 0.25 },
      { freq: n.G4, dur: 0.5 }, { freq: n.A4, dur: 0.25 }, { freq: n.B4, dur: 0.25 },
      { freq: n.C5, dur: 0.5 }, { freq: n.B4, dur: 0.25 }, { freq: n.A4, dur: 0.25 },
      { freq: n.G4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.B4, dur: 0.25 }, { freq: n.A4, dur: 0.25 },
      { freq: n.G4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.D4, dur: 0.5 }, { freq: n.E4, dur: 0.25 }, { freq: n.G4, dur: 0.25 },
      { freq: n.A4, dur: 1 }, { freq: n.G4, dur: 0.5 },
      { freq: n.C5, dur: 0.5 }, { freq: n.B4, dur: 0.25 }, { freq: n.A4, dur: 0.25 },
      { freq: n.G4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.D4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.G4, dur: 1 },
    ],
  };
}

function buildChampionBass(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 3,
    notes: [
      { freq: n.E3, dur: 1 }, { freq: n.E3, dur: 0.5 }, { freq: n.B3, dur: 0.5 },
      { freq: n.C3, dur: 1 }, { freq: n.G3, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
      { freq: n.A3, dur: 1 }, { freq: n.E3, dur: 0.5 }, { freq: n.A3, dur: 0.5 },
      { freq: n.G3, dur: 1 }, { freq: n.E3, dur: 0.5 }, { freq: n.G3, dur: 0.5 },
      { freq: n.C3, dur: 1 }, { freq: n.G3, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
      { freq: n.E3, dur: 1.5 },
    ],
  };
}

function buildTitlePattern(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 4.5,
    notes: [
      // Bar 1 - majestic opening fanfare
      { freq: n.C4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.G4, dur: 1 }, { freq: n.C5, dur: 1 },
      // Bar 2 - heroic ascending phrase
      { freq: n.E5, dur: 0.5 }, { freq: n.D5, dur: 0.5 },
      { freq: n.C5, dur: 0.5 }, { freq: n.D5, dur: 0.5 },
      { freq: n.E5, dur: 1 },
      // Bar 3 - triumphant peak
      { freq: n.G5, dur: 0.5 }, { freq: n.E5, dur: 0.5 },
      { freq: n.C5, dur: 0.5 }, { freq: n.D5, dur: 0.5 },
      { freq: n.E5, dur: 0.5 }, { freq: n.G5, dur: 0.5 },
      { freq: n.A5, dur: 1 },
      // Bar 4 - noble descent
      { freq: n.G5, dur: 0.5 }, { freq: n.F5, dur: 0.5 },
      { freq: n.E5, dur: 0.5 }, { freq: n.D5, dur: 0.5 },
      { freq: n.C5, dur: 1 },
      // Bar 5 - second heroic phrase, variation
      { freq: n.G4, dur: 0.5 }, { freq: n.A4, dur: 0.5 },
      { freq: n.B4, dur: 0.5 }, { freq: n.C5, dur: 0.5 },
      { freq: n.D5, dur: 0.5 }, { freq: n.E5, dur: 0.5 },
      { freq: n.F5, dur: 0.5 }, { freq: n.G5, dur: 0.5 },
      // Bar 6 - grand resolution
      { freq: n.A5, dur: 0.5 }, { freq: n.G5, dur: 0.5 },
      { freq: n.E5, dur: 0.5 }, { freq: n.C5, dur: 0.5 },
      { freq: n.G4, dur: 0.5 }, { freq: n.E4, dur: 0.5 },
      { freq: n.C4, dur: 1 },
    ],
  };
}

function buildTitleBass(): MusicPattern {
  const n = NOTE;
  return {
    tempo: 2.5,
    notes: [
      { freq: n.C3, dur: 1 }, { freq: n.G3, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
      { freq: n.A3, dur: 1 }, { freq: n.E3, dur: 0.5 }, { freq: n.A3, dur: 0.5 },
      { freq: n.F3, dur: 1 }, { freq: n.C3, dur: 0.5 }, { freq: n.G3, dur: 0.5 },
      { freq: n.C3, dur: 1 }, { freq: n.G3, dur: 0.5 }, { freq: n.E3, dur: 0.5 },
      { freq: n.G3, dur: 1 }, { freq: n.D3, dur: 0.5 }, { freq: n.G3, dur: 0.5 },
      { freq: n.C3, dur: 1 }, { freq: n.G3, dur: 0.5 }, { freq: n.C3, dur: 0.5 },
    ],
  };
}

function playMusicLoop(patterns: Array<{ pattern: MusicPattern; type: WaveType; gainVal: number }>): { stop: () => void } {
  const c = getCtx();
  let running = true;
  const activeOscs: OscillatorNode[] = [];

  function scheduleLoop() {
    if (!running) return;

    for (const { pattern, type, gainVal } of patterns) {
      let time = c.currentTime + 0.05;

      for (const note of pattern.notes) {
        if (!running) return;
        const beatDur = note.dur / pattern.tempo;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = type;
        osc.frequency.value = note.freq;
        gain.gain.setValueAtTime(gainVal, time);
        gain.gain.setValueAtTime(gainVal, time + beatDur * 0.8);
        gain.gain.linearRampToValueAtTime(0, time + beatDur * 0.95);
        osc.connect(gain);
        gain.connect(musicGain!);
        osc.start(time);
        osc.stop(time + beatDur);
        activeOscs.push(osc);
        time += beatDur;
      }

      // Schedule next loop
      const totalDur = pattern.notes.reduce((s, n) => s + n.dur / pattern.tempo, 0);
      setTimeout(() => {
        // Clean up old oscillators
        while (activeOscs.length > 100) activeOscs.shift();
        if (running) scheduleLoop();
      }, totalDur * 1000 - 100);
    }
  }

  scheduleLoop();

  return {
    stop() {
      running = false;
      for (const osc of activeOscs) {
        try { osc.stop(); } catch { /* already stopped */ }
      }
      activeOscs.length = 0;
    },
  };
}

export const Music = {
  battle() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildBattlePattern(), type: 'square', gainVal: 0.15 },
      { pattern: buildBattleBass(), type: 'triangle', gainVal: 0.12 },
    ]);
  },

  gymBattle() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildGymBattlePattern(), type: 'square', gainVal: 0.18 },
      { pattern: buildGymBattleBass(), type: 'triangle', gainVal: 0.14 },
    ]);
  },

  overworld() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildOverworldPattern(), type: 'square', gainVal: 0.1 },
    ]);
  },

  route4() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildRoute4Pattern(), type: 'square', gainVal: 0.12 },
    ]);
  },

  route5() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildRoute5Pattern(), type: 'square', gainVal: 0.12 },
    ]);
  },

  route6() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildRoute6Pattern(), type: 'triangle', gainVal: 0.1 },
      { pattern: buildRoute6Bass(), type: 'sine', gainVal: 0.08 },
    ]);
  },

  route7() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildRoute7Pattern(), type: 'sawtooth', gainVal: 0.08 },
      { pattern: buildRoute7Bass(), type: 'triangle', gainVal: 0.1 },
    ]);
  },

  route8() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildRoute8Pattern(), type: 'square', gainVal: 0.14 },
      { pattern: buildRoute8Bass(), type: 'sawtooth', gainVal: 0.1 },
    ]);
  },

  route9() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildRoute9Pattern(), type: 'square', gainVal: 0.14 },
      { pattern: buildRoute9Bass(), type: 'triangle', gainVal: 0.1 },
    ]);
  },

  title() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildTitlePattern(), type: 'square', gainVal: 0.15 },
      { pattern: buildTitleBass(), type: 'triangle', gainVal: 0.12 },
    ]);
  },

  champion() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildChampionPattern(), type: 'square', gainVal: 0.16 },
      { pattern: buildChampionBass(), type: 'triangle', gainVal: 0.14 },
    ]);
  },

  pokemonLeague() {
    Music.stop();
    currentMusic = playMusicLoop([
      { pattern: buildPokemonLeaguePattern(), type: 'square', gainVal: 0.14 },
      { pattern: buildPokemonLeagueBass(), type: 'triangle', gainVal: 0.1 },
    ]);
  },

  victory() {
    Music.stop();
    SFX.victory();
  },

  stop() {
    currentMusic?.stop();
    currentMusic = null;
  },
};

/** Call once on first user interaction to enable audio */
export function initAudio() {
  getCtx();
}
