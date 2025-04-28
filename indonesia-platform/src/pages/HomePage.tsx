import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, Shapes, Brain } from 'lucide-react';
import GameCard from '../components/common/GameCard';
import DinoCharacter from '../components/common/DinoCharacter';
import Button from '../components/common/Button';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/soundManager';

const HomePage = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const playerProfile = useGameStore((state) => state.playerProfile);
  
  // Start background music when the home page loads
  useEffect(() => {
    soundManager.startMusic();
    
    // Automatically hide welcome screen after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Skip welcome animation
  const skipWelcome = () => {
    soundManager.play('click');
    setShowWelcome(false);
  };
  
  // Welcome animation
  if (showWelcome) {
    return (
      <motion.div 
        className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-primary-50 to-primary-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, type: 'spring' }}
          className="mb-6"
        >
          <DinoCharacter variant="green" size="lg" emotion="happy" />
        </motion.div>
        
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-4xl md:text-6xl font-display font-bold text-center text-primary-800 mb-4"
        >
          Dino Math Adventure!
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-xl text-center text-primary-600 max-w-xl mb-8"
        >
          Let's learn math and have fun with dinosaurs!
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <Button size="lg" onClick={skipWelcome}>
            Start Learning!
          </Button>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Welcome to Dino Math Adventure!
            </h1>
            <p className="text-lg opacity-90 mb-4 max-w-2xl">
              Fun educational games for children ages 2-10. Learn math, counting, shapes, and more with friendly dinosaur guides!
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              rounded="full"
              onClick={() => soundManager.play('click')}
            >
              Start Playing Now!
            </Button>
          </div>
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="hidden md:block"
          >
            <DinoCharacter variant="green" size="lg" emotion="happy" />
          </motion.div>
        </div>
      </div>
      
      {/* Games section */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-6">
          Educational Games
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GameCard
            title="Math Adventure"
            description="Learn addition, subtraction, and more with dinosaur friends! Perfect for building core math skills."
            gameType="math"
            ageRange="4-10"
            difficulty="easy"
            dinoVariant="green"
            stars={playerProfile?.highScores.math || 0}
          />
          
          <GameCard
            title="Counting Safari"
            description="Count dinosaurs, eggs, and more! Great for younger children learning numbers."
            gameType="counting"
            ageRange="2-6"
            difficulty="easy"
            dinoVariant="orange"
            stars={playerProfile?.highScores.counting || 0}
          />
          
          <GameCard
            title="Shape Explorer"
            description="Identify shapes and patterns with dinosaur guides. Learn geometry basics!"
            gameType="shapes"
            ageRange="3-7"
            difficulty="medium"
            dinoVariant="purple"
            stars={playerProfile?.highScores.shapes || 0}
          />
          
          <GameCard
            title="Dino Memory"
            description="Test your memory with dinosaur matching games. Improves focus and recall!"
            gameType="memory"
            ageRange="4-10"
            difficulty="medium"
            dinoVariant="blue"
            stars={playerProfile?.highScores.memory || 0}
          />
        </div>
      </section>
      
      {/* Learning categories */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-6">
          Learning Categories
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow p-6 border-l-4 border-primary-500"
          >
            <div className="mb-4 bg-primary-100 text-primary-700 p-3 rounded-lg inline-block">
              <Calculator className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Mathematics</h3>
            <p className="text-gray-600">Addition, subtraction, and number recognition for young learners.</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow p-6 border-l-4 border-secondary-500"
          >
            <div className="mb-4 bg-secondary-100 text-secondary-700 p-3 rounded-lg inline-block">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Counting</h3>
            <p className="text-gray-600">Learn to count objects and understand numbers in sequence.</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow p-6 border-l-4 border-accent-500"
          >
            <div className="mb-4 bg-accent-100 text-accent-700 p-3 rounded-lg inline-block">
              <Shapes className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Shapes</h3>
            <p className="text-gray-600">Identify different shapes and patterns in fun dinosaur adventures.</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500"
          >
            <div className="mb-4 bg-blue-100 text-blue-700 p-3 rounded-lg inline-block">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Memory</h3>
            <p className="text-gray-600">Improve memory and concentration with matching games.</p>
          </motion.div>
        </div>
      </section>
      
      {/* Features */}
      <section className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-6 md:p-8 mb-12">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-6">
          Why Parents & Kids Love Dino Math
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h3 className="font-display font-bold text-xl mb-2 text-primary-700">Age-Appropriate Learning</h3>
            <p className="text-gray-600">Content tailored for different age groups from 2-10 years old.</p>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h3 className="font-display font-bold text-xl mb-2 text-primary-700">Progress Tracking</h3>
            <p className="text-gray-600">Parents can monitor learning progress and achievements.</p>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h3 className="font-display font-bold text-xl mb-2 text-primary-700">Fun Characters</h3>
            <p className="text-gray-600">Lovable dinosaur guides make learning enjoyable and engaging.</p>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h3 className="font-display font-bold text-xl mb-2 text-primary-700">Reward System</h3>
            <p className="text-gray-600">Stars and achievements motivate continued learning.</p>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h3 className="font-display font-bold text-xl mb-2 text-primary-700">Adaptive Difficulty</h3>
            <p className="text-gray-600">Games adjust to your child's skill level for optimal learning.</p>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h3 className="font-display font-bold text-xl mb-2 text-primary-700">Ad-Free Experience</h3>
            <p className="text-gray-600">No ads or in-app purchases - just pure educational fun!</p>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="text-center py-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-800">
          Ready to Start Learning?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Dive into a world of fun, educational dinosaur adventures and watch your child's skills grow!
        </p>
        <Button 
          variant="primary" 
          size="lg" 
          rounded="full"
          className="px-10"
          onClick={() => soundManager.play('click')}
        >
          Choose a Game!
        </Button>
      </section>
    </div>
  );
};

export default HomePage;