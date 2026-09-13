/**
 * HARSH GAWDE // GTA VI VICE CITY CINEMATIC PORTFOLIO
 * 1-TO-1 EXACT REEL SYSTEM WITH SYNTHWAVE RADIO, WEAPON WHEEL,
 * CHECKMARKS, 3D MINIMAP, AND ALL 8 SCREENS.
 */

// Global State
let currentScreen = 0;
let totalScreens = 9;
let isRolling = false;
let cash = 1875659;
let rapidCashClicks = 0;
let lastCashClickTime = 0;
let wantedLevel = 3;
let visitedScreens = new Set();
let isWeaponWheelOpen = false;
let isFullMapOpen = false;
let selectedMapIndex = 1;

// Full Map District Intel Data
const MAP_DISTRICTS = {
    0: {
        title: "MARINA BAYFRONT",
        sub: "MISSION 00: MAIN MENU",
        desc: "Main command center on the Bayfront boardwalk with the sports coupe and Ocean Drive sunset.",
        territory: "Marina Bayfront",
        bounty: "+$50,000",
        pos: { x: 220, y: 500 }
    },
    1: {
        title: "OCEAN BEACH",
        sub: "MISSION 01: ABOUT ME",
        desc: "Discover the origin story, tech philosophy, and full-stack engineering profile of Harsh Gawde.",
        territory: "Vice Beach",
        bounty: "+$150,000",
        pos: { x: 780, y: 460 }
    },
    2: {
        title: "DOWNTOWN HQ",
        sub: "MISSION 02: SKILLS ARSENAL",
        desc: "High-rise rooftop overlooking Vice City skyline. High-caliber Java 21, Python ML, and GCP architectures.",
        territory: "Downtown",
        bounty: "+$150,000",
        pos: { x: 240, y: 140 }
    },
    3: {
        title: "VICE PORT",
        sub: "MISSION 03: PROJECTS SHOWCASE",
        desc: "Shipping docks holding enterprise deployments: BeanByte Coffee Shop, Portfolio VI, and AI pipelines.",
        territory: "Port Gellhorn",
        bounty: "+$175,000",
        pos: { x: 140, y: 400 }
    },
    4: {
        title: "STARFISH MANSION",
        sub: "MISSION 04: EXPERIENCE JOURNEY",
        desc: "Private estate tracking industry tenures at BlueStock.in as Backend Software Engineer & Data Analyst.",
        territory: "Starfish Island",
        bounty: "+$200,000",
        pos: { x: 510, y: 290 }
    },
    5: {
        title: "VICE POINT CLUB",
        sub: "MISSION 05: ACHIEVEMENTS & CERTS",
        desc: "Neon nightlife strip unlocking trophies: GCP Arcade Certified, BlueStock.in SDE, and ATS Dossier.",
        territory: "Vice Point",
        bounty: "+$150,000",
        pos: { x: 820, y: 140 }
    },
    6: {
        title: "ESCOBAR ACADEMY",
        sub: "MISSION 06: CDGI & EDUCATION",
        desc: "Tech campus grounds training the next generation in B.Tech AI & Data Science and peer mentoring.",
        territory: "Escobar District",
        bounty: "+$125,000",
        pos: { x: 180, y: 260 }
    },
    7: {
        title: "GRASSRIVERS CAUSEWAY",
        sub: "MISSION 07: CONTACT HOTLINE",
        desc: "Secured highway transmission line: Direct Email, Phone, LinkedIn, GitHub Vault, and Resume download.",
        territory: "Leonida Causeway",
        bounty: "+$100,000",
        pos: { x: 830, y: 300 }
    }
};

// Dynamic Screen Objectives matching the viral reel
const SCREEN_OBJECTIVES = {
    0: { text: "PRESS START GAME TO BEGIN", color: "#ff007f" },
    1: { text: "LEARN WHO YOU ARE DEALING WITH", color: "#00f0ff" },
    2: { text: "INSPECT THE HIGH-CALIBER TECH ARSENAL", color: "#00f0ff" },
    3: { text: "INSPECT THE COMPLETED BUILDS", color: "#00d2be" },
    4: { text: "TRACE THE FULL CAREER PATH", color: "#9d4edd" },
    5: { text: "COLLECT EVERY UNLOCKED TROPHY", color: "#ff007f" },
    6: { text: "RECRUIT THE NEXT GENERATION", color: "#ffaa00" },
    7: { text: "OPEN A SECURE LINE OF CONTACT", color: "#1e90ff" },
    8: { text: "RIDE OFF INTO THE SUNRISE", color: "#ff007f" }
};

// Map screen index to checkmark element IDs in Main Menu
const SCREEN_CHECK_IDS = {
    1: "chk-about",
    2: "chk-skills",
    3: "chk-projects",
    4: "chk-experience",
    5: "chk-achievements",
    6: "chk-academy",
    7: "chk-contact"
};

