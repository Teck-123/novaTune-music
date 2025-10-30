import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PW_MIN_LENGTH = 6;

const DEMO_CREDS = {
  email: 'demo@example.com',
  password: 'demo123'
};

const Login = () => {
  // State management 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (error) setError('');
  }, [email, password]);
  

  const validateForm = () => {
  
    if (!EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Check password length 
    if (password.length < PW_MIN_LENGTH) {
      setError(`Password must be at least ${PW_MIN_LENGTH} characters`);
      return false;
    }
    
    return true;
  };

  // Main login handler 
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Firebase auth call
      await signInWithEmailAndPassword(auth, email, password);
      
      // Save login time for analytics 
      localStorage.setItem('last_login', new Date().toISOString());
      
      navigate('/');
    } catch (err) {
      let errorMessage = 'Failed to sign in';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Try again later or reset your password';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your connection and try again.';
          break;
        default:
          console.error('Login error:', err);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Google sign-in handler 
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDevLogin = () => {
    setEmail(DEMO_CREDS.email);
    setPassword(DEMO_CREDS.password);
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="max-w-md mx-auto glass-panel p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-white p-4 rounded-lg mb-6 animate-pulse">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="input pl-10 w-full bg-gray-800/70 focus:ring-purple-500"
                disabled={loading}
                data-testid="email-input" 
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pl-10 pr-10 w-full bg-gray-800/70 focus:ring-purple-500"
                disabled={loading}
                data-testid="password-input" 
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full btn btn-primary py-3 rounded-lg flex items-center justify-center"
            disabled={loading}
            data-testid="login-button" 
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
          
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
          
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full border border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-colors"
            disabled={loading}
          >
            <FaGoogle /> 
            Continue with Google
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign up
          </Link>
        </p>
        
        {/* Dev mode quick login - REMOVE FOR PROD */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <button
              onClick={handleDevLogin}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              [Dev] Use test account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;