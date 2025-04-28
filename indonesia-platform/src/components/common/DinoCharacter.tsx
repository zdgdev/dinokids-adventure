import { motion } from 'framer-motion';

interface DinoCharacterProps {
  variant?: 'green' | 'orange' | 'purple' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  emotion?: 'happy' | 'sad' | 'surprised' | 'thinking';
  className?: string;
  animate?: boolean;
}

const DinoCharacter: React.FC<DinoCharacterProps> = ({ 
  variant = 'green', 
  size = 'md',
  emotion = 'happy',
  className = '',
  animate = true
}) => {
  // Size mapping in pixels
  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 180
  };
  
  // Color mapping based on variant
  const colorMap = {
    green: {
      primary: '#4CAF50',
      secondary: '#388E3C',
      highlight: '#81C784'
    },
    orange: {
      primary: '#FF9800',
      secondary: '#F57C00',
      highlight: '#FFB74D'
    },
    purple: {
      primary: '#9C27B0',
      secondary: '#7B1FA2',
      highlight: '#CE93D8'
    },
    blue: {
      primary: '#2196F3',
      secondary: '#1976D2',
      highlight: '#64B5F6'
    }
  };
  
  // Emotion mapping for facial expressions
  const getEyesPath = () => {
    switch(emotion) {
      case 'happy':
        return (
          <>
            <path d="M30,50 Q40,40 50,50" stroke="white" strokeWidth="2" fill="none" />
            <path d="M70,50 Q80,40 90,50" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="40" cy="45" r="5" fill="white" />
            <circle cx="80" cy="45" r="5" fill="white" />
          </>
        );
      case 'sad':
        return (
          <>
            <path d="M30,50 Q40,60 50,50" stroke="white" strokeWidth="2" fill="none" />
            <path d="M70,50 Q80,60 90,50" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="40" cy="45" r="5" fill="white" />
            <circle cx="80" cy="45" r="5" fill="white" />
          </>
        );
      case 'surprised':
        return (
          <>
            <circle cx="40" cy="45" r="8" fill="white" />
            <circle cx="80" cy="45" r="8" fill="white" />
            <circle cx="40" cy="45" r="4" fill="black" />
            <circle cx="80" cy="45" r="4" fill="black" />
          </>
        );
      case 'thinking':
        return (
          <>
            <path d="M30,45 L50,45" stroke="white" strokeWidth="2" />
            <circle cx="80" cy="45" r="6" fill="white" />
            <circle cx="80" cy="45" r="3" fill="black" />
            <path d="M20,70 Q40,80 60,70" stroke={colorMap[variant].secondary} strokeWidth="2" fill="none" />
          </>
        );
      default:
        return (
          <>
            <circle cx="40" cy="45" r="5" fill="white" />
            <circle cx="80" cy="45" r="5" fill="white" />
          </>
        );
    }
  };
  
  // Animation variants
  const animations = {
    idle: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    none: {}
  };
  
  return (
    <motion.div
      className={className}
      animate={animate ? "idle" : "none"}
      variants={animations}
    >
      <svg 
        width={sizeMap[size]} 
        height={sizeMap[size]} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <path 
          d="M60,20 Q90,10 100,40 L100,80 Q90,110 60,100 Q30,110 20,80 L20,40 Q30,10 60,20 Z" 
          fill={colorMap[variant].primary} 
        />
        
        {/* Spikes */}
        <path 
          d="M60,20 L65,10 L70,20 L75,8 L80,20 L85,12 L90,20" 
          fill={colorMap[variant].secondary} 
          stroke={colorMap[variant].secondary} 
          strokeWidth="2" 
        />
        
        {/* Tummy */}
        <ellipse 
          cx="60" 
          cy="70" 
          rx="25" 
          ry="20" 
          fill={colorMap[variant].highlight} 
        />
        
        {/* Eyes and expression */}
        {getEyesPath()}
        
        {/* Mouth */}
        <path 
          d={emotion === 'happy' ? "M40,70 Q60,90 80,70" : 
             emotion === 'sad' ? "M40,80 Q60,70 80,80" : 
             emotion === 'surprised' ? "M50,80 A10,10 0 0,0 70,80 A10,10 0 0,0 50,80" : 
             "M50,75 L70,75"}
          fill={emotion === 'surprised' ? "black" : "none"}
          stroke={emotion !== 'surprised' ? "black" : "none"}
          strokeWidth="2"
        />
        
        {/* Arms */}
        <path 
          d="M25,50 L10,60" 
          stroke={colorMap[variant].secondary} 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        <path 
          d="M95,50 L110,60" 
          stroke={colorMap[variant].secondary} 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        
        {/* Legs */}
        <path 
          d="M40,100 L35,115" 
          stroke={colorMap[variant].secondary} 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        <path 
          d="M80,100 L85,115" 
          stroke={colorMap[variant].secondary} 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
      </svg>
    </motion.div>
  );
};

export default DinoCharacter;