import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// For demo purposes, we'll use localStorage
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('jumpstart_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, name) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('jumpstart_user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('jumpstart_user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Signed in successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('jumpstart_user');
      localStorage.removeItem('jumpstart_bookmarks');
      localStorage.removeItem('jumpstart_settings');
      setUser(null);
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};