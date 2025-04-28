import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Volume2, VolumeX, Settings } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { soundManager } from '../../utils/soundManager';
import DinoLogo from '../common/DinoLogo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const location = useLocation();
  const playerProfile = useGameStore((state) => state.playerProfile);
  
  const toggleMenu = () => {
    soundManager.play('click');
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleSound = () => {
    const newMuteState = soundManager.toggleMute();
    setIsMuted(newMuteState);
    soundManager.play('click');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/math-game', label: 'Petualangan Matematika' },
    { path: '/counting-game', label: 'Safari Berhitung' },
    { path: '/shapes-game', label: 'Penjelajah Bentuk' },
    { path: '/parent-dashboard', label: 'Area Orang Tua' },
  ];

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo dan Judul */}
        <Link to="/" className="flex items-center space-x-2" onClick={() => soundManager.play('click')}>
          <DinoLogo size={40} className="text-secondary-300" />
          <span className="text-2xl font-display font-bold">Dino Math</span>
        </Link>
        
        {/* Navigasi - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-display text-lg transition-all duration-300 hover:text-secondary-300 ${
                isActive(link.path) 
                  ? 'text-secondary-300 font-bold' 
                  : 'text-white'
              }`}
              onClick={() => soundManager.play('click')}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Info pengguna dan kontrol */}
        <div className="flex items-center space-x-4">
          {/* Info profil jika sudah login */}
          {playerProfile && (
            <div className="hidden md:flex items-center bg-white/20 rounded-full px-3 py-1">
              <div className="w-8 h-8 bg-secondary-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">
                  {playerProfile.name.charAt(0)}
                </span>
              </div>
              <div className="ml-2">
                <p className="text-sm font-bold">{playerProfile.name}</p>
                <div className="flex items-center">
                  <span className="text-xs">⭐ {playerProfile.stars}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Tombol suara */}
          <button 
            onClick={toggleSound}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
          
          {/* Pengaturan - Desktop */}
          <Link 
            to="/parent-dashboard" 
            className="hidden md:flex p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Pengaturan"
            onClick={() => soundManager.play('click')}
          >
            <Settings className="w-6 h-6" />
          </Link>
          
          {/* Tombol menu mobile */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-white/20 transition-colors"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Navigasi Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-700 py-4 px-4 absolute w-full z-50 shadow-xl animate-[fadeIn_0.2s_ease-in-out]">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-display text-lg px-3 py-2 rounded transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-800 text-secondary-300 font-bold'
                    : 'text-white hover:bg-primary-800'
                }`}
                onClick={() => {
                  toggleMenu();
                  soundManager.play('click');
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;