// ========================================================
// 1. AUTHENTIC 80s SYNTHWAVE AUDIO & SOUND FX ENGINE
// ========================================================
class SynthwaveAudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.tempo = 118; // 80s synthwave BPM
        this.step = 0;
        this.timer = null;
        this.masterGain = null;
        this.sfxGain = null;

        // A Minor / Vice City Chord Progression (Am -> F -> C -> G)
        this.chords = [
            [220.00, 261.63, 329.63], // Am (A3, C4, E4)
            [174.61, 220.00, 261.63], // F  (F3, A3, C4)
            [130.81, 164.81, 196.00], // C  (C3, E3, G3)
            [196.00, 246.94, 293.66]  // G  (G3, B3, D4)
        ];
        
        // 16th-note rolling bassline notes for each chord
        this.basslines = [
            [110, 110, 220, 110, 110, 164.8, 110, 130.8], // Am
            [87.3, 87.3, 174.6, 87.3, 87.3, 130.8, 87.3, 110], // F
            [65.4, 65.4, 130.8, 65.4, 65.4, 98.0, 65.4, 82.4], // C
            [98.0, 98.0, 196.0, 98.0, 98.0, 146.8, 98.0, 123.5] // G
        ];

        // Lead Arpeggio notes
        this.leadNotes = [
            440, 523.25, 659.25, 523.25, 440, 659.25, 783.99, 659.25,
            349.23, 440, 523.25, 440, 349.23, 523.25, 659.25, 523.25,
            523.25, 659.25, 783.99, 659.25, 523.25, 783.99, 987.77, 783.99,
            392.00, 493.88, 587.33, 493.88, 392.00, 587.33, 659.25, 587.33
        ];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.45;
            this.masterGain.connect(this.ctx.destination);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.55;
            this.sfxGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    start() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.step = 0;

        const intervalMs = (60 / this.tempo / 4) * 1000; // 16th note interval
        this.timer = setInterval(() => this.tick(), intervalMs);

        // Animate radio waves in top bar
        const waves = document.getElementById("radioWaves");
        if (waves) waves.classList.add("playing");
    }

    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        clearInterval(this.timer);
        this.timer = null;

        const waves = document.getElementById("radioWaves");
        if (waves) waves.classList.remove("playing");
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    tick() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const sixteenth = this.step % 16;
        const beat = Math.floor(sixteenth / 4); // 0, 1, 2, 3
        const measure = Math.floor(this.step / 16);
        const chordIdx = measure % 4;

        // 1. Kick Drum (4-on-the-floor: sixteenth 0, 4, 8, 12)
        if (sixteenth % 4 === 0) {
            this.playKick(now);
        }

        // 2. Gated Reverb Snare (beats 2 and 4: sixteenth 4 and 12)
        if (sixteenth === 4 || sixteenth === 12) {
            this.playSnare(now);
        }

        // 3. Hi-Hats (every 16th note, slightly accented off-beats)
        this.playHiHat(now, sixteenth % 2 === 1);

        // 4. Rolling Synth Bassline (every 16th note)
        const bassArr = this.basslines[chordIdx];
        const bassFreq = bassArr[sixteenth % 8];
        this.playBass(now, bassFreq);

        // 5. Synth Chords (every measure start)
        if (sixteenth === 0) {
            this.playPad(now, this.chords[chordIdx]);
        }

        // 6. Lead Synth (arpeggiated)
        const leadFreq = this.leadNotes[this.step % this.leadNotes.length];
        if (sixteenth % 2 === 0 && Math.random() > 0.15) {
            this.playLead(now, leadFreq);
        }

        this.step++;
    }

    // Punchy 80s Kick
    playKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(140, time);
        osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

        gain.gain.setValueAtTime(0.7, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + 0.18);
    }

    // 80s Gated Snare
    playSnare(time) {
        // Noise burst
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 800;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.45, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.14);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        whiteNoise.start(time);
        whiteNoise.stop(time + 0.15);

        // Body tone
        const osc = this.ctx.createOscillator();
        const toneGain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, time);
        osc.frequency.exponentialRampToValueAtTime(90, time + 0.08);

        toneGain.gain.setValueAtTime(0.35, time);
        toneGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

        osc.connect(toneGain);
        toneGain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + 0.1);
    }

    // Filtered Hi-Hat
    playHiHat(time, isAccent) {
        const bufferSize = this.ctx.sampleRate * 0.04;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 6500;

        const gain = this.ctx.createGain();
        const vol = isAccent ? 0.22 : 0.12;
        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(time);
        noise.stop(time + 0.04);
    }

    // Rolling Saw Bass
    playBass(time, freq) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, time);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, time);
        filter.frequency.exponentialRampToValueAtTime(120, time + 0.12);
        filter.Q.value = 4.0;

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + 0.13);
    }

    // Lush Pad Chords
    playPad(time, chordFreqs) {
        chordFreqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(freq, time);
            osc.detune.setValueAtTime((idx - 1) * 8, time);

            gain.gain.setValueAtTime(0.001, time);
            gain.gain.linearRampToValueAtTime(0.12, time + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 1.8);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 1.9);
        });
    }

    // Lead Arpeggio
    playLead(time, freq) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(freq, time);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1800, time);

        gain.gain.setValueAtTime(0.16, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + 0.24);
    }

    // Realistic Game Sound Effects
    playMetallicTick() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.035);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    playSelectSound() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.27);
    }

    playCashChime() {
        this.init();
        const now = this.ctx.currentTime;
        [784, 1046, 1318].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(f, now + i * 0.05);

            gain.gain.setValueAtTime(0.3, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.36);
        });
    }

    playWheelRatchet() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.045);
    }

    playRollWhoosh() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.39);
    }

    // Iconic Vice City Police Siren Wail
    playPoliceSiren() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.linearRampToValueAtTime(950, now + 0.35);
        osc.frequency.linearRampToValueAtTime(650, now + 0.7);
        osc.frequency.linearRampToValueAtTime(1050, now + 1.05);
        osc.frequency.linearRampToValueAtTime(600, now + 1.4);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
        gain.gain.setValueAtTime(0.35, now + 1.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 1.52);
    }

    // Police Dispatch Radio Chirp
    playPoliceDispatch() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.setValueAtTime(900, now + 0.08);
        osc.frequency.setValueAtTime(1400, now + 0.16);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.29);
    }

    // Teleport GPS Map Warp Sound
    playTeleportSound() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.5);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.53);
    }
}

