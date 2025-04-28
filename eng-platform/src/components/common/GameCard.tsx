import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import DinoCharacter from './DinoCharacter';
import { GameType } from '../../types';
import { soundManager } from '../../utils/soundManager';

interface GameCardProps {
  title: string;
  description: string;
  gameType: GameType;
  ageRange: string;
  difficulty: 'easy' | 'medium' | 'hard';
  dinoVariant: 'green' | 'orange' | 'purple' | 'blue';
  stars?: number;
  className?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  gameType,
  ageRange,
  difficulty,
  dinoVariant,
  stars = 0,
  className = '',
}) => {
  // Path mapping for each game type
  const gamePaths: Record<GameType, string> = {
    math: '/math-game',
    counting: '/counting-game',
    shapes: '/shapes-game',
    memory: '/memory-game',
  };
  
  // Difficulty colors
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };
  
  // Card hover animation
  const cardVariants = {
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };
  
  // Background gradient based on dino variant
  const getCardBackground = () => {
    switch (dinoVariant) {
      case 'green':
        return 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200';
      case 'orange':
        return 'bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200';
      case 'purple':
        return 'bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200';
      case 'blue':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
      default:
        return 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200';
    }
  };
  
  return (
    <motion.div
      whileHover="hover"
      variants={cardVariants}
      className={`
        ${getCardBackground()}
        rounded-2xl border-2 overflow-hidden shadow-lg
        transition-shadow hover:shadow-xl
        ${className}
      `}
      onHoverStart={() => soundManager.play('hover')}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">{title}</h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                Ages {ageRange}
              </span>
              <span className={`text-xs font-medium rounded-full px-2 py-1 ${difficultyColors[difficulty]}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{description}</p>
          </div>
          
          <div className="ml-4">
            <DinoCharacter 
              variant={dinoVariant} 
              size="sm"
              emotion="happy"
              animate={false}
            />
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center">
            {stars > 0 && (
              <div className="flex items-center bg-yellow-100 rounded-full px-2 py-1">
                <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                <span className="text-xs font-bold text-gray-700">{stars}</span>
              </div>
            )}
          </div>
          
          <Link 
            to={gamePaths[gameType]} 
            className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700"
            onClick={() => soundManager.play('click')}
          >
            Play Now
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;