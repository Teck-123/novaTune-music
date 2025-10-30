import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Library = () => {
  const { currentUser } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchPlaylists = async () => {
      const q = query(collection(db, 'playlists'), where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(q);
      setPlaylists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPlaylists();
  }, [currentUser]);

  if (!currentUser) return <p>Please login to access library.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Library</h1>
      <div className="grid grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="bg-white p-4 rounded ">
            <h3>{playlist.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Library;