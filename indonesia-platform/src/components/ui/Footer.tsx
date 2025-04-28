import { Heart, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { soundManager } from '../../utils/soundManager';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-center md:text-left">
              © {currentYear} Dino Math Adventure - Dikembangkan oleh Zeroday Development Groups
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/about" 
              className="text-sm hover:text-secondary-300 transition-colors"
              onClick={() => soundManager.play('click')}
            >
              Tentang
            </Link>
            <Link 
              to="/privacy" 
              className="text-sm hover:text-secondary-300 transition-colors"
              onClick={() => soundManager.play('click')}
            >
              Privasi
            </Link>
            <Link 
              to="/parent-guide" 
              className="text-sm hover:text-secondary-300 transition-colors"
              onClick={() => soundManager.play('click')}
            >
              Panduan Orang Tua
            </Link>
            <a 
              href="https://github.com/zdgdev/dinokids-adventure" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:text-secondary-300 transition-colors flex items-center"
              onClick={() => soundManager.play('click')}
            >
              <Github className="w-4 h-4 mr-1" />
              GitHub
            </a>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center items-center text-xs text-gray-400">
          <p className="flex items-center">
            Dibuat dengan <Heart className="w-3 h-3 mx-1 text-red-500" /> untuk pembelajaran anak-anak di mana saja
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;