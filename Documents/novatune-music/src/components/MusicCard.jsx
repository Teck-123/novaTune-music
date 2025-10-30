import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AudioContext } from '../context/AudioContext';
import { FaPlay, FaPause, FaHeart, FaCompactDisc } from 'react-icons/fa';


const MAX_PREVIEW_SEC = 30; 

const formatTrackTime = (secs) => {
  if (!secs || isNaN(secs)) return '0:00';
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const guessMusicGenre = (bpm) => {
  if (!bpm) return null;
  
  if (bpm < 70) return 'Ambient/Chill';
  if (bpm < 90) return 'Downtempo';
  if (bpm < 110) return 'Hip-Hop';
  if (bpm < 125) return 'House';
  if (bpm < 140) return 'Techno/Pop';
  if (bpm < 160) return 'Drum & Bass';
  return 'Hardcore/Speedcore';
};

const MusicCard = ({ song }) => {
  const { playSong, currentSong, isPlaying, togglePlayPause } = useContext(AudioContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  React.useEffect(() => {
    // Check if this song was favorited before
    const favs = localStorage.getItem('favorited_tracks');
    if (favs && song?.id) {
      try {
        const favsArray = JSON.parse(favs);
        setIsFavorited(favsArray.includes(song.id));
      } catch (e) {
        // localStorage parsing failed, oh well
      }
    }
  }, [song?.id]);

  if (!song) {
    return null;
  }

  if (!song.album || !song.artist) {
    console.warn(`Incomplete song data: ${song.id} - ${song.title || 'Unknown'}`);
    return null;
  }

  // Check if this is what's currently playing
  const isCurrentSong = currentSong && currentSong.id === song.id;
  
  const prev_quality = useMemo(() => {
    if (!song.preview) return 'unavailable';
    
    
    if (song.preview.includes('mp3-128')) return 'good';  
    if (song.preview.includes('mp3-64')) return 'medium';
    return 'potato-quality'; 
  }, [song.preview]);
  
  // Handle play button click
  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
   
    if (!song.preview) {
      console.warn(`No preview available for ${song.title}`);
      return;
    }
    
    if (isCurrentSong) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle favorite state
    const newState = !isFavorited;
    setIsFavorited(newState);
    
    
    try {
      const favs = localStorage.getItem('favorited_tracks');
      let favsArray = favs ? JSON.parse(favs) : [];
      
      if (newState) {
        favsArray.push(song.id);
      } else {
        favsArray = favsArray.filter(id => id !== song.id);
      }
      
      localStorage.setItem('favorited_tracks', JSON.stringify(favsArray));
    } catch (e) {
      console.error('Failed to save favorite state', e);
    }
  };

  return (
    <div 
      className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-glow overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Album art */}
        <img 
          src={song.album?.cover_medium || song.album?.cover} 
          alt={`${song.title} by ${song.artist.name}`} 
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-60"></div>
        
        {!song.preview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <FaCompactDisc size={30} className="text-white/50 animate-pulse" />
            <span className="absolute text-[10px] text-white/80 mt-6">No Preview</span>
          </div>
        )}
        
        {/* Play button - changes appearance when playing */}
        <button 
          onClick={handlePlayClick} 
          disabled={!song.preview}
          className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${!song.preview ? 'bg-gray-700 cursor-not-allowed' : isCurrentSong && isPlaying ? 'bg-green-500 scale-110' : 'bg-purple-600 hover:bg-purple-500'}`}
          title={!song.preview ? "No preview available" : isCurrentSong && isPlaying ? "Pause" : "Play preview"}
        >
          {isCurrentSong && isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
        </button>
        
        {/* Favorite button - only show on hover if not favorited */}
        <button 
          onClick={handleFavoriteClick} 
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${isFavorited ? 'text-red-500' : 'text-white opacity-0 group-hover:opacity-80'}`}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart size={16} className={isFavorited ? "animate-pulse" : ""} />
        </button>
        
        {song.explicit && (
          <span className="absolute top-3 left-3 bg-gray-800/70 text-xs text-white px-1.5 py-0.5 rounded">
            E
          </span>
        )}
        
        {prev_quality !== 'unavailable' && (
          <span className="absolute bottom-3 left-3 text-[10px] text-white/60">
            {prev_quality === 'good' ? 'HQ' : prev_quality === 'medium' ? 'SQ' : '💩'} 
          </span>
        )}
      </div>
      
      <div className="p-4 pt-3">
        {/* Song title  */}
        <Link to={`/song/${song.id}`} className="block">
          <h3 className="font-medium text-white truncate group-hover:text-purple-400 transition-colors">
            {song.title}
          </h3>
        </Link>
        
        {/* Artist info  */}
        <Link to={`/artist/${song.artist?.id}`} className="block">
          <p className="text-sm text-gray-400 truncate hover:text-purple-300 transition-colors">
            {song.artist?.name}
          </p>
        </Link>
        
        {/* Song metadata  */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {song.duration && (
              <p title="Track duration">
                {formatTrackTime(song.duration)}
              </p>
            )}
            
            {/* Show BPM if available */}
            {song.bpm > 0 && (
              <span title="Beats per minute" className="text-gray-600">
                {song.bpm} BPM
              </span>
            )}
          </div>
          {song.album && (
            <Link to={`/album/${song.album.id}`} className="truncate hover:text-gray-300 transition-colors max-w-[70%] text-right">
              {song.album.title}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
