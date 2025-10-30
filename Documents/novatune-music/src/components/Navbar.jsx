import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaMusic, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  
  if (process.env.NODE_ENV === 'development' && false) { 
    console.log('Navbar auth debug:', currentUser?.email || 'no user');
  }
  
  const loc = useLocation(); 
  const nav = useNavigate();
  const [srchQry, setSearchQuery] = useState(''); 

  const isActive = (path) => {
    return loc.pathname === path ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (srchQry && srchQry.trim().length > 0) { 
      nav(`/search?q=${encodeURIComponent(srchQry)}`);
      setSearchQuery('');
    }
  };
  

  const combine_classes = (...classes) => classes.filter(Boolean).join(' ');
  
  let NavLinks = [
    { to: '/', icon: FaHome, label: 'Home', id: 'nav_home' },
    { to: '/library', icon: FaMusic, label: 'Your Library', id: 'nav_lib' },
  ];

  return (
    <nav className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-4">  
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <FaMusic className={combine_classes("text-purple-500", currentUser && "animate-pulse")} />
          <span>BeatStream</span> 
        </Link>
    
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={srchQry}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Find tracks, artists..."
              aria-label="Search music" 
            />
          </div>
        </form>
      </div>
      
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <div className="space-y-2">
          {NavLinks.map(link => {
            const Icon = link.icon;  
            return (
              <Link 
                key={link.id}
                to={link.to} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(link.to)}`}
                data-testid={link.id} 
              >
                <Icon className="text-lg" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          
          {false && <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-xs uppercase text-gray-500 font-medium px-4 mb-2">Your playlists</h3>
            {/* Playlist list will go here */}
          </div>}
        </div>
      </div>
      
     
      <div className="p-4 border-t border-gray-800">
        {currentUser ? (
          // Logged in user display
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-medium truncate max-w-[120px]" title={currentUser.email || 'User'}>
                {currentUser.email || 'User'}
              </span>
            </div>
            <button 
              onClick={logout}
              className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              title="Sign out"
            >
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          // Authentication option
          <div className="space-y-2">
            <Link 
              to="/login" 
              className="flex items-center gap-3 px-4 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors justify-center"
            >
              <FaSignInAlt />
              <span>Sign In</span>
            </Link>
            <Link 
              to="/signup" 
              className="flex items-center gap-3 px-4 py-2 text-sm rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-colors justify-center"
            >
              <FaUserPlus />
              <span>Create Account</span>
            </Link>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 mb-2">Quick Access:</div>
          <div className="flex flex-col gap-2">
            <Link to="/login" className="text-sm text-purple-400 hover:text-purple-300">
              → Sign In Page
            </Link>
            <Link to="/signup" className="text-sm text-purple-400 hover:text-purple-300">
              → Sign Up Page
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;