import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AudioContext } from '../context/AudioContext';
import { getTrack, getArtistTopTracks } from '../services/deezerApi';
import MusicCard from '../components/MusicCard';

const Song = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [relatedTracks, setRelatedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong } = useContext(AudioContext);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        setLoading(true);
        const trackData = await getTrack(id);
        setSong(trackData);
        
        // Fetch related tracks from the same artist
        if (trackData.artist?.id) {
          const artistTracks = await getArtistTopTracks(trackData.artist.id, 6);
          // Filter out the current song
          const filtered = artistTracks.filter(track => track.id !== trackData.id);
          setRelatedTracks(filtered.slice(0, 5));
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load song details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSongDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center text-xl mt-10">Loading song details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-10">{error}</div>;
  }

  if (!song) return <p>Song not found.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <img 
            src={song.album.cover_xl || song.album.cover_big} 
            alt={song.title} 
            className="w-full md:w-80 h-80 object-cover rounded-lg shadow-md" 
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">{song.title}</h1>
            <Link to={`/artist/${song.artist.id}`} className="text-2xl text-blue-600 hover:underline mb-2 block">
              {song.artist.name}
            </Link>
            <Link to={`/album/${song.album.id}`} className="text-lg text-gray-600 hover:underline mb-4 block">
              Album: {song.album.title}
            </Link>
            
            <div className="mb-4 text-gray-700">
              <p><strong>Duration:</strong> {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</p>
              <p><strong>Release Date:</strong> {song.release_date}</p>
              {song.bpm && <p><strong>BPM:</strong> {song.bpm}</p>}
              {song.rank && <p><strong>Popularity:</strong> {song.rank.toLocaleString()}</p>}
            </div>
            
            <button 
              onClick={() => playSong(song)} 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
            >
              ▶ Play Preview
            </button>
          </div>
        </div>
      </div>

      {relatedTracks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">More from {song.artist.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedTracks.map((track) => (
              <MusicCard key={track.id} song={track} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Song;