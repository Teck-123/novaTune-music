import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const { resetPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const success = await resetPassword(email);
      
      if (success) {
        setSuccessMessage('Password reset email sent. Check your inbox and spam folder.');
        setEmail(''); // Clear email field
      } else {
        setError('Failed to send password reset email');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="max-w-md mx-auto glass-panel p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Reset Password</h1>
          <p className="text-gray-400">We'll send you a link to reset your password</p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-white p-4 rounded-lg mb-6 animate-pulse">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-900/30 border border-green-700 text-white p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleResetPassword} className="space-y-6">
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
                placeholder="Enter your registered email"
                className="input pl-10 w-full bg-gray-800/70 focus:ring-purple-500"
                disabled={loading}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full btn btn-primary py-3 rounded-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link to="/login" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;