import { create } from 'zustand';
import { GameState, GameType, Level, PlayerProfile } from '../types';

interface GameStore {
  // Player profile
  playerProfile: PlayerProfile | null;
  setPlayerProfile: (profile: PlayerProfile) => void;
  updatePlayerProfile: (updates: Partial<PlayerProfile>) => void;
  
  // Current game state
  gameState: GameState;
  setGameState: (state: Partial<GameState>) => void;
  resetGameState: () => void;
  
  // Game settings
  selectedGameType: GameType | null;
  setSelectedGameType: (gameType: GameType) => void;
  
  // Game actions
  incrementScore: (points: number) => void;
  decrementLives: () => void;
  addStar: (count: number) => void;
  unlockAchievement: (achievementId: string) => void;
}

// Initial game state
const initialGameState: GameState = {
  currentScore: 0,
  highScore: 0,
  level: 'beginner',
  lives: 3,
  correctAnswers: 0,
  wrongAnswers: 0,
  currentQuestion: null,
  isGameOver: false,
  isPaused: false,
};

// Initial player profile
const initialPlayerProfile: PlayerProfile = {
  name: 'Dino Explorer',
  age: 5,
  ageGroup: '5-7',
  avatarId: 1,
  achievements: [],
  stars: 0,
  highScores: {
    math: 0,
    counting: 0,
    shapes: 0,
    memory: 0,
  },
  lastPlayed: null,
};

// Create the store
export const useGameStore = create<GameStore>((set) => ({
  // Player profile
  playerProfile: initialPlayerProfile,
  setPlayerProfile: (profile) => set({ playerProfile: profile }),
  updatePlayerProfile: (updates) => set((state) => ({
    playerProfile: state.playerProfile ? { ...state.playerProfile, ...updates } : null,
  })),
  
  // Current game state
  gameState: initialGameState,
  setGameState: (partialState) => set((state) => ({
    gameState: { ...state.gameState, ...partialState },
  })),
  resetGameState: () => set({ gameState: initialGameState }),
  
  // Game settings
  selectedGameType: null,
  setSelectedGameType: (gameType) => set({ selectedGameType: gameType }),
  
  // Game actions
  incrementScore: (points) => set((state) => {
    const newScore = state.gameState.currentScore + points;
    const newHighScore = Math.max(newScore, state.gameState.highScore);
    
    return {
      gameState: {
        ...state.gameState,
        currentScore: newScore,
        highScore: newHighScore,
        correctAnswers: state.gameState.correctAnswers + 1,
      }
    };
  }),
  
  decrementLives: () => set((state) => {
    const newLives = state.gameState.lives - 1;
    const isGameOver = newLives <= 0;
    
    return {
      gameState: {
        ...state.gameState,
        lives: newLives,
        isGameOver,
        wrongAnswers: state.gameState.wrongAnswers + 1,
      }
    };
  }),
  
  addStar: (count) => set((state) => ({
    playerProfile: state.playerProfile 
      ? { ...state.playerProfile, stars: state.playerProfile.stars + count } 
      : null
  })),
  
  unlockAchievement: (achievementId) => set((state) => {
    if (!state.playerProfile) return { playerProfile: null };
    
    const updatedAchievements = state.playerProfile.achievements.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, isUnlocked: true } 
        : achievement
    );
    
    return {
      playerProfile: {
        ...state.playerProfile,
        achievements: updatedAchievements,
      }
    };
  }),
}));