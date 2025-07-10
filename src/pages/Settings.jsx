import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { theme, transparentCollections, toggleTheme, toggleTransparentCollections } = useTheme();
  const { updateBackgroundImage, backgroundImage } = useBookmarks();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleUnsplashSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Using static images instead to avoid CORS issues
      const staticBackgrounds = [
        {
          id: '1',
          urls: {
            thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop',
            full: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop'
          },
          alt_description: 'Mountain landscape'
        },
        {
          id: '2',
          urls: {
            thumb: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=300&h=200&fit=crop',
            full: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=1920&h=1080&fit=crop'
          },
          alt_description: 'Ocean waves'
        },
        {
          id: '3',
          urls: {
            thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=200&fit=crop',
            full: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop'
          },
          alt_description: 'Forest landscape'
        },
        {
          id: '4',
          urls: {
            thumb: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=300&h=200&fit=crop',
            full: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1920&h=1080&fit=crop'
          },
          alt_description: 'Mountain lake'
        },
        {
          id: '5',
          urls: {
            thumb: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300&h=200&fit=crop',
            full: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&h=1080&fit=crop'
          },
          alt_description: 'Sunset landscape'
        },
        {
          id: '6',
          urls: {
            thumb: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=200&fit=crop',
            full: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1920&h=1080&fit=crop'
          },
          alt_description: 'Mountain range'
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSearchResults(staticBackgrounds);
    } catch (error) {
      toast.error('Failed to search for images. Try again later.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBackground = (imageUrl) => {
    updateBackgroundImage(imageUrl);
    toast.success('Background updated successfully!');
    setSearchResults([]);
  };

  const handleExportData = () => {
    const data = {
      collections: JSON.parse(localStorage.getItem('jumpstart_bookmarks') || '[]'),
      settings: {
        theme,
        transparentCollections,
        backgroundImage,
      },
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jumpstart-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.collections) {
          localStorage.setItem('jumpstart_bookmarks', JSON.stringify(data.collections));
        }
        
        if (data.settings) {
          if (data.settings.backgroundImage) {
            updateBackgroundImage(data.settings.backgroundImage);
          }
        }
        
        toast.success('Data imported successfully! Please refresh the page.');
      } catch (error) {
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('jumpstart_bookmarks');
      localStorage.removeItem('jumpstart_background');
      updateBackgroundImage('');
      toast.success('All data cleared successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your JumpStart experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon name={theme === 'light' ? "Sun" : "Moon"} className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose between light and dark mode
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon name="Eye" className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Transparent Collections</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Make collection backgrounds transparent with blur effect
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTransparentCollections}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  transparentCollections ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    transparentCollections ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Background
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <SafeIcon name="Search" className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for background images..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleUnsplashSearch()}
              />
              <button
                onClick={handleUnsplashSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select a background image:
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {searchResults.map((image) => (
                    <div
                      key={image.id}
                      className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                      onClick={() => handleSelectBackground(image.urls.full)}
                    >
                      <img
                        src={image.urls.thumb}
                        alt={image.alt_description}
                        className="w-full h-24 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                        <div className="p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <SafeIcon name="Image" className="w-4 h-4 text-primary-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {backgroundImage && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded overflow-hidden">
                    <img src={backgroundImage} alt="Current background" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Background image set
                  </span>
                </div>
                <button
                  onClick={() => updateBackgroundImage('')}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <SafeIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Management
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon name="Download" className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Export Data</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Download your bookmarks and settings
                  </p>
                </div>
              </div>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Export
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon name="Upload" className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Import Data</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Restore from a backup file
                  </p>
                </div>
              </div>
              <label className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors cursor-pointer">
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon name="Trash2" className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Clear All Data</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Remove all bookmarks and settings
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;