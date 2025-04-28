// Game level definitions
export type Level = 'beginner' | 'intermediate' | 'advanced';

// Age group definitions
export type AgeGroup = '2-4' | '5-7' | '8-10';

// Game type definitions
export type GameType = 'math' | 'counting' | 'shapes' | 'memory';

// Math operation types
export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';

// Achievement type
export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isUnlocked: boolean;
  requiredScore: number;
}

// Player profile
export interface PlayerProfile {
  name: string;
  age: number;
  ageGroup: AgeGroup;
  avatarId: number;
  achievements: Achievement[];
  stars: number;
  highScores: Record<GameType, number>;
  lastPlayed: GameType | null;
}

// Game question interface
export interface GameQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  imageUrl?: string;
  difficulty: Level;
}

// Math game question
export interface MathQuestion extends GameQuestion {
  operation: MathOperation;
  num1: number;
  num2: number;
}

// Game state
export interface GameState {
  currentScore: number;
  highScore: number;
  level: Level;
  lives: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentQuestion: GameQuestion | null;
  isGameOver: boolean;
  isPaused: boolean;
}

// Sound settings
export interface SoundSettings {
  backgroundMusic: boolean;
  soundEffects: boolean;
  volume: number;
}