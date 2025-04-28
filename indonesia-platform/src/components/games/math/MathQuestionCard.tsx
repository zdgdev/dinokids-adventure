import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Button from '../../common/Button';
import DinoCharacter from '../../common/DinoCharacter';
import { MathQuestion } from '../../../types';
import { soundManager } from '../../../utils/soundManager';

interface MathQuestionCardProps {
  question: MathQuestion;
  onAnswer: (isCorrect: boolean) => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number; // in seconds
}

const MathQuestionCard: React.FC<MathQuestionCardProps> = ({
  question,
  onAnswer,
  difficulty,
  timeLimit = 0, // 0 means no time limit
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [options, setOptions] = useState<string[]>([]);
  
  // Generate answer options
  useEffect(() => {
    if (!question) return;
    
    // If options are provided, use them
    if (question.options && question.options.length > 0) {
      setOptions(question.options);
      return;
    }
    
    // Otherwise, generate options based on the correct answer
    const correctAnswer = question.correctAnswer.toString();
    const correctNumber = parseInt(correctAnswer);
    let generatedOptions = [correctAnswer];
    
    // Generate wrong options
    const range = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 5 : 10;
    
    while (generatedOptions.length < 4) {
      // Generate a number close to the correct answer
      const offset = Math.floor(Math.random() * range) + 1;
      const sign = Math.random() > 0.5 ? 1 : -1;
      const wrongAnswer = correctNumber + (sign * offset);
      
      // Ensure the wrong answer is positive and not already in the options
      if (wrongAnswer >= 0 && !generatedOptions.includes(wrongAnswer.toString())) {
        generatedOptions.push(wrongAnswer.toString());
      }
    }
    
    // Shuffle options
    generatedOptions = generatedOptions.sort(() => Math.random() - 0.5);
    
    setOptions(generatedOptions);
  }, [question, difficulty]);
  
  // Timer logic
  useEffect(() => {
    if (timeLimit <= 0 || isCorrect !== null) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(null); // Time's up, handle as wrong answer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLimit, isCorrect]);
  
  const handleAnswer = (answer: string | null) => {
    if (isCorrect !== null) return; // Already answered
    
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer.toString();
    setIsCorrect(correct);
    
    // Play sound based on answer
    soundManager.play(correct ? 'correct' : 'wrong');
    
    // Delay to show the result
    setTimeout(() => {
      onAnswer(correct);
      
      // Reset state
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(timeLimit);
    }, 1500);
  };
  
  // If no question, show loading
  if (!question) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl font-display">Loading question...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-auto">
      {/* Timer bar */}
      {timeLimit > 0 && (
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / timeLimit) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
      
      {/* Question */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-500 mb-1">Question:</h3>
          <div className="text-3xl font-display font-bold text-gray-800">
            {question.question}
          </div>
        </div>
        
        <DinoCharacter
          variant="green"
          size="sm"
          emotion={isCorrect === true ? 'happy' : isCorrect === false ? 'sad' : 'thinking'}
        />
      </div>
      
      {/* Options */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              py-4 px-6 rounded-lg font-display text-2xl font-bold
              transition-colors duration-200
              ${selectedAnswer === option 
                ? isCorrect 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-primary-100'
              }
              ${isCorrect !== null && option === question.correctAnswer.toString() && 'ring-4 ring-green-500'}
            `}
            onClick={() => handleAnswer(option)}
            disabled={isCorrect !== null}
          >
            {option}
            {selectedAnswer === option && (
              <span className="ml-2 inline-flex items-center">
                {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </span>
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Result feedback */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
              text-center py-3 rounded-lg font-display font-bold
              ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}
          >
            {isCorrect 
              ? 'Great job! That\'s correct!' 
              : `Oops! The correct answer is ${question.correctAnswer}`
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MathQuestionCard;