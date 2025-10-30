import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  // Reset error when input changes
  useEffect(() => {
    if (error) setError('');
  }, [name, email, password, confirmPassword]);

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, text: '', color: 'bg-gray-700' };
    
    let strength = 0;
    let text = 'Weak';
    let color = 'bg-red-500';
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains number
    if (/\d/.test(password)) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength === 5) {
      text = 'Very Strong';
      color = 'bg-green-500';
    } else if (strength >= 3) {
      text = 'Strong';
      color = 'bg-blue-500';
    } else if (strength === 2) {
      text = 'Medium';
      color = 'bg-yellow-500';
    }
    
    return { strength: strength * 20, text, color };
  };
  
  const passwordStrength = getPasswordStrength();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name if provided
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      navigate('/');
    } catch (err) {
      let errorMessage = 'Failed to create an account';
      
      // More user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="max-w-md mx-auto glass-panel p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-gray-400">Join our music community</p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-white p-4 rounded-lg mb-6 animate-pulse">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Display Name (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input pl-10 w-full bg-gray-800/70 focus:ring-purple-500"
                disabled={loading}
              />
            </div>
          </div>
          
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
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="input pl-10 pr-10 w-full bg-gray-800/70 focus:ring-purple-500"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password strength meter */}
            {password && (
              <div className="mt-2">
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${passwordStrength.color}`} style={{ width: `${passwordStrength.strength}%` }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{passwordStrength.text}</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`input pl-10 w-full bg-gray-800/70 focus:ring-purple-500 ${
                  password && confirmPassword && password !== confirmPassword ? 'border-red-500' : ''
                }`}
                disabled={loading}
                required
              />
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
            )}
          </div>
          
          <button 
            type="submit" 
            className="w-full btn btn-primary py-3 rounded-lg flex items-center justify-center"
            disabled={loading || (password && confirmPassword && password !== confirmPassword)}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
          
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
          
          <button 
            type="button" 
            onClick={handleGoogleSignup}
            className="w-full border border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-colors"
            disabled={loading}
          >
            <FaGoogle /> 
            Continue with Google
          </button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
        
        <p className="text-center text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;