const radio = new SynthwaveAudioEngine();

// Window-accessible audio helpers (Controls Official GTA Theme Song)
window.toggleMusicMute = function() {
    const audio = document.getElementById("gtaThemeAudio");
    const muteBtn = document.getElementById("reelMuteBtn");
    const muteIcon = document.getElementById("muteIcon");
    const muteLabel = document.getElementById("muteLabel");
    const waves = document.getElementById("radioWaves");

    if (audio) {
        if (audio.paused) {
            audio.volume = 0.65;
            audio.muted = false;
            audio.play().then(() => {
                if (muteBtn) muteBtn.classList.remove("muted");
                if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
                if (muteLabel) muteLabel.textContent = "MUTE";
                if (waves) waves.classList.add("playing");
                hideAudioHint();
            }).catch(() => {});
        } else {
            audio.muted = !audio.muted;
            if (audio.muted) {
                if (muteBtn) muteBtn.classList.add("muted");
                if (muteIcon) muteIcon.className = "fa-solid fa-volume-xmark";
                if (muteLabel) muteLabel.textContent = "UNMUTE";
                if (waves) waves.classList.remove("playing");
            } else {
                if (muteBtn) muteBtn.classList.remove("muted");
                if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
                if (muteLabel) muteLabel.textContent = "MUTE";
                if (waves) waves.classList.add("playing");
            }
        }
        radio.playSelectSound();
    } else {
        radio.toggle();
        const isMuted = !radio.isPlaying;
        if (muteBtn) muteBtn.classList.toggle("muted", isMuted);
        if (muteIcon) muteIcon.className = isMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
        if (muteLabel) muteLabel.textContent = isMuted ? "UNMUTE" : "MUTE";
    }
};

window.toggleViceCityRadio = function() {
    const audio = document.getElementById("gtaThemeAudio");
    const waves = document.getElementById("radioWaves");
    const pill = document.getElementById("reelRadioPill");
    const muteBtn = document.getElementById("reelMuteBtn");
    const muteIcon = document.getElementById("muteIcon");
    const muteLabel = document.getElementById("muteLabel");

    if (audio) {
        if (audio.paused) {
            audio.volume = 0.65;
            audio.muted = false;
            audio.play().then(() => {
                if (waves) waves.classList.add("playing");
                if (pill) pill.classList.add("active");
                if (muteBtn) muteBtn.classList.remove("muted");
                if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
                if (muteLabel) muteLabel.textContent = "MUTE";
                hideAudioHint();
            }).catch(e => {
                console.log("Audio play fallback to synthwave:", e);
                radio.start();
                hideAudioHint();
            });
        } else {
            audio.pause();
            if (waves) waves.classList.remove("playing");
            if (pill) pill.classList.remove("active");
            if (muteBtn) muteBtn.classList.add("muted");
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-xmark";
            if (muteLabel) muteLabel.textContent = "UNMUTE";
        }
    } else {
        radio.toggle();
        hideAudioHint();
    }
};

window.startAudioAndHideBanner = function() {
    const audio = document.getElementById("gtaThemeAudio");
    const waves = document.getElementById("radioWaves");
    const pill = document.getElementById("reelRadioPill");

    if (audio) {
        audio.volume = 0.65;
        audio.play().then(() => {
            if (waves) waves.classList.add("playing");
            if (pill) pill.classList.add("active");
            hideAudioHint();
        }).catch(e => {
            radio.start();
            hideAudioHint();
        });
    } else {
        radio.start();
        hideAudioHint();
    }
};

