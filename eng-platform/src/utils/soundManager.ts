import { Howl, Howler } from 'howler';

// Map of all game sounds
const sounds: Record<string, Howl> = {
  // Background music
  bgMusic: new Howl({
    src: ['/sounds/background-music.mp3'],
    loop: true,
    volume: 0.5,
    preload: true,
  }),
  
  // UI sounds
  click: new Howl({
    src: ['/sounds/click.mp3'],
    volume: 0.7,
  }),
  hover: new Howl({
    src: ['/sounds/hover.mp3'],
    volume: 0.3,
  }),
  
  // Game sounds
  correct: new Howl({
    src: ['/sounds/correct.mp3'],
    volume: 0.7,
  }),
  wrong: new Howl({
    src: ['/sounds/wrong.mp3'],
    volume: 0.7,
  }),
  levelUp: new Howl({
    src: ['/sounds/level-up.mp3'],
    volume: 0.7,
  }),
  achievement: new Howl({
    src: ['/sounds/achievement.mp3'],
    volume: 0.8,
  }),
};

// Sound manager to handle all game sounds
class SoundManager {
  private muted: boolean = false;
  private effectsVolume: number = 0.7;
  private musicVolume: number = 0.5;
  private isMusicPlaying: boolean = false;

  constructor() {
    // Initialize sound settings
    this.loadSettings();
  }

  // Load settings from local storage
  private loadSettings(): void {
    const savedSettings = localStorage.getItem('dinoMathSoundSettings');
    
    if (savedSettings) {
      const { muted, effectsVolume, musicVolume } = JSON.parse(savedSettings);
      this.muted = muted;
      this.effectsVolume = effectsVolume;
      this.musicVolume = musicVolume;
      
      // Apply saved settings
      Howler.volume(this.muted ? 0 : 1);
      sounds.bgMusic.volume(this.musicVolume);
    }
  }

  // Save settings to local storage
  private saveSettings(): void {
    const settings = {
      muted: this.muted,
      effectsVolume: this.effectsVolume,
      musicVolume: this.musicVolume,
    };
    
    localStorage.setItem('dinoMathSoundSettings', JSON.stringify(settings));
  }

  // Play a sound effect
  play(soundName: string): void {
    if (sounds[soundName]) {
      sounds[soundName].play();
    } else {
      console.warn(`Sound "${soundName}" not found`);
    }
  }

  // Start playing background music
  startMusic(): void {
    if (!this.isMusicPlaying && !this.muted) {
      sounds.bgMusic.play();
      this.isMusicPlaying = true;
    }
  }

  // Stop background music
  stopMusic(): void {
    sounds.bgMusic.stop();
    this.isMusicPlaying = false;
  }

  // Mute all sounds
  mute(): void {
    this.muted = true;
    Howler.volume(0);
    this.saveSettings();
  }

  // Unmute all sounds
  unmute(): void {
    this.muted = false;
    Howler.volume(1);
    this.saveSettings();
  }

  // Toggle mute state
  toggleMute(): boolean {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.muted;
  }

  // Set music volume
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    sounds.bgMusic.volume(this.musicVolume);
    this.saveSettings();
  }

  // Set effects volume
  setEffectsVolume(volume: number): void {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
    
    // Update volume for all sound effects
    Object.keys(sounds).forEach(key => {
      if (key !== 'bgMusic') {
        sounds[key].volume(this.effectsVolume);
      }
    });
    
    this.saveSettings();
  }

  // Check if sound is muted
  isMuted(): boolean {
    return this.muted;
  }
}

// Export a singleton instance
export const soundManager = new SoundManager();