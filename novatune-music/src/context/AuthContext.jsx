import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup, 
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';  


export const AuthContext = createContext();

export const AuthProvider = function({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setLoading] = useState(true);   
  const [auth_error, setAuthError] = useState('');   

  
  useEffect(() => {
    console.log('Setting up auth listener...');
    const cleanup = onAuthStateChanged(auth, (usr) => { 
      console.log('Auth state changed:', usr?.email || 'No user');
      setCurrentUser(usr);
      setLoading(false);
    });

    return cleanup;
  }, []);


  useEffect(() => {
    if (auth_error) { 
      const errorTimeout = setTimeout(() => {
        setAuthError(''); 
      }, 5000);
        return () => clearTimeout(errorTimeout);
    }
  }, [auth_error]); 

  const logoutUser = async () => { 
    setAuthError(''); 
    try {
      console.log('Attempting to sign out user...');
      await signOut(auth); 
      console.log('User signed out successfully!');
    } catch (err) { 
      console.error("Failed to sign out:", err);
      setAuthError('Sign out failed - please try again');
    }
  };
  
  const logout = logoutUser;
  

  const googleLogin = async function() { 
    setAuthError(''); 
    
    try {
      const googleProvider = new GoogleAuthProvider();
      
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      
  
      const result = await signInWithPopup(auth, googleProvider);
      
      console.log('Google sign in successful!', result.user.displayName);
      return true;
    } catch (googleError) { 
      console.error("Google auth failed:", googleError);
      if (googleError.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled - please try again');
      } else {
        setAuthError('Google sign-in failed - please try another method');
      }
      return false;
    }
  };
  
  const signInWithGoogle = googleLogin;
  
  // Reset password
  const resetPassword = async (email) => {
    setAuthError('');
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setAuthError('Failed to send password reset email');
      return false;
    }
  };
  
  // Update user profile
  const updateUserProfile = async (data) => {
    setAuthError('');
    try {
      if (!currentUser) throw new Error('No authenticated user');
      
      await updateProfile(currentUser, {
        displayName: data.displayName || currentUser.displayName,
        photoURL: data.photoURL || currentUser.photoURL
      });
      
      // Refresh user data
      setCurrentUser({...currentUser});
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      setAuthError('Failed to update profile');
      return false;
    }
  };
  
  // Update user password
  const updateUserPassword = async (currentPassword, newPassword) => {
    setAuthError('');
    try {
      if (!currentUser) throw new Error('No authenticated user');
      if (!currentUser.email) throw new Error('User has no email');
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, newPassword);
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      
      if (error.code === 'auth/wrong-password') {
        setAuthError('Current password is incorrect');
      } else {
        setAuthError('Failed to update password');
      }
      
      return false;
    }
  };

  const contextValues = {
    user: currentUser,          
    currentUser,               
    loading: isLoading,         
    error: auth_error,           
    
    logout,                     
    signOut: logout,           
    signInWithGoogle,          
    googleAuth: signInWithGoogle,
    resetPassword,              
    updateUserProfile,           
    updateUserPassword,         
  };

  
  return (
    <AuthContext.Provider value={contextValues}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

