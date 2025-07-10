import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../components/LoadingSpinner';

const PublicView = () => {
  const { shareId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Try to get the collection from localStorage first
        const storedCollections = localStorage.getItem('jumpstart_bookmarks');
        let collection = null;
        
        if (storedCollections) {
          const collections = JSON.parse(storedCollections);
          
          // Find collection recursively
          const findCollection = (collections) => {
            for (const col of collections) {
              if (col.id === shareId) {
                return col;
              }
              if (col.subcollections) {
                const found = findCollection(col.subcollections);
                if (found) return found;
              }
            }
            return null;
          };
          
          collection = findCollection(collections);
        }
        
        if (collection) {
          setData({
            id: shareId,
            name: collection.name,
            collections: [collection],
          });
        } else {
          // Demo data for sharing without login
          const demoData = {
            id: shareId,
            name: 'Shared Bookmarks',
            collections: [
              {
                id: '1',
                name: 'Development Resources',
                color: '#0ea5e9',
                icon: 'Code',
                bookmarks: [
                  {
                    id: '1',
                    title: 'GitHub',
                    url: 'https://github.com',
                    description: 'The world\'s leading software development platform',
                    favicon: 'https://github.com/favicon.ico',
                  },
                  {
                    id: '2',
                    title: 'Stack Overflow',
                    url: 'https://stackoverflow.com',
                    description: 'The largest online community for programmers',
                    favicon: 'https://stackoverflow.com/favicon.ico',
                  },
                  {
                    id: '3',
                    title: 'MDN Web Docs',
                    url: 'https://developer.mozilla.org',
                    description: 'Resources for developers, by developers',
                    favicon: 'https://developer.mozilla.org/favicon-48x48.png',
                  },
                ],
                subcollections: [],
              },
              {
                id: '2',
                name: 'Design Inspiration',
                color: '#10b981',
                icon: 'Palette',
                bookmarks: [
                  {
                    id: '4',
                    title: 'Dribbble',
                    url: 'https://dribbble.com',
                    description: 'Discover the world\'s top designers & creatives',
                    favicon: 'https://dribbble.com/favicon.ico',
                  },
                  {
                    id: '5',
                    title: 'Behance',
                    url: 'https://behance.net',
                    description: 'Showcase and discover creative work',
                    favicon: 'https://behance.net/favicon.ico',
                  },
                ],
                subcollections: [],
              },
            ],
          };
          
          setData(demoData);
        }
      } catch (err) {
        setError('Failed to load shared bookmarks');
      } finally {
        setLoading(false);
      }
    };

    loadSharedData();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                JumpStart
              </span>
            </div>
            
            <div className="text-right">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {data?.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Shared publicly
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700"
            >
              <div className="p-4 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: collection.color }}
                  />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {collection.name}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {collection.bookmarks.length}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {collection.bookmarks.map((bookmark) => (
                  <motion.div
                    key={bookmark.id}
                    whileHover={{ scale: 1.02 }}
                    className="group p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors cursor-pointer"
                    onClick={() => window.open(bookmark.url, '_blank')}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={bookmark.favicon}
                        alt=""
                        className="w-6 h-6 rounded"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTIgMmMxLjEgMCAyIC45IDIgMnYxNmMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTJ2LTEwLjU5bC0yLjI5IDIuM2MtLjM5LjM5LTEuMDIuMzktMS40MSAwcy0uMzktMS4wMiAwLTEuNDFsNC0zLjk5Yy4zOS0uMzkgMS4wMi0uMzkgMS40MSAwbDQgMy45OWMuMzkuMzkuMzkgMS4wMiAwIDEuNDFzLTEuMDIuMzktMS40MSAwbC0yLjI5LTIuM3YxMC41OWMwIDEuMS0uOSAyLTIgMnoiIGZpbGw9IiM5Y2EzYWYiLz48L3N2Zz4=';
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {bookmark.title}
                          </h4>
                          <SafeIcon 
                            name="ExternalLink" 
                            className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                          />
                        </div>
                        
                        {bookmark.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                            {bookmark.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {collection.bookmarks.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400">No bookmarks in this collection</p>
                  </div>
                )}
              </div>
              
              {/* Subcollections if any */}
              {collection.subcollections && collection.subcollections.length > 0 && (
                <div className="border-t border-gray-200 dark:border-dark-700 p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Sub-Collections
                  </h4>
                  <div className="space-y-2">
                    {collection.subcollections.map((subcollection) => (
                      <div 
                        key={subcollection.id}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-dark-700"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: subcollection.color }}
                          />
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {subcollection.name}
                          </h5>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {subcollection.bookmarks.length} bookmarks
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Powered by JumpStart - A minimalist bookmark manager</p>
            <p className="mt-1">
              <a 
                href="/#/auth" 
                className="text-primary-500 hover:text-primary-600 transition-colors"
              >
                Create your own bookmark collection
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicView;