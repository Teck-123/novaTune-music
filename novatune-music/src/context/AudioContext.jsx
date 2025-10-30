import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

const createAudioElement = () => {
  const audio = new Audio();
  
  if (isSafari || isIOS) {
    audio.preload = 'auto';
    audio.controls = false;
  }
  
  return audio;
};

export const AudioContext = createContext();

// The rate at which we update the UI during playback
const UI_UPDATE_INTERVAL = 250;

export const AudioProvider = ({ children }) => {
  // Track state
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [volume, setVolume] = useState(isIOS ? 1.0 : 0.7);  
  const [duration, setDuration] = useState(0);  
  const [currentTime, setCurrentTime] = useState(0); 
  
  // Playback history 
  const [songHistory, setSongHistory] = useState([]);
  
  // Audio object 
  const audioRef = useRef(createAudioElement());
  
  const lastUpdateRef = useRef(0);
  
  // Initialize audio settings & event listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    
    const handleTimeUpdate = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current > UI_UPDATE_INTERVAL) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
        lastUpdateRef.current = now;
      }
    };
    
  
    const handleLoadedMetadata = () => {
      const audioDuration = isFinite(audio.duration) ? audio.duration : 30;
      setDuration(audioDuration);
    };
    
    const handleEnded = () => {
      console.log('Track ended:', currentSong?.title);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    
    const handleStalled = () => {
      if (isPlaying && audio.currentTime > 0) {
        console.log('Playback stalled, attempting recovery...');
        audio.currentTime = audio.currentTime; 
        audio.play().catch(err => console.warn('Recovery failed:', err));
      }
    };
    
    // Add event listeners 
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('stalled', handleStalled);
    
    // Cleanup
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('stalled', handleStalled);
    };
  }, [volume, isPlaying, currentSong]);
  
  // Track playback 
  const playSong = useCallback((song) => {
    try {
      if (!song) {
        console.warn('playSong called with null/undefined song');
        return;
      }
      
      if (!song.preview) {
        console.warn(`Song "${song.title}" has no preview URL`);
      return;
      }
      
      if (typeof song.preview !== 'string' || !song.preview.startsWith('http')) {
        console.error(`Invalid preview URL for "${song.title}": ${song.preview}`);
        return;
      }
      
      const audioEl = audioRef.current;  
      const songChanged = !currentSong || currentSong.id !== song.id;  
      
      if (songChanged) {
        if (currentSong) {
          setSongHistory(oldHist => {
            const freshHistory = [currentSong, ...oldHist.slice(0, 9)];
            return freshHistory.filter(
              (track, idx) => freshHistory.findIndex(h => h.id === track.id) === idx
            );
          });
        }
        
        // Load new song
        audioEl.src = song.preview;
    
        const canPlayHandler = () => {
          console.log(`Audio track "${song.title}" is ready to play`);
          audioEl.removeEventListener('canplaythrough', canPlayHandler);
        };
        audioEl.addEventListener('canplaythrough', canPlayHandler);
        
        // Also handle loading errors
        const errorHandler = (e) => {
          console.error(`Error loading audio for "${song.title}":`, e);
          audioEl.removeEventListener('error', errorHandler);
        };
        audioEl.addEventListener('error', errorHandler);
        
        audioEl.load();
        
        // Reset state
        setCurrentSong(song);
        setProgress(0);
        setCurrentTime(0);
        lastUpdateRef.current = Date.now();
      }
      
      audioEl.play().catch(err => {
        console.error(`Failed to play "${song.title}":`, err.message);
        setIsPlaying(false);
        
        // Log more detailed error information
        if (err.name === 'NotAllowedError') {
          console.warn('Autoplay was blocked by the browser. User interaction is required first.');
        } else if (err.name === 'NotSupportedError') {
          console.error('Audio format is not supported by this browser.');
        } else if (err.name === 'AbortError') {
          console.error('Audio playback was aborted.');
        } else {
          console.error('Unknown audio playback error:', err);
        }
        
      });
      
      setIsPlaying(true);
    } catch (error) {
      console.error('Unexpected error in playSong:', error);
      setIsPlaying(false);
    }
  }, [currentSong]);
  
  // Pause playback 
  const pauseSong = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // Toggle play/pause 
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseSong();
    } else if (currentSong) {
      playSong(currentSong);
    }
  }, [isPlaying, currentSong, pauseSong, playSong]);
  
  // Alias for togglePlay
  const togglePlayPause = togglePlay;
  
  // Set volume 
  const setAudioVolume = useCallback((value) => {
    const newVolume = Math.max(0, Math.min(1, value));
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('preferred_volume', newVolume.toString());
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);
  
  
  const seekToPosition = useCallback((percent) => {
    if (!duration) return;
    
    const newTime = (percent / 100) * duration;
    
    try {
      // Set the time on the audio element
      audioRef.current.currentTime = newTime;
      
      // Update our state 
      setCurrentTime(newTime);
      setProgress(percent);
      lastUpdateRef.current = Date.now();
    } catch (e) {
      console.error('Error seeking:', e);
     
    }
  }, [duration]);
  
  const getAudioElement = useCallback(() => {
    return audioRef.current;
  }, []);
  
  useEffect(() => {
    if (isIOS) return;
    
    try {
      const savedVolume = localStorage.getItem('preferred_volume');
      if (savedVolume !== null) {
        const parsedVolume = parseFloat(savedVolume);
        if (!isNaN(parsedVolume)) {
          setAudioVolume(parsedVolume);
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [setAudioVolume]);

  return (
    <AudioContext.Provider 
      value={{
        // Track data
        currentSong,
        songHistory,
        
        // Playback state
        isPlaying,
        progress,
        volume,
        duration,
        currentTime,
        
        // Control functions
        playSong,
        pauseSong,
        togglePlay,
        togglePlayPause,
        setAudioVolume,
        seekToPosition,
        getAudioElement,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};