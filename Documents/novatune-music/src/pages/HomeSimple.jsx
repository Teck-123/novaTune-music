import React, { useState, useEffect } from 'react';
import { getChartTracks } from '../services/deezerApi.js';

const HomeSimple = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        console.log('Fetching from Deezer API...');
        
        // Use our Deezer API service
        const data = await getChartTracks(10);
        
        console.log('API Response:', data);
        
        if (data) {
          setSongs(data);
          console.log('Songs set:', data.length);
        } else {
          setError('No data received from API');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchSongs();
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-600">Error: {error}</div>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-6">Simple Test - Trending Songs ({songs.length})</h1>
      
      {songs.length === 0 ? (
        <p className="text-center text-gray-600">No songs loaded</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {songs.map((song, index) => (
            <div key={song.id || index} className="bg-white p-4 rounded shadow">
              <img 
                src={song.album?.cover_medium || song.album?.cover || 'https://via.placeholder.com/150'} 
                alt={song.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-bold">{song.title || 'Unknown Title'}</h3>
              <p className="text-gray-600">{song.artist?.name || 'Unknown Artist'}</p>
              <p className="text-xs text-gray-400 mt-1">ID: {song.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeSimple;