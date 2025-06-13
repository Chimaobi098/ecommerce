import { create } from "zustand";

interface AudioState {
  // Audio elements
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  tickSound: HTMLAudioElement | null;
  startSound: HTMLAudioElement | null;
  countdownSound: HTMLAudioElement | null;

  // State
  isMuted: boolean;
  isInitialized: boolean;
  tickPlaying: boolean;

  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setTickSound: (sound: HTMLAudioElement) => void;
  setStartSound: (sound: HTMLAudioElement) => void;
  setCountdownSound: (sound: HTMLAudioElement) => void;

  // Initialization
  initialize: () => void;

  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playTick: () => void;
  startTickLoop: () => void;
  stopTickLoop: () => void;
  playStart: () => void;
  playCountdown: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  // Initial state
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  tickSound: null,
  startSound: null,
  countdownSound: null,
  isMuted: true, // Start muted by default
  isInitialized: false,
  tickPlaying: false,

  // Initialize audio elements
  initialize: () => {
    if (get().isInitialized) return;

    // Create audio elements
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    const tickSound = new Audio("/sounds/tick.mp3");
    const startSound = new Audio("/sounds/start.mp3");
    const countdownSound = new Audio("/sounds/countdown.mp3");
    const backgroundMusic = new Audio("/sounds/background.mp3");

    // Configure audio
    hitSound.volume = 0.3;
    successSound.volume = 0.3;
    tickSound.volume = 0.1;
    startSound.volume = 0.3;
    countdownSound.volume = 0.3;
    backgroundMusic.volume = 0.1;
    backgroundMusic.loop = true;

    // Preload all sounds
    [
      hitSound,
      successSound,
      tickSound,
      startSound,
      countdownSound,
      backgroundMusic,
    ].forEach((sound) => {
      sound.preload = "auto";
      // Preload by starting and immediately pausing
      sound
        .play()
        .then(() => sound.pause())
        .catch(() => {
          // Ignore autoplay errors during preload
        });
    });

    // Update state with audio elements
    set({
      hitSound,
      successSound,
      tickSound,
      startSound,
      countdownSound,
      backgroundMusic,
      isInitialized: true,
    });
  },

  // Setters
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setTickSound: (sound) => set({ tickSound: sound }),
  setStartSound: (sound) => set({ startSound: sound }),
  setCountdownSound: (sound) => set({ countdownSound: sound }),

  // Toggle mute for all sounds
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;

    // Update background music
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    }

    // Set new mute state
    set({ isMuted: newMutedState });

    // Log the change
    console.log(`Sound ${newMutedState ? "muted" : "unmuted"}`);
  },

  // Play crash sound
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5; // Crash should be louder
      soundClone.play().catch((error) => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },

  // Play success/cashout sound
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      // Clone for consistent behavior
      const soundClone = successSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4;
      soundClone.play().catch((error) => {
        console.log("Success sound play prevented:", error);
      });
    }
  },

  // Play tick sound (for multiplier changes)
  playTick: () => {
    const { tickSound, isMuted } = get();
    if (tickSound && !isMuted) {
      // Use cloneNode to allow overlapping sounds
      const soundClone = tickSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.05; // Very subtle
      soundClone.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  },

  // Start a continuous tick loop (for active flight)
  startTickLoop: () => {
    const { isMuted, tickPlaying } = get();

    // Don't start if already playing or muted
    if (tickPlaying || isMuted) return;

    // Mark as playing
    set({ tickPlaying: true });

    // Use a setTimeout loop for ticks during flight
    const playTickLoop = () => {
      const { tickPlaying, isMuted } = get();

      // Stop if no longer playing or muted
      if (!tickPlaying || isMuted) {
        set({ tickPlaying: false });
        return;
      }

      // Play the tick
      get().playTick();

      // Continue the loop
      setTimeout(playTickLoop, 600); // Adjust timing as needed
    };

    // Start the loop
    playTickLoop();
  },

  // Stop the tick loop
  stopTickLoop: () => {
    set({ tickPlaying: false });
  },

  // Play round start sound
  playStart: () => {
    const { startSound, isMuted } = get();
    if (startSound && !isMuted) {
      startSound.currentTime = 0;
      startSound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  },

  // Play countdown sound
  playCountdown: () => {
    const { countdownSound, isMuted } = get();
    if (countdownSound && !isMuted) {
      countdownSound.currentTime = 0;
      countdownSound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  },
}));
