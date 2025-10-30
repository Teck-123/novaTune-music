import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';

// Regular imports for frequently used pages
import HomeSimple from './pages/HomeSimple.jsx';
import Library from './pages/Library.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

// Lazy-loaded pages for better performance
const Search = lazy(() => import('./pages/Search.jsx'));
const Playlist = lazy(() => import('./pages/Playlist.jsx'));
const Song = lazy(() => import('./pages/Song.jsx'));
const Artist = lazy(() => import('./pages/Artist.jsx'));
const Album = lazy(() => import('./pages/Album.jsx'));

// Loading fallback for lazy-loaded components
const PageLoader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-pulse flex space-x-2">
      <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
      <div className="h-3 w-3 bg-purple-500 rounded-full animation-delay-200"></div>
      <div className="h-3 w-3 bg-purple-500 rounded-full animation-delay-400"></div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100">
            <div className="flex h-screen overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto pl-64 pb-24">
                <div className="p-8">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<HomeSimple />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/playlist/:id" element={<Playlist />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/song/:id" element={<Song />} />
                      <Route path="/artist/:id" element={<Artist />} />
                      <Route path="/album/:id" element={<Album />} />
                    </Routes>
                  </Suspense>
                </div>
              </main>
            </div>
            <AudioPlayer />
            <div className="css-working-indicator">CSS is working!</div>
          </div>
        </Router>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;