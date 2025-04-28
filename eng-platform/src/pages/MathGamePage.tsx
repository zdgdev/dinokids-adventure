import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, Heart, Star, Home, Pause, Play } from 'lucide-react';
import Button from '../components/common/Button';
import DinoCharacter from '../components/common/DinoCharacter';
import MathQuestionCard from '../components/games/math/MathQuestionCard';
import { useGameStore } from '../store/gameStore';
import { Level, MathQuestion, MathOperation } from '../types';
import { soundManager } from '../utils/soundManager';

// Helper function to generate math questions
const generateMathQuestion = (level: Level): MathQuestion => {
  let num1: number, num2: number, answer: number, operation: MathOperation;
  const id = Date.now().toString();
  
  switch (level) {
    case 'beginner':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = Math.random() > 0.5 ? 'addition' : 'subtraction';
      // Make sure subtraction results in a positive number
      if (operation === 'subtraction' && num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      break;
    case 'intermediate':
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      // Add multiplication for intermediate level
      operation = Math.random() < 0.4 ? 'addition' : Math.random() < 0.8 ? 'subtraction' : 'multiplication';
      // For multiplication, use smaller numbers
      if (operation === 'multiplication') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
      }
      // Make sure subtraction results in a positive number
      if (operation === 'subtraction' && num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      break;
    case 'advanced':
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      // Include all operations for advanced level
      const randomOp = Math.random();
      if (randomOp < 0.3) {
        operation = 'addition';
      } else if (randomOp < 0.6) {
        operation = 'subtraction';
        // Make sure subtraction results in a positive number
        if (num1 < num2) {
          [num1, num2] = [num2, num1];
        }
      } else if (randomOp < 0.9) {
        operation = 'multiplication';
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
      } else {
        operation = 'division';
        // Ensure division results in a whole number
        num2 = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
      }
      break;
    default:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = 'addition';
  }
  
  // Calculate answer based on operation
  switch (operation) {
    case 'addition':
      answer = num1 + num2;
      break;
    case 'subtraction':
      answer = num1 - num2;
      break;
    case 'multiplication':
      answer = num1 * num2;
      break;
    case 'division':
      answer = num1 / num2;
      break;
    default:
      answer = num1 + num2;
  }
  
  // Generate the question string
  let questionText: string;
  switch (operation) {
    case 'addition':
      questionText = `${num1} + ${num2} = ?`;
      break;
    case 'subtraction':
      questionText = `${num1} - ${num2} = ?`;
      break;
    case 'multiplication':
      questionText = `${num1} × ${num2} = ?`;
      break;
    case 'division':
      questionText = `${num1} ÷ ${num2} = ?`;
      break;
    default:
      questionText = `${num1} + ${num2} = ?`;
  }
  
  return {
    id,
    question: questionText,
    correctAnswer: answer,
    difficulty: level,
    operation,
    num1,
    num2,
  };
};

const MathGamePage = () => {
  const { level = 'beginner' } = useParams<{ level?: string }>();
  const navigate = useNavigate();
  
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showLevelSelection, setShowLevelSelection] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<Level>(level as Level);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [newStars, setNewStars] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  
  // Global game state
  const gameState = useGameStore((state) => state.gameState);
  const playerProfile = useGameStore((state) => state.playerProfile);
  const setGameState = useGameStore((state) => state.setGameState);
  const resetGameState = useGameStore((state) => state.resetGameState);
  const incrementScore = useGameStore((state) => state.incrementScore);
  const decrementLives = useGameStore((state) => state.decrementLives);
  const addStar = useGameStore((state) => state.addStar);
  const updatePlayerProfile = useGameStore((state) => state.updatePlayerProfile);
  
  // Initialize or reset the game
  useEffect(() => {
    if (!showLevelSelection) {
      // Reset game state when starting a new game
      resetGameState();
      setGameState({ level: selectedLevel });
      
      // Generate first question
      setCurrentQuestion(generateMathQuestion(selectedLevel));
      
      // Set time limit based on level
      setTimeLimit(
        selectedLevel === 'beginner' ? 0 : 
        selectedLevel === 'intermediate' ? 15 : 
        20
      );
    }
  }, [showLevelSelection, selectedLevel]);
  
  // Handle player's answer
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // Award points based on level
      const points = 
        selectedLevel === 'beginner' ? 10 : 
        selectedLevel === 'intermediate' ? 20 : 
        30;
      
      incrementScore(points);
    } else {
      decrementLives();
    }
    
    setQuestionsAnswered(prev => prev + 1);
    
    // Check if game is over
    if (gameState.lives <= 1 && !isCorrect) {
      // Game over due to no more lives
      finishGame();
    } else if (questionsAnswered >= 9) {
      // Game over due to completion
      finishGame();
    } else {
      // Continue with next question
      setCurrentQuestion(generateMathQuestion(selectedLevel));
    }
  };
  
  // Finish the game and calculate rewards
  const finishGame = () => {
    const score = gameState.currentScore;
    
    // Calculate stars earned (0-3 based on score and level)
    let stars = 0;
    if (selectedLevel === 'beginner') {
      if (score >= 80) stars = 3;
      else if (score >= 50) stars = 2;
      else if (score >= 30) stars = 1;
    } else if (selectedLevel === 'intermediate') {
      if (score >= 150) stars = 3;
      else if (score >= 100) stars = 2;
      else if (score >= 60) stars = 1;
    } else {
      if (score >= 200) stars = 3;
      else if (score >= 150) stars = 2;
      else if (score >= 90) stars = 1;
    }
    
    setNewStars(stars);
    
    // Update high score if current score is higher
    if (playerProfile && score > (playerProfile.highScores.math || 0)) {
      updatePlayerProfile({
        highScores: {
          ...playerProfile.highScores,
          math: score
        }
      });
    }
    
    // Add stars to player's total
    if (stars > 0) {
      addStar(stars);
    }
    
    // Mark game as completed
    setGameState({ isGameOver: true });
    setGameCompleted(true);
    
    // Play achievement sound if earned stars
    if (stars > 0) {
      soundManager.play('achievement');
    }
  };
  
  // Start new game
  const startGame = () => {
    setShowLevelSelection(false);
    soundManager.play('click');
  };
  
  // Choose level
  const selectLevel = (level: Level) => {
    setSelectedLevel(level);
    soundManager.play('click');
  };
  
  // Return to level selection
  const goToLevelSelection = () => {
    setShowLevelSelection(true);
    setGameCompleted(false);
    soundManager.play('click');
  };
  
  // Go back to home
  const goToHome = () => {
    navigate('/');
    soundManager.play('click');
  };
  
  // Toggle pause
  const togglePause = () => {
    setGameState({ isPaused: !gameState.isPaused });
    soundManager.play('click');
  };
  
  // Render level selection
  if (showLevelSelection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center">
            <Button 
              variant="secondary" 
              size="sm"
              rounded="full"
              icon={<ArrowLeft className="w-5 h-5" />}
              onClick={goToHome}
            >
              Back to Home
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
            <h1 className="text-3xl font-display font-bold text-center text-primary-800 mb-6">
              Math Adventure
            </h1>
            
            <p className="text-gray-600 text-center mb-8">
              Choose a difficulty level to start your math adventure!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-6 rounded-xl border-2 flex flex-col items-center
                  ${selectedLevel === 'beginner' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  }
                `}
                onClick={() => selectLevel('beginner')}
              >
                <DinoCharacter variant="green" size="sm" emotion="happy" animate={false} />
                <h3 className="text-xl font-display font-bold mt-4 mb-2">Beginner</h3>
                <p className="text-sm text-center text-gray-600">
                  Simple addition and subtraction with numbers 1-10.
                </p>
                <div className="mt-2 flex">
                  <Star className="w-4 h-4 text-secondary-400" fill="currentColor" />
                  <Star className="w-4 h-4 text-gray-300" />
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-6 rounded-xl border-2 flex flex-col items-center
                  ${selectedLevel === 'intermediate' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  }
                `}
                onClick={() => selectLevel('intermediate')}
              >
                <DinoCharacter variant="orange" size="sm" emotion="happy" animate={false} />
                <h3 className="text-xl font-display font-bold mt-4 mb-2">Intermediate</h3>
                <p className="text-sm text-center text-gray-600">
                  Addition, subtraction, and multiplication with numbers 1-20.
                </p>
                <div className="mt-2 flex">
                  <Star className="w-4 h-4 text-secondary-400" fill="currentColor" />
                  <Star className="w-4 h-4 text-secondary-400" fill="currentColor" />
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-6 rounded-xl border-2 flex flex-col items-center
                  ${selectedLevel === 'advanced' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  }
                `}
                onClick={() => selectLevel('advanced')}
              >
                <DinoCharacter variant="purple" size="sm" emotion="thinking" animate={false} />
                <h3 className="text-xl font-display font-bold mt-4 mb-2">Advanced</h3>
                <p className="text-sm text-center text-gray-600">
                  All operations including division with larger numbers.
                </p>
                <div className="mt-2 flex">
                  <Star className="w-4 h-4 text-secondary-400" fill="currentColor" />
                  <Star className="w-4 h-4 text-secondary-400" fill="currentColor" />
                  <Star className="w-4 h-4 text-secondary-400" fill="currentColor" />
                </div>
              </motion.button>
            </div>
            
            <div className="text-center">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={startGame}
              >
                Start Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render game completed screen
  if (gameCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 text-center"
          >
            <h1 className="text-3xl font-display font-bold text-primary-800 mb-4">
              Game Completed!
            </h1>
            
            <div className="flex justify-center mb-6">
              <DinoCharacter 
                variant={newStars > 0 ? "green" : "orange"} 
                size="lg" 
                emotion={newStars > 0 ? "happy" : "sad"} 
              />
            </div>
            
            <div className="mb-8">
              <p className="text-2xl font-display font-bold text-gray-800">
                Your Score: {gameState.currentScore}
              </p>
              
              <div className="flex justify-center my-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: i < newStars ? 1 : 0.7, 
                      rotate: 0 
                    }}
                    transition={{ 
                      delay: 0.5 + (i * 0.3), 
                      type: "spring" 
                    }}
                    className="mx-2"
                  >
                    <Star 
                      className={`w-12 h-12 ${i < newStars ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill={i < newStars ? "currentColor" : "none"} 
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-4 text-center max-w-xs mx-auto">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Correct</p>
                  <p className="text-2xl font-bold text-green-600">{gameState.correctAnswers}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Wrong</p>
                  <p className="text-2xl font-bold text-red-600">{gameState.wrongAnswers}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                icon={<Home className="w-5 h-5" />}
                onClick={goToHome}
              >
                Home
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                onClick={goToLevelSelection}
              >
                Play Again
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Render game screen
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Game header */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="secondary" 
            size="sm"
            rounded="full"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={goToLevelSelection}
          >
            Back
          </Button>
          
          <div className="text-center">
            <h2 className="text-xl font-display font-bold text-primary-800">
              Math Adventure
            </h2>
            <p className="text-sm text-gray-600">
              {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Level
            </p>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            rounded="full"
            icon={gameState.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            onClick={togglePause}
          >
            {gameState.isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
        
        {/* Game stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex">
            {[...Array(gameState.lives)].map((_, i) => (
              <Heart 
                key={i} 
                className="w-6 h-6 text-red-500 mr-1" 
                fill="currentColor" 
              />
            ))}
            {[...Array(3 - gameState.lives)].map((_, i) => (
              <Heart 
                key={i + gameState.lives} 
                className="w-6 h-6 text-gray-300 mr-1" 
              />
            ))}
          </div>
          
          <div className="bg-primary-50 px-4 py-1 rounded-full">
            <span className="font-bold text-primary-800">Score: {gameState.currentScore}</span>
          </div>
          
          <div className="bg-secondary-50 px-3 py-1 rounded-full flex items-center">
            <Award className="w-4 h-4 text-secondary-600 mr-1" />
            <span className="font-bold text-secondary-800">{questionsAnswered}/10</span>
          </div>
        </div>
      </div>
      
      {/* Pause overlay */}
      <AnimatePresence>
        {gameState.isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div className="bg-white rounded-xl p-8 max-w-md text-center">
              <h2 className="text-2xl font-display font-bold mb-4">Game Paused</h2>
              <p className="mb-6">Take a break! Click resume when you're ready to continue.</p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={togglePause}
              >
                Resume Game
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Question card */}
      {!gameState.isPaused && currentQuestion && (
        <div className="max-w-2xl mx-auto">
          <MathQuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            difficulty={selectedLevel}
            timeLimit={timeLimit}
          />
        </div>
      )}
    </div>
  );
};

export default MathGamePage;