function hideAudioHint() {
    const b = document.getElementById("audioHintBanner");
    if (b) b.classList.add("hidden");
}

// First interaction on page starts the official GTA Theme
document.addEventListener("click", () => {
    radio.init();
    const audio = document.getElementById("gtaThemeAudio");
    if (audio && audio.paused) {
        audio.volume = 0.65;
        audio.play().then(() => {
            const waves = document.getElementById("radioWaves");
            const pill = document.getElementById("reelRadioPill");
            if (waves) waves.classList.add("playing");
            if (pill) {
                pill.classList.add("playing");
                pill.classList.add("active");
            }
            hideAudioHint();
        }).catch(() => {});
    }
}, { once: true });


// ========================================================
// 2. SCREEN NAVIGATION & 3D CAMERA ROLL
// ========================================================
window.jumpToScreen = function(targetIndex) {
    if (targetIndex < 0 || targetIndex >= totalScreens || targetIndex === currentScreen || isRolling) {
        return;
    }
    isRolling = true;
    radio.playRollWhoosh();

    // Auto-reset rolling lock after 800ms as a safety guard
    setTimeout(() => { isRolling = false; }, 800);

    const screens = document.querySelectorAll(".gta-screen");
    const currentEl = screens[currentScreen];
    const targetEl = screens[targetIndex];
    const flashOverlay = document.getElementById("rollFlashOverlay");

    // Camera roll direction
    const direction = targetIndex > currentScreen ? 1 : -1;

    // Glitch flash
    if (flashOverlay) {
        flashOverlay.classList.add("active");
        setTimeout(() => flashOverlay.classList.remove("active"), 350);
    }

    if (typeof gsap !== "undefined" && gsap.to && gsap.fromTo) {
        // 3D Roll Out
        gsap.to(currentEl, {
            duration: 0.55,
            rotationY: -direction * 22,
            rotationX: 12,
            z: -300,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => {
                currentEl.classList.remove("active");
                gsap.set(currentEl, { clearProps: "all" });
            }
        });

        // 3D Roll In
        targetEl.classList.add("active");
        gsap.fromTo(targetEl, {
            rotationY: direction * 22,
            rotationX: -12,
            z: -300,
            opacity: 0
        }, {
            duration: 0.65,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            opacity: 1,
            ease: "power3.out",
            onComplete: () => {
                currentScreen = targetIndex;
                isRolling = false;
                onScreenArrived(targetIndex);
            }
        });
    } else {
        // Pure CSS Fail-Safe Fallback
        currentEl.classList.remove("active");
        targetEl.classList.add("active");
        currentScreen = targetIndex;
        isRolling = false;
        onScreenArrived(targetIndex);
    }
};

function onScreenArrived(index) {
    // 1. Update Objective Text & Color
    const obj = SCREEN_OBJECTIVES[index] || { text: "EXPLORE VICE CITY", color: "#00f0ff" };
    const objEl = document.getElementById("reelObjectiveText");
    const labelEl = document.getElementById("reelObjectiveLabel");
    if (objEl) {
        objEl.textContent = obj.text;
        objEl.style.color = obj.color;
    }
    if (labelEl) {
        labelEl.style.color = obj.color;
    }

    // 2. Toggle ESC Back to Menu button
    const escBtn = document.getElementById("reelEscBtn");
    if (escBtn) {
        if (index === 0) {
            escBtn.classList.add("hidden");
        } else {
            escBtn.classList.remove("hidden");
        }
    }

    // 3. Track visited section & award Cash & checkmark
    if (index > 0 && index < 8) {
        if (!visitedScreens.has(index)) {
            visitedScreens.add(index);
            // Cash Reward
            const reward = 150000;
            cash += reward;
            updateCashDisplay(reward);
            radio.playCashChime();

            // Mark Checkmark on Menu
            const checkId = SCREEN_CHECK_IDS[index];
            if (checkId) {
                const checkEl = document.getElementById(checkId);
                if (checkEl) checkEl.textContent = "✓";
            }
        }
    }
    updateMapTelemetry();
}

function updateCashDisplay(flyoutAmount) {
    const cashEl = document.getElementById("cashAmount");
    if (cashEl) {
        cashEl.textContent = "$" + cash.toLocaleString();
    }
    if (flyoutAmount) {
        const flyEl = document.getElementById("cashFlyout");
        if (flyEl) {
            flyEl.textContent = "+$" + flyoutAmount.toLocaleString();
            flyEl.classList.remove("animate");
            void flyEl.offsetWidth; // trigger reflow
            flyEl.classList.add("animate");
        }
    }
}


// ========================================================
// 3. MAIN MENU ARROW KEYS & HOVER SOUNDS
// ========================================================
function setupMainMenu() {
    const menuLinks = document.querySelectorAll("#reelVerticalMenu .reel-menu-link");
    menuLinks.forEach((link, idx) => {
        link.addEventListener("mouseenter", () => {
            menuLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            radio.playMetallicTick();
        });

        link.addEventListener("click", () => {
            radio.playSelectSound();
            const targetAttr = link.getAttribute("data-target");
            if (targetAttr === "start_game" || link.id === "startGameMenuBtn") {
                openWeaponWheel(true);
                return;
            }
            const target = parseInt(targetAttr);
            if (!isNaN(target)) {
                jumpToScreen(target);
            }
        });
    });
}


// ========================================================
// 4. RADIAL WEAPON WHEEL & MODALS
// ========================================================
window.openWeaponWheel = function(autoLaunch = false) {
    const overlay = document.getElementById("weaponWheelOverlay");
    if (!overlay) return;
    overlay.classList.add("active");
    isWeaponWheelOpen = true;
    radio.playSelectSound();

    if (autoLaunch) {
        if (window._autoLaunchTimer) clearTimeout(window._autoLaunchTimer);
        window._autoLaunchTimer = setTimeout(() => {
            if (isWeaponWheelOpen) {
                equipAndLaunchGame();
            }
        }, 1500);
    }
};

window.closeWeaponWheel = function() {
    const overlay = document.getElementById("weaponWheelOverlay");
    if (!overlay) return;
    overlay.classList.remove("active");
    isWeaponWheelOpen = false;
};

window.closeWeaponWheelOnOutside = function(e) {
    if (e.target.id === "weaponWheelOverlay") {
        closeWeaponWheel();
    }
};

window.openProjectsModal = function() {
    const overlay = document.getElementById("projectsModalOverlay");
    if (overlay) {
        overlay.classList.add("active");
        radio.playSelectSound();
    }
};

window.closeProjectsModal = function() {
    const overlay = document.getElementById("projectsModalOverlay");
    if (overlay) overlay.classList.remove("active");
};

window.closeProjectsModalOnOutside = function(e) {
    if (e.target.id === "projectsModalOverlay") {
        closeProjectsModal();
    }
};

window.openCertsModal = function() {
    const overlay = document.getElementById("certsModalOverlay");
    if (overlay) {
        overlay.classList.add("active");
        radio.playSelectSound();
    }
};

window.closeCertsModal = function() {
    const overlay = document.getElementById("certsModalOverlay");
    if (overlay) overlay.classList.remove("active");
};

window.closeCertsModalOnOutside = function(e) {
    if (e.target.id === "certsModalOverlay") {
        closeCertsModal();
    }
};

function setupWeaponWheelSlots() {
    const slots = document.querySelectorAll(".radial-slice-slot");
    slots.forEach(slot => {
        slot.addEventListener("mouseenter", () => {
            slots.forEach(s => s.classList.remove("active"));
            slot.classList.add("active");
            radio.playWheelRatchet();

            // Update stats panel
            const name = slot.getAttribute("data-name");
            const cat = slot.getAttribute("data-cat");
            const desc = slot.getAttribute("data-desc");
            const icon = slot.getAttribute("data-icon");
            const dmg = slot.getAttribute("data-dmg");
            const spd = slot.getAttribute("data-spd");
            const acc = slot.getAttribute("data-acc");
            const rng = slot.getAttribute("data-rng");

            document.getElementById("hubWeaponTitle").textContent = name.toUpperCase();
            document.getElementById("hubWeaponCat").textContent = cat;
            document.getElementById("statPanelWeaponName").textContent = name.toUpperCase();
            document.getElementById("statPanelDesc").textContent = desc;

            const iconEl = document.getElementById("hubWeaponIcon");
            if (iconEl) iconEl.className = icon;

            document.getElementById("meterDmgVal").textContent = dmg + "%";
            document.getElementById("meterDmgFill").style.width = dmg + "%";

            document.getElementById("meterSpdVal").textContent = spd + "%";
            document.getElementById("meterSpdFill").style.width = spd + "%";

            document.getElementById("meterAccVal").textContent = acc + "%";
            document.getElementById("meterAccFill").style.width = acc + "%";

            document.getElementById("meterRngVal").textContent = rng + "%";
            document.getElementById("meterRngFill").style.width = rng + "%";
        });

        // Clicking any slice equips it and rolls into mission
        slot.addEventListener("click", () => {
            slots.forEach(s => s.classList.remove("active"));
            slot.classList.add("active");
            radio.playSelectSound();
            equipAndLaunchGame();
        });
    });
}

window.equipAndLaunchGame = function() {
    const activeSlot = document.querySelector(".radial-slice-slot.active");
    const name = activeSlot ? activeSlot.getAttribute("data-name") : "Java 21 Enterprise";
    const cat = activeSlot ? activeSlot.getAttribute("data-cat") : "HEAVY AUTOMATIC";

    // Update HUD weapon slot tag
    const hudTag = document.getElementById("hudWeaponTag");
    if (hudTag && activeSlot) {
        const shortSpan = activeSlot.querySelector("span");
        hudTag.textContent = shortSpan ? `[ ${shortSpan.textContent} ]` : "[ JAVA ]";
    }

    triggerMissionToast("LOADOUT EQUIPPED!", 100000, `${name.toUpperCase()} // ${cat}`);
    closeWeaponWheel();

    // Check off START GAME checkmark
    const chkStart = document.getElementById("chk-start");
    if (chkStart) chkStart.textContent = "✓";

    // Roll into Screen 1 (About Me)
    setTimeout(() => {
        jumpToScreen(1);
    }, 400);
};

