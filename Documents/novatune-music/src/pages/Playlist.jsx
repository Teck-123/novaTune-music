import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import MusicCard from '../components/MusicCard';
import { AuthContext } from '../context/AuthContext';

const Playlist = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const docRef = doc(db, 'playlists', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().userId === currentUser?.uid) {
        setPlaylist(docSnap.data());
      }
    };
    if (currentUser) fetchPlaylist();
  }, [id, currentUser]);

  if (!playlist) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{playlist.name}</h1>
      <div className="grid grid-cols-4 gap-4">
        {playlist.songs?.map((song) => <MusicCard key={song.id} song={song} />)} 
      </div>
    </div>
  );
};

export default Playlist;