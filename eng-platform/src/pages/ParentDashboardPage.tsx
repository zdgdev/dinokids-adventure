import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Bell, Settings, UserCircle, Volume2, Award, 
  BarChart, Brain, LogOut, Save, VolumeX 
} from 'lucide-react';
import Button from '../components/common/Button';
import DinoCharacter from '../components/common/DinoCharacter';
import { useGameStore } from '../store/gameStore';
import { PlayerProfile, AgeGroup } from '../types';
import { soundManager } from '../utils/soundManager';

const ParentDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [effectsVolume, setEffectsVolume] = useState(0.7);
  const [musicVolume, setMusicVolume] = useState(0.5);
  
  // Get player profile from global state
  const playerProfile = useGameStore((state) => state.playerProfile);
  const updatePlayerProfile = useGameStore((state) => state.updatePlayerProfile);
  
  // Local state for editing
  const [editedProfile, setEditedProfile] = useState<Partial<PlayerProfile>>(
    playerProfile ? {
      name: playerProfile.name,
      age: playerProfile.age,
      ageGroup: playerProfile.ageGroup,
      avatarId: playerProfile.avatarId,
    } : {
      name: 'Dino Explorer',
      age: 5,
      ageGroup: '5-7',
      avatarId: 1,
    }
  );
  
  // Toggle sound
  const toggleSound = () => {
    const newMuteState = soundManager.toggleMute();
    setIsMuted(newMuteState);
  };
  
  // Update effects volume
  const handleEffectsVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setEffectsVolume(volume);
    soundManager.setEffectsVolume(volume);
  };
  
  // Update music volume
  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setMusicVolume(volume);
    soundManager.setMusicVolume(volume);
  };
  
  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setEditedProfile({
      ...editedProfile,
      [name]: name === 'age' ? parseInt(value) : value,
    });
  };
  
  // Save profile changes
  const saveProfile = () => {
    if (editedProfile) {
      updatePlayerProfile(editedProfile);
      setIsEditing(false);
      soundManager.play('click');
    }
  };
  
  // Navigate back to home
  const goToHome = () => {
    navigate('/');
    soundManager.play('click');
  };
  
  // Get avatar URL
  const getAvatarUrl = (avatarId: number) => {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarId}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };
  
  // Get achievement progress
  const getHighestScore = () => {
    if (!playerProfile) return 0;
    
    return Math.max(
      playerProfile.highScores.math || 0,
      playerProfile.highScores.counting || 0,
      playerProfile.highScores.shapes || 0,
      playerProfile.highScores.memory || 0
    );
  };
  
  // Get total games played
  const getTotalGamesPlayed = () => {
    if (!playerProfile) return 0;
    
    return Object.values(playerProfile.highScores).filter(score => score > 0).length;
  };
  
  // Get recommended games based on age group
  const getRecommendedGames = () => {
    if (!playerProfile) return [];
    
    switch(playerProfile.ageGroup) {
      case '2-4':
        return ['counting', 'shapes'];
      case '5-7':
        return ['math', 'counting', 'shapes'];
      case '8-10':
        return ['math', 'memory'];
      default:
        return ['math', 'counting'];
    }
  };
  
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
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <h1 className="text-3xl font-display font-bold">Parent Dashboard</h1>
            <p className="opacity-90">Manage your child's learning journey</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 bg-gray-50 p-6">
              <ul className="space-y-2">
                <li>
                  <Button 
                    variant={activeTab === 'profile' ? 'primary' : 'secondary'}
                    className={`justify-start w-full ${activeTab === 'profile' ? '' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                    icon={<UserCircle className="w-5 h-5" />}
                    onClick={() => {
                      setActiveTab('profile');
                      soundManager.play('click');
                    }}
                  >
                    Child Profile
                  </Button>
                </li>
                <li>
                  <Button 
                    variant={activeTab === 'progress' ? 'primary' : 'secondary'}
                    className={`justify-start w-full ${activeTab === 'progress' ? '' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                    icon={<BarChart className="w-5 h-5" />}
                    onClick={() => {
                      setActiveTab('progress');
                      soundManager.play('click');
                    }}
                  >
                    Learning Progress
                  </Button>
                </li>
                <li>
                  <Button 
                    variant={activeTab === 'settings' ? 'primary' : 'secondary'}
                    className={`justify-start w-full ${activeTab === 'settings' ? '' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                    icon={<Settings className="w-5 h-5" />}
                    onClick={() => {
                      setActiveTab('settings');
                      soundManager.play('click');
                    }}
                  >
                    Settings
                  </Button>
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Signed in as:</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    P
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Parent</p>
                    <button 
                      className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
                      onClick={() => soundManager.play('click')}
                    >
                      <LogOut className="w-3 h-3 mr-1" /> 
                      Switch Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-gray-800">
                      Child Profile
                    </h2>
                    
                    {!isEditing ? (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => {
                          setIsEditing(true);
                          soundManager.play('click');
                        }}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            setEditedProfile(playerProfile ? {
                              name: playerProfile.name,
                              age: playerProfile.age,
                              ageGroup: playerProfile.ageGroup,
                              avatarId: playerProfile.avatarId,
                            } : {
                              name: 'Dino Explorer',
                              age: 5,
                              ageGroup: '5-7',
                              avatarId: 1,
                            });
                            soundManager.play('click');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="success" 
                          size="sm"
                          icon={<Save className="w-4 h-4" />}
                          onClick={saveProfile}
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start">
                      <div className="mb-4 sm:mb-0 sm:mr-6">
                        {playerProfile && (
                          <img 
                            src={getAvatarUrl(playerProfile.avatarId)} 
                            alt="Avatar" 
                            className="w-24 h-24 rounded-full border-4 border-primary-200"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        {!isEditing ? (
                          <>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              {playerProfile?.name || 'Dino Explorer'}
                            </h3>
                            <p className="text-gray-600 mb-3">
                              Age: {playerProfile?.age || 5} years old
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs font-medium bg-primary-100 text-primary-800 rounded-full px-2 py-1">
                                Age Group: {playerProfile?.ageGroup || '5-7'}
                              </span>
                              <span className="text-xs font-medium bg-secondary-100 text-secondary-800 rounded-full px-2 py-1">
                                Stars: {playerProfile?.stars || 0}
                              </span>
                              <span className="text-xs font-medium bg-accent-100 text-accent-800 rounded-full px-2 py-1">
                                Games Played: {getTotalGamesPlayed()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Child's Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={editedProfile?.name || ''}
                                onChange={handleProfileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age
                              </label>
                              <input
                                type="number"
                                name="age"
                                min="2"
                                max="10"
                                value={editedProfile?.age || 5}
                                onChange={handleProfileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age Group
                              </label>
                              <select
                                name="ageGroup"
                                value={editedProfile?.ageGroup || '5-7'}
                                onChange={handleProfileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <option value="2-4">2-4 years</option>
                                <option value="5-7">5-7 years</option>
                                <option value="8-10">8-10 years</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Recommended Games
                    </h3>
                    
                    <div className="space-y-4">
                      {getRecommendedGames().map((game) => (
                        <div key={game} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                          <div className="mr-4">
                            <DinoCharacter 
                              variant={
                                game === 'math' ? 'green' : 
                                game === 'counting' ? 'orange' : 
                                game === 'shapes' ? 'purple' : 'blue'
                              } 
                              size="sm"
                              emotion="happy"
                              animate={false}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">
                              {game === 'math' ? 'Math Adventure' : 
                               game === 'counting' ? 'Counting Safari' : 
                               game === 'shapes' ? 'Shape Explorer' : 'Memory Match'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Perfect for age group {playerProfile?.ageGroup || '5-7'}
                            </p>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => {
                              navigate(`/${game}-game`);
                              soundManager.play('click');
                            }}
                          >
                            Play
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Progress Tab */}
              {activeTab === 'progress' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
                    Learning Progress
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-secondary-500" />
                        Achievements
                      </h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            Stars Collected
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" />
                          <span className="font-bold">{playerProfile?.stars || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            Highest Score
                          </p>
                        </div>
                        <span className="font-bold">{getHighestScore()}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            Games Played
                          </p>
                        </div>
                        <span className="font-bold">{getTotalGamesPlayed()}/4</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-primary-500" />
                        Skills Progress
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-medium text-gray-700">Math</p>
                            <p className="text-sm font-medium text-gray-700">
                              {playerProfile?.highScores.math ? 'Started' : 'Not Started'}
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary-500 h-2 rounded-full" 
                              style={{ width: `${playerProfile?.highScores.math ? Math.min(100, playerProfile.highScores.math / 2) : 0}%` }}>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-medium text-gray-700">Counting</p>
                            <p className="text-sm font-medium text-gray-700">
                              {playerProfile?.highScores.counting ? 'Started' : 'Not Started'}
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-secondary-500 h-2 rounded-full" 
                              style={{ width: `${playerProfile?.highScores.counting ? Math.min(100, playerProfile.highScores.counting / 2) : 0}%` }}>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-medium text-gray-700">Shapes</p>
                            <p className="text-sm font-medium text-gray-700">
                              {playerProfile?.highScores.shapes ? 'Started' : 'Not Started'}
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-accent-500 h-2 rounded-full" 
                              style={{ width: `${playerProfile?.highScores.shapes ? Math.min(100, playerProfile.highScores.shapes / 2) : 0}%` }}>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Play History
                    </h3>
                    
                    {getTotalGamesPlayed() > 0 ? (
                      <div className="space-y-4">
                        {playerProfile?.highScores.math ? (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="mr-4">
                              <DinoCharacter variant="green" size="sm" emotion="happy" animate={false} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Math Adventure</p>
                              <p className="text-sm text-gray-600">High Score: {playerProfile.highScores.math}</p>
                            </div>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => {
                                navigate('/math-game');
                                soundManager.play('click');
                              }}
                            >
                              Play Again
                            </Button>
                          </div>
                        ) : null}
                        
                        {playerProfile?.highScores.counting ? (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="mr-4">
                              <DinoCharacter variant="orange" size="sm" emotion="happy" animate={false} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Counting Safari</p>
                              <p className="text-sm text-gray-600">High Score: {playerProfile.highScores.counting}</p>
                            </div>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => {
                                navigate('/counting-game');
                                soundManager.play('click');
                              }}
                            >
                              Play Again
                            </Button>
                          </div>
                        ) : null}
                        
                        {playerProfile?.highScores.shapes ? (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="mr-4">
                              <DinoCharacter variant="purple" size="sm" emotion="happy" animate={false} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Shape Explorer</p>
                              <p className="text-sm text-gray-600">High Score: {playerProfile.highScores.shapes}</p>
                            </div>
                            <Button 
                              variant="accent" 
                              size="sm"
                              onClick={() => {
                                navigate('/shapes-game');
                                soundManager.play('click');
                              }}
                            >
                              Play Again
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No games played yet.</p>
                        <Button
                          variant="primary"
                          onClick={() => {
                            navigate('/');
                            soundManager.play('click');
                          }}
                        >
                          Start Playing
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
                    Settings
                  </h2>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Volume2 className="w-5 h-5 mr-2 text-primary-500" />
                      Sound Settings
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Sound Effects</p>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={effectsVolume}
                            onChange={handleEffectsVolumeChange}
                            className="w-32 mr-4"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            onClick={toggleSound}
                          >
                            {isMuted ? 'Unmute' : 'Mute'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Background Music</p>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={musicVolume}
                          onChange={handleMusicVolumeChange}
                          className="w-32"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-primary-500" />
                      Notifications
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Achievement Alerts</p>
                          <p className="text-sm text-gray-600">Notify when your child earns new achievements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Progress Reminders</p>
                          <p className="text-sm text-gray-600">Weekly progress summaries</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-primary-500" />
                      Game Settings
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Learning Level Adaptation</p>
                          <p className="text-sm text-gray-600">Automatically adjust difficulty based on performance</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Animation Intensity</p>
                          <p className="text-sm text-gray-600">Control the amount of animations</p>
                        </div>
                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5">
                          <option value="high">High</option>
                          <option value="medium" selected>Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardPage;