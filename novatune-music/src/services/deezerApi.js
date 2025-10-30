import axios from 'axios';

// Use our local proxy server to bypass CORS restrictions
const BASE_URL = 'http://localhost:3001/api/deezer';

// Create axios instance with default config
const deezerApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chart & Trending
export const getChartTracks = async (limit = 50) => {
  try {
    console.log(`Fetching chart tracks with limit=${limit} from ${BASE_URL}/chart/0/tracks`);
    const response = await deezerApi.get(`/chart/0/tracks?limit=${limit}`);
    
    if (response.status !== 200) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    if (!response.data || !response.data.data) {
      console.error('Invalid API response structure:', response.data);
      throw new Error('Invalid API response structure');
    }
    
    console.log(`Successfully fetched ${response.data.data.length} chart tracks`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chart tracks:', error.message);
    
    if (error.response) {
      console.error('API error response:', error.response.data);
      console.error('API error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    
    // Fall back to mock data for demo purposes
    console.log('Falling back to mock data');
    return import('../data/mockSongs.js').then(module => module.mockTracks.data);
  }
};

export const getChartAlbums = async (limit = 50) => {
  try {
    const response = await deezerApi.get(`/chart/0/albums?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chart albums:', error);
    throw error;
  }
};

export const getChartArtists = async (limit = 50) => {
  try {
    const response = await deezerApi.get(`/chart/0/artists?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chart artists:', error);
    throw error;
  }
};

// Search
export const searchTracks = async (query) => {
  try {
    const response = await deezerApi.get(`/search/track?q=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

export const searchArtists = async (query) => {
  try {
    const response = await deezerApi.get(`/search/artist?q=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error searching artists:', error);
    throw error;
  }
};

export const searchAlbums = async (query) => {
  try {
    const response = await deezerApi.get(`/search/album?q=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error searching albums:', error);
    throw error;
  }
};

export const searchAll = async (query) => {
  try {
    const response = await deezerApi.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
};

// Track Details
export const getTrack = async (trackId) => {
  try {
    const response = await deezerApi.get(`/track/${trackId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching track:', error);
    throw error;
  }
};

// Artist Details
export const getArtist = async (artistId) => {
  try {
    const response = await deezerApi.get(`/artist/${artistId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching artist:', error);
    throw error;
  }
};

export const getArtistTopTracks = async (artistId, limit = 25) => {
  try {
    const response = await deezerApi.get(`/artist/${artistId}/top?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching artist top tracks:', error);
    throw error;
  }
};

export const getArtistAlbums = async (artistId, limit = 25) => {
  try {
    const response = await deezerApi.get(`/artist/${artistId}/albums?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching artist albums:', error);
    throw error;
  }
};

// Album Details
export const getAlbum = async (albumId) => {
  try {
    const response = await deezerApi.get(`/album/${albumId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching album:', error);
    throw error;
  }
};

// Genre
export const getGenres = async () => {
  try {
    const response = await deezerApi.get('/genre');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const getGenreArtists = async (genreId, limit = 25) => {
  try {
    const response = await deezerApi.get(`/genre/${genreId}/artists?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching genre artists:', error);
    throw error;
  }
};

// Radio/Playlists
export const getRadio = async () => {
  try {
    const response = await deezerApi.get('/radio');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching radio:', error);
    throw error;
  }
};

export const getRadioTracks = async (radioId, limit = 40) => {
  try {
    const response = await deezerApi.get(`/radio/${radioId}/tracks?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching radio tracks:', error);
    throw error;
  }
};

export const getPlaylist = async (playlistId) => {
  try {
    const response = await deezerApi.get(`/playlist/${playlistId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
};

export default deezerApi;