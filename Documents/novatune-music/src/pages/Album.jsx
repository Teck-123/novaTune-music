import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAlbum } from '../services/deezerApi';
import { AudioContext } from '../context/AudioContext';

const Album = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong } = useContext(AudioContext);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setLoading(true);
        const albumData = await getAlbum(id);
        setAlbum(albumData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load album details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumData();
  }, [id]);

  if (loading) {
    return <div className="text-center text-xl mt-10">Loading album details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-10">{error}</div>;
  }

  if (!album) return <p>Album not found.</p>;

  const totalDuration = album.tracks?.data.reduce((acc, track) => acc + track.duration, 0) || 0;
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Album Header */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <img 
            src={album.cover_xl || album.cover_big} 
            alt={album.title}
            className="w-full md:w-80 h-80 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-500 uppercase mb-2">Album</p>
            <h1 className="text-4xl font-bold mb-3 text-gray-800">{album.title}</h1>
            <Link 
              to={`/artist/${album.artist.id}`}
              className="text-2xl text-blue-600 hover:underline mb-4 block"
            >
              {album.artist.name}
            </Link>
            
            <div className="text-gray-700 space-y-1 mb-6">
              <p><strong>Release Date:</strong> {album.release_date}</p>
              <p><strong>Tracks:</strong> {album.nb_tracks}</p>
              <p><strong>Duration:</strong> {hours > 0 ? `${hours}h ` : ''}{minutes}min</p>
              {album.genres?.data && album.genres.data.length > 0 && (
                <p><strong>Genre:</strong> {album.genres.data.map(g => g.name).join(', ')}</p>
              )}
              {album.fans && <p><strong>Fans:</strong> {album.fans.toLocaleString()}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Tracks</h2>
        <div className="space-y-2">
          {album.tracks?.data.map((track, index) => (
            <div 
              key={track.id}
              className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded transition group"
            >
              <span className="text-gray-500 w-8 text-center">{index + 1}</span>
              <div className="flex-1">
                <Link 
                  to={`/song/${track.id}`}
                  className="font-semibold text-gray-800 hover:text-blue-600"
                >
                  {track.title}
                </Link>
                {track.explicit_lyrics && (
                  <span className="ml-2 text-xs bg-gray-800 text-white px-2 py-0.5 rounded">E</span>
                )}
              </div>
              <span className="text-gray-500 text-sm">
                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </span>
              <button
                onClick={() => playSong(track)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition"
              >
                Play
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Album;