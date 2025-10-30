import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AudioContext } from '../context/AudioContext';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward, 
         FaHeart, FaEllipsisH } from 'react-icons/fa';


const DEFAULT_VOLUME = 0.7; 
const VOLUME_STEP = 0.05;    
const SEEK_STEP = 5;        

const calculateLoudness = (audioEl) => {
  if (!audioEl || !audioEl.currentTime) return 0;
  
  
  const currentVolume = audioEl.volume || 0;
  const randomFactor = (Math.sin(Date.now() / 200) + 1) / 2; 
  return currentVolume * 0.7 + randomFactor * 0.3; 
};

const AudioPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlayPause, 
    progress, 
    volume, 
    currentTime, 
    duration,
    seekToPosition,
    setAudioVolume
  } = useContext(AudioContext);
  
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showOptions, setShowOptions] = useState(false);  
  const previousVolume = useRef(volume);  
  
  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!currentSong || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          seekToPosition(((currentTimeRef.current + SEEK_STEP) / duration) * 100);
          break;
        case 'ArrowLeft':
          seekToPosition(((currentTimeRef.current - SEEK_STEP) / duration) * 100);
          break;
        case 'ArrowUp':
          setAudioVolume(Math.min(1, volume + VOLUME_STEP));
          break;
        case 'ArrowDown':
          setAudioVolume(Math.max(0, volume - VOLUME_STEP));
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSong, duration, togglePlayPause, seekToPosition, volume, setAudioVolume]);
  
  
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds) || timeInSeconds < 0) return '0:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  const timeRemaining = useMemo(() => {
    if (!duration || !currentTime) return 0;
    return Math.max(0, duration - currentTime);
  }, [duration, currentTime]);
  
  const handleProgressChange = (e) => {
    
    const newPosition = parseFloat(e.target.value);
    seekToPosition(newPosition);
    
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setAudioVolume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      setAudioVolume(0);
    }
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setAudioVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const isNearingEnd = useMemo(() => {
    if (!duration || !currentTime) return false;
    return duration - currentTime < 5; 
  }, [duration, currentTime]);

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 text-gray-400 p-4 z-50">
        <div className="container mx-auto text-center">
          <p className="text-sm">Select a track to start listening</p>
          <div className="flex justify-center mt-1 gap-1">
            <div className="w-1 h-3 bg-gray-700 rounded-full"></div>
            <div className="w-1 h-2 bg-gray-700 rounded-full"></div>
            <div className="w-1 h-4 bg-gray-700 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
            <div className="w-1 h-3 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md text-white border-t ${isNearingEnd ? 'border-red-800/40 animate-pulse' : 'border-gray-800'} p-4 shadow-2xl z-50`}>
      <div className="container mx-auto flex items-center gap-4">
        {/* Album Art */}
        <Link to={`/song/${currentSong.id}`} className="hidden sm:block">
          <img 
            src={currentSong.album?.cover_medium || currentSong.album?.cover_small} 
            alt={currentSong.title} 
            className="w-14 h-14 rounded-md shadow-lg hover:scale-105 transition"
          />
        </Link>
        
        {/* Song Info */}
        <div className="flex-1 min-w-0 sm:max-w-[180px]">
          <Link to={`/song/${currentSong.id}`}>
            <h4 className="font-medium truncate hover:text-purple-400 transition">
              {currentSong.title}
            </h4>
          </Link>
          <Link to={`/artist/${currentSong.artist?.id}`}>
            <p className="text-sm text-gray-400 truncate hover:text-purple-400 transition">
              {currentSong.artist?.name}
            </p>
          </Link>
        </div>
        
        {/* Controls */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-1">
            <button 
              className="text-gray-400 hover:text-white transition" 
              title="Previous" 
              aria-label="Previous song"
              onClick={() => {/* Previous song logic would go here */}}
            >
              <FaStepBackward />
            </button>
            
            <button 
              onClick={togglePlayPause} 
              className={`bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full transition shadow-lg hover:shadow-xl transform hover:scale-105`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
            </button>
            
            <button 
              className="text-gray-400 hover:text-white transition" 
              title="Next" 
              aria-label="Next song"
              onClick={() => {/* Next song logic would go here */}}
            >
              <FaStepForward />
            </button>
          </div>
          

          <div className="w-full flex items-center gap-2 px-4">
            <span className="text-xs text-gray-400 w-8 text-right" title="Current position">{formatTime(currentTime)}</span>
            <div className="relative w-full">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 accent-purple-500 cursor-pointer z-10 relative"
                aria-label="Song progress"
              />
             
              {isNearingEnd && (
                <div className="absolute right-0 -top-6 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Preview ending soon
                </div>
              )}
            </div>
            <span className="text-xs text-gray-400 w-8" title="Total duration">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Volume control */}
        <div 
          className="hidden sm:flex items-center relative"
          onMouseEnter={() => setShowVolumeControl(true)}
          onMouseLeave={() => setShowVolumeControl(false)}
        >
          <button 
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition p-2"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          
          <div className={`absolute bottom-full mb-2 bg-gray-800 p-2 rounded-lg transition-opacity ${showVolumeControl ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-purple-500"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;