window.equipCurrentHighlightedWeapon = function() {
    const activeSlot = document.querySelector(".radial-slice-slot.active");
    if (activeSlot) {
        const name = activeSlot.getAttribute("data-name");
        triggerMissionToast("TECH ARSENAL EQUIPPED!", 50000, name);
        closeWeaponWheel();
    }
};

window.equipTech = function(name, role, desc) {
    radio.playSelectSound();
    triggerMissionToast("EQUIPPED: " + name, 25000, role + " // " + desc);
};

window.triggerMissionToast = function(headline, bounty, detail) {
    const banner = document.getElementById("missionPassedBanner");
    const rewardEl = document.getElementById("mpReward");
    const detailEl = document.getElementById("mpDetail");

    if (banner) {
        if (rewardEl) rewardEl.textContent = "REWARD: + $" + bounty.toLocaleString();
        if (detailEl) detailEl.textContent = detail;

        banner.classList.add("active");
        radio.playCashChime();

        cash += bounty;
        updateCashDisplay(bounty);

        setTimeout(() => banner.classList.remove("active"), 2800);
    }
};

// ========================================================
// 4B. INTERACTIVE MONEY SYSTEM (FREELANCE CONTRACTS & HEISTS)
// ========================================================
window.collectCashBounty = function() {
    const now = Date.now();
    if (now - lastCashClickTime < 1400) {
        rapidCashClicks++;
    } else {
        rapidCashClicks = 1;
    }
    lastCashClickTime = now;

    let payout = 25000 + Math.floor(Math.random() * 50000);
    let label = "FREELANCE CONTRACT BOUNTY";

    if (rapidCashClicks >= 4) {
        payout = 150000;
        label = "🔥 HEIST COMBO MULTIPLIER x4!";
        rapidCashClicks = 0;
    }

    cash += payout;
    radio.playCashChime();
    updateCashDisplay(payout);
    triggerMissionToast("CASH SECURED!", payout, label);
};

// ========================================================
// 4C. INTERACTIVE WANTED STARS & POLICE HEAT
// ========================================================
window.setWantedLevel = function(level) {
    if (wantedLevel === level) {
        // Clicking same star lowers heat by 1, or clears if at 1
        wantedLevel = level > 1 ? level - 1 : 0;
    } else {
        wantedLevel = level;
    }
    updateWantedStarsDisplay();
};

window.cycleWantedLevel = function() {
    wantedLevel = (wantedLevel + 1) % 6; // cycles 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0
    updateWantedStarsDisplay();
};

window.clearWantedLevel = function() {
    wantedLevel = 0;
    updateWantedStarsDisplay();
};

function updateWantedStarsDisplay() {
    const stars = document.querySelectorAll("#wantedStars .star");
    const strobeOverlay = document.getElementById("policeHeatStrobe");

    stars.forEach((star, idx) => {
        const starNum = idx + 1;
        if (starNum <= wantedLevel) {
            star.classList.add("active");
            if (wantedLevel >= 3) {
                star.classList.add("flashing");
            } else {
                star.classList.remove("flashing");
            }
        } else {
            star.classList.remove("active", "flashing");
        }
    });

    if (strobeOverlay) {
        if (wantedLevel >= 4) {
            strobeOverlay.classList.add("active");
            if (wantedLevel === 5) {
                strobeOverlay.classList.add("intense");
            } else {
                strobeOverlay.classList.remove("intense");
            }
        } else {
            strobeOverlay.classList.remove("active", "intense");
        }
    }

    // Dynamic GTA Toast & Siren
    if (wantedLevel === 0) {
        radio.playSelectSound();
        triggerMissionToast("HEAT EVADED!", 50000, "VCPD Lost the Trail // All Charges Dropped");
    } else if (wantedLevel === 1) {
        radio.playPoliceDispatch();
        triggerMissionToast("WANTED ★ [1 STAR]", 15000, "Minor Infraction // Local Patrols Alerted");
    } else if (wantedLevel === 2) {
        radio.playPoliceDispatch();
        triggerMissionToast("WANTED ★★ [2 STARS]", 35000, "Squad Cars Dispatched // 10-33 Code Active");
    } else if (wantedLevel === 3) {
        radio.playPoliceSiren();
        triggerMissionToast("WANTED ★★★ [3 STARS]", 75000, "SWAT Units En Route // Roadblocks Armed");
    } else if (wantedLevel === 4) {
        radio.playPoliceSiren();
        triggerMissionToast("WANTED ★★★★ [4 STARS]", 150000, "FBI Tactical Strike // VCPD Air Support Called");
    } else if (wantedLevel === 5) {
        radio.playPoliceSiren();
        triggerMissionToast("WANTED ★★★★★ [5 STARS]", 250000, "MAXIMUM PURSUIT! Choppers & Military Active!");
    }
}

