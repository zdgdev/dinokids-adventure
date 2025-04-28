import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import DinoCharacter from '../components/common/DinoCharacter';
import { soundManager } from '../utils/soundManager';

const ShapesGamePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const goToHome = () => {
    navigate('/');
    soundManager.play('click');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <DinoCharacter variant="purple" size="lg" emotion="thinking" />
        <h2 className="text-2xl font-display font-bold mt-6 text-center">
          Loading Shape Explorer...
        </h2>
        <p className="text-gray-600 mt-2 text-center max-w-md">
          Our dinosaur friends are looking for shapes to share with you!
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
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
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-display font-bold text-accent-700 mb-6">
              Shape Explorer
            </h1>
            
            <div className="flex justify-center mb-8">
              <DinoCharacter variant="purple" size="lg" emotion="happy" />
            </div>
            
            <p className="text-xl text-gray-700 max-w-lg mx-auto mb-8">
              The Shape Explorer game is coming soon! Our dinosaur friends are still preparing this adventure.
            </p>
            
            <div className="bg-accent-50 p-6 rounded-lg max-w-md mx-auto mb-8">
              <h3 className="font-display font-bold text-lg text-accent-800 mb-2">
                What you'll learn:
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• Basic shapes recognition (circle, square, triangle)</li>
                <li>• Advanced shapes (oval, rectangle, pentagon, hexagon)</li>
                <li>• Shape patterns and sequences</li>
                <li>• 3D shapes introduction</li>
              </ul>
            </div>
            
            <Button
              variant="accent"
              size="lg"
              onClick={goToHome}
            >
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShapesGamePage;