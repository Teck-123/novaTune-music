import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArtist, getArtistTopTracks, getArtistAlbums } from '../services/deezerApi';
import MusicCard from '../components/MusicCard';

const Artist = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks' or 'albums'

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        const [artistData, tracks, artistAlbums] = await Promise.all([
          getArtist(id),
          getArtistTopTracks(id, 20),
          getArtistAlbums(id, 20)
        ]);
        
        setArtist(artistData);
        setTopTracks(tracks);
        setAlbums(artistAlbums);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load artist details.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtistData();
  }, [id]);

  if (loading) {
    return <div className="text-center text-xl mt-10">Loading artist details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-10">{error}</div>;
  }

  if (!artist) return <p>Artist not found.</p>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Artist Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img 
            src={artist.picture_xl || artist.picture_big} 
            alt={artist.name}
            className="w-48 h-48 rounded-full shadow-xl border-4 border-white"
          />
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-bold mb-2">{artist.name}</h1>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-lg">
              <div>
                <strong>{artist.nb_fan?.toLocaleString() || 'N/A'}</strong> Fans
              </div>
              <div>
                <strong>{artist.nb_album || 'N/A'}</strong> Albums
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b-2">
        <button
          onClick={() => setActiveTab('tracks')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'tracks' 
              ? 'border-b-4 border-blue-600 text-blue-600' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Top Tracks ({topTracks.length})
        </button>
        <button
          onClick={() => setActiveTab('albums')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'albums' 
              ? 'border-b-4 border-blue-600 text-blue-600' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Albums ({albums.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'tracks' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Popular Tracks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topTracks.map((track) => (
              <MusicCard key={track.id} song={track} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'albums' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => (
              <Link 
                key={album.id} 
                to={`/album/${album.id}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition"
              >
                <img 
                  src={album.cover_medium} 
                  alt={album.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="font-bold text-sm truncate">{album.title}</h3>
                <p className="text-xs text-gray-600">{album.release_date}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Artist;