// ========================================================
// 4D. FULL-SCREEN VICE CITY SATELLITE GPS MAP MODAL
// ========================================================
window.openFullMap = function() {
    const overlay = document.getElementById("fullMapOverlay");
    if (!overlay) return;
    overlay.classList.add("active");
    isFullMapOpen = true;
    radio.playSelectSound();
    updateMapTelemetry();
    previewMapWaypoint(currentScreen);
};

window.closeFullMap = function() {
    const overlay = document.getElementById("fullMapOverlay");
    if (!overlay) return;
    overlay.classList.remove("active");
    isFullMapOpen = false;
};

window.closeFullMapOnOutside = function(e) {
    if (e.target.id === "fullMapOverlay") {
        closeFullMap();
    }
};

window.previewMapWaypoint = function(screenIdx) {
    selectedMapIndex = screenIdx;
    const district = MAP_DISTRICTS[screenIdx];
    if (!district) return;

    // Update Tactical card info
    const titleEl = document.getElementById("tacTitle");
    const subEl = document.getElementById("tacSub");
    const descEl = document.getElementById("tacDesc");
    const territoryEl = document.getElementById("tacTerritory");
    const bountyEl = document.getElementById("tacBounty");

    if (titleEl) titleEl.textContent = district.title;
    if (subEl) subEl.textContent = district.sub;
    if (descEl) descEl.textContent = district.desc;
    if (territoryEl) territoryEl.textContent = district.territory;
    if (bountyEl) bountyEl.textContent = district.bounty;

    // Draw GPS line from current player position to target waypoint
    const currentDistrict = MAP_DISTRICTS[currentScreen] || MAP_DISTRICTS[0];
    const targetDistrict = district;
    const routeLine = document.getElementById("mapGpsLiveRoute");
    if (routeLine) {
        const midX = (currentDistrict.pos.x + targetDistrict.pos.x) / 2;
        const midY = (currentDistrict.pos.y + targetDistrict.pos.y) / 2 - 30;
        routeLine.setAttribute("d", `M ${currentDistrict.pos.x},${currentDistrict.pos.y} Q ${midX},${midY} ${targetDistrict.pos.x},${targetDistrict.pos.y}`);
    }

    radio.playMetallicTick();
};

window.fastTravelToScreen = function(screenIdx) {
    if (screenIdx < 0 || screenIdx >= totalScreens) return;
    radio.playTeleportSound();
    closeFullMap();
    jumpToScreen(screenIdx);
    triggerMissionToast("GPS WARP COMPLETE!", 50000, `Fast-Traveled to ${MAP_DISTRICTS[screenIdx]?.title || 'Destination'}`);
};

window.fastTravelSelected = function() {
    fastTravelToScreen(selectedMapIndex);
};

function updateMapTelemetry() {
    const cur = MAP_DISTRICTS[currentScreen];
    const curEl = document.getElementById("mapTelemetryCurrent");
    if (curEl && cur) {
        curEl.textContent = cur.title;
    }

    // Update player icon position on map
    const playerMarker = document.getElementById("mapLivePlayerMarker");
    if (playerMarker && cur) {
        playerMarker.setAttribute("transform", `translate(${cur.pos.x}, ${cur.pos.y})`);
    }
}


// ========================================================
// 5. CLOCK & COUNTDOWN TICKERS
// ========================================================
function initClock() {
    function tickClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, "0");
        const mins = String(now.getMinutes()).padStart(2, "0");
        const el = document.getElementById("reelClock");
        if (el) el.textContent = hrs + ":" + mins;
    }
    tickClock();
    setInterval(tickClock, 1000);
}

function initCountdown() {
    let secs = 18;
    let mins = 33;
    let hours = 15;
    let days = 108;

    setInterval(() => {
        secs--;
        if (secs < 0) {
            secs = 59;
            mins--;
            if (mins < 0) {
                mins = 59;
                hours--;
                if (hours < 0) {
                    hours = 23;
                    days--;
                }
            }
        }
        const sEl = document.getElementById("cdSecs");
        const mEl = document.getElementById("cdMins");
        const hEl = document.getElementById("cdHours");
        const dEl = document.getElementById("cdDays");
        if (sEl) sEl.textContent = String(secs).padStart(2, "0");
        if (mEl) mEl.textContent = String(mins).padStart(2, "0");
        if (hEl) hEl.textContent = String(hours).padStart(2, "0");
        if (dEl) dEl.textContent = days;
    }, 1000);
}


// ========================================================
// 6. GLOBAL KEYBOARD & WHEEL LISTENERS
// ========================================================
function setupGlobalControls() {
    // Keyboard listener
    window.addEventListener("keydown", (e) => {
        // Tab: Weapon Wheel
        if (e.key === "Tab") {
            e.preventDefault();
            if (isWeaponWheelOpen) closeWeaponWheel();
            else openWeaponWheel();
            return;
        }

        // T: Toggle Radio Theme
        if (e.key === "t" || e.key === "T") {
            toggleViceCityRadio();
            return;
        }

        // M: Toggle Music Mute / Unmute
        if (e.key === "m" || e.key === "M") {
            toggleMusicMute();
            return;
        }

        // P: Toggle Full Vice City Satellite GPS Map
        if (e.key === "p" || e.key === "P") {
            if (isFullMapOpen) closeFullMap();
            else openFullMap();
            return;
        }

        // W: Cycle Police Wanted Heat Level (0 to 5 stars)
        if (e.key === "w" || e.key === "W") {
            cycleWantedLevel();
            return;
        }

        // ESC: Back to Menu / Close modals
        if (e.key === "Escape") {
            if (isFullMapOpen) {
                closeFullMap();
                return;
            }
            if (isWeaponWheelOpen) {
                closeWeaponWheel();
                return;
            }
            closeProjectsModal();
            closeCertsModal();
            if (currentScreen !== 0) {
                jumpToScreen(0);
            }
            return;
        }

        // Enter: select in Screen 0 or equip loadout in Weapon Wheel
        if (e.key === "Enter") {
            if (isWeaponWheelOpen) {
                equipAndLaunchGame();
                return;
            }
            if (currentScreen === 0) {
                const activeLink = document.querySelector("#reelVerticalMenu .reel-menu-link.active");
                if (activeLink) {
                    const targetAttr = activeLink.getAttribute("data-target");
                    if (targetAttr === "start_game" || activeLink.id === "startGameMenuBtn") {
                        openWeaponWheel();
                        return;
                    }
                    const target = parseInt(targetAttr);
                    if (!isNaN(target)) jumpToScreen(target);
                }
            }
            return;
        }

        // Space / Arrow Right: Next Screen
        if (e.key === " " || e.key === "ArrowRight") {
            e.preventDefault();
            if (currentScreen < totalScreens - 1) {
                jumpToScreen(currentScreen + 1);
            }
            return;
        }

        // Arrow Left: Prev Screen
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (currentScreen > 0) {
                jumpToScreen(currentScreen - 1);
            }
            return;
        }

        // Arrow Up / Down in Screen 0 Menu
        if (currentScreen === 0 && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            e.preventDefault();
            const links = Array.from(document.querySelectorAll("#reelVerticalMenu .reel-menu-link"));
            const currentActiveIdx = links.findIndex(l => l.classList.contains("active"));
            let nextIdx = 0;
            if (e.key === "ArrowDown") {
                nextIdx = (currentActiveIdx + 1) % links.length;
            } else {
                nextIdx = (currentActiveIdx - 1 + links.length) % links.length;
            }
            links.forEach(l => l.classList.remove("active"));
            links[nextIdx].classList.add("active");
            radio.playMetallicTick();
        }
    });

    // Mouse Wheel & Trackpad Navigation with sensitive accumulator
    let scrollDelta = 0;
    let wheelTimer = null;
    window.addEventListener("wheel", (e) => {
        if (isWeaponWheelOpen || isFullMapOpen) return;
        scrollDelta += e.deltaY;
        if (wheelTimer) clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => { scrollDelta = 0; }, 200);

        if (scrollDelta > 45) {
            scrollDelta = 0;
            if (currentScreen < totalScreens - 1) jumpToScreen(currentScreen + 1);
        } else if (scrollDelta < -45) {
            scrollDelta = 0;
            if (currentScreen > 0) jumpToScreen(currentScreen - 1);
        }
    }, { passive: true });

    // Touch Swipe Navigation for mobile & touchscreens
    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => {
        if (e.touches && e.touches.length > 0) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
        if (isWeaponWheelOpen || isFullMapOpen) return;
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;
        if (diffY > 40) {
            if (currentScreen < totalScreens - 1) jumpToScreen(currentScreen + 1);
        } else if (diffY < -40) {
            if (currentScreen > 0) jumpToScreen(currentScreen - 1);
        }
    }, { passive: true });
}


// ========================================================
// 7. INITIALIZATION
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
    setupMainMenu();
    setupWeaponWheelSlots();
    setupGlobalControls();
    initClock();
    initCountdown();

    // Set initial objective
    const initObj = SCREEN_OBJECTIVES[0];
    const objEl = document.getElementById("reelObjectiveText");
    const labelEl = document.getElementById("reelObjectiveLabel");
    if (objEl) {
        objEl.textContent = initObj.text;
        objEl.style.color = initObj.color;
    }
    if (labelEl) {
        labelEl.style.color = initObj.color;
    }

    console.log("🎮 GTA VI Reel Portfolio Initialized for Harsh Gawde!");
});
