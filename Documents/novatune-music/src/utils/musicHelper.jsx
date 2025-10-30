// musicHelpers.js

export const detectMusicalKey = (features) => {

  if (!features) return 'Unknown';
  
  const keys = [
    'C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 
    'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'
  ];
  
  if (features.key !== undefined) {
    return keys[features.key];
  }
  
  return 'Unknown';
};

export const formatTrackTime = (ms, showHours = false) => {
  if (!ms || isNaN(ms)) return '0:00';
  
  // Convert to seconds
  const totalSeconds = Math.floor(ms / 1000);
  
  // Extract hours, minutes and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  // Format based on duration
  if (showHours || hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getEnergyLevel = (bpm, loudness) => {
  if (!bpm) return 'medium';
  
  // BPM is the main factor
  if (bpm < 80) return 'low';
  if (bpm > 130) return 'high';
  
  // Loudness affects perceived energy
  if (loudness && loudness < -12) return 'low';
  if (loudness && loudness > -8) return 'high';
  
  return 'medium';
};


export const isRadioFriendly = (track) => {
  if (!track) return false;
  
  if (track.explicit) return false;
 
  const durationInMin = (track.duration || 0) / 60;
  if (durationInMin < 1 || durationInMin > 5.5) return false;
  
  return true;
};

export const getRelatedKeys = (key) => {
  const keyMap = {
    'C': ['Am', 'F', 'G'],
    'G': ['Em', 'C', 'D'],
    'D': ['Bm', 'G', 'A'],
    'A': ['F#m', 'D', 'E'],
    'E': ['C#m', 'A', 'B'],
    'B': ['G#m', 'E', 'F#'],
    'F#': ['D#m', 'B', 'C#'],
    'C#': ['A#m', 'F#', 'G#'],
    'F': ['Dm', 'Bb', 'C'],
    'Bb': ['Gm', 'Eb', 'F'],
    'Eb': ['Cm', 'Ab', 'Bb'],
    'Ab': ['Fm', 'Db', 'Eb'],
  };
  
  return keyMap[key] || [];
};


export const debounceAudioEvent = (func, wait) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};


export const findCompatibleTracks = (sourceTracks, targetTrack) => {
  if (!targetTrack || !sourceTracks?.length) return [];
  
  const targetBpm = targetTrack.bpm || 0;
  const targetKey = targetTrack.key || -1;
 
  return sourceTracks.filter(track => {
    const bpmMatch = Math.abs(track.bpm - targetBpm) / targetBpm < 0.05;
    const keyMatch = track.key === targetKey || 
                    track.key === (targetKey + 7) % 12 || 
                    track.key === (targetKey + 5) % 12;   
    
    return bpmMatch && keyMatch;
  });
};

export default {
  detectMusicalKey,
  formatTrackTime,
  getEnergyLevel,
  isRadioFriendly,
  getRelatedKeys,
  debounceAudioEvent,
  findCompatibleTracks
};
