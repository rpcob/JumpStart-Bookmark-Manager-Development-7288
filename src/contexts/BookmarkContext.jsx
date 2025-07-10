import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

const BookmarkContext = createContext();

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

export const BookmarkProvider = ({ children }) => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = () => {
    const stored = localStorage.getItem('jumpstart_bookmarks');
    const storedBackground = localStorage.getItem('jumpstart_background');

    if (stored) {
      setCollections(JSON.parse(stored));
    } else {
      // Default collections
      const defaultCollections = [
        {
          id: uuidv4(),
          name: 'Quick Access',
          color: '#0ea5e9',
          icon: 'Star',
          collapsed: false,
          colspan: 2,
          viewMode: 'grid',
          bookmarks: [
            {
              id: uuidv4(),
              title: 'Google',
              url: 'https://google.com',
              description: 'Search engine',
              favicon: 'https://www.google.com/favicon.ico',
              notes: '',
              createdAt: new Date().toISOString(),
            },
            {
              id: uuidv4(),
              title: 'GitHub',
              url: 'https://github.com',
              description: 'Code repository',
              favicon: 'https://github.com/favicon.ico',
              notes: '',
              createdAt: new Date().toISOString(),
            },
          ],
          subcollections: [],
        },
        {
          id: uuidv4(),
          name: 'Development',
          color: '#10b981',
          icon: 'Code',
          collapsed: false,
          colspan: 1,
          viewMode: 'list',
          bookmarks: [
            {
              id: uuidv4(),
              title: 'Stack Overflow',
              url: 'https://stackoverflow.com',
              description: 'Developer Q&A',
              favicon: 'https://stackoverflow.com/favicon.ico',
              notes: '',
              createdAt: new Date().toISOString(),
            },
          ],
          subcollections: [],
        },
      ];

      setCollections(defaultCollections);
      saveBookmarks(defaultCollections);
    }

    if (storedBackground) {
      setBackgroundImage(storedBackground);
    }
  };

  const saveBookmarks = (data) => {
    localStorage.setItem('jumpstart_bookmarks', JSON.stringify(data));
  };

  const createCollection = (collectionData) => {
    const { name, color, icon, colspan = 1, customIcon = null, parentId = null } = collectionData;

    const newCollection = {
      id: uuidv4(),
      name,
      color,
      icon,
      customIcon,
      collapsed: false,
      colspan,
      viewMode: 'grid',
      bookmarks: [],
      subcollections: [],
    };

    if (parentId) {
      // Add as subcollection
      const updated = collections.map(col => {
        if (col.id === parentId) {
          return { ...col, subcollections: [...col.subcollections, newCollection] };
        }

        // Check if parentId is in any subcollection
        if (col.subcollections && col.subcollections.length > 0) {
          const updatedSubcollections = col.subcollections.map(sub => {
            if (sub.id === parentId) {
              return { ...sub, subcollections: [...(sub.subcollections || []), newCollection] };
            }
            return sub;
          });
          return { ...col, subcollections: updatedSubcollections };
        }

        return col;
      });

      setCollections(updated);
      saveBookmarks(updated);
    } else {
      // Add as main collection
      const updated = [...collections, newCollection];
      setCollections(updated);
      saveBookmarks(updated);
    }

    return newCollection;
  };

  const updateCollection = (id, updates) => {
    const updateCollectionRecursive = (collections) => {
      return collections.map(col => {
        if (col.id === id) {
          return { ...col, ...updates };
        }

        if (col.subcollections && col.subcollections.length > 0) {
          return { ...col, subcollections: updateCollectionRecursive(col.subcollections) };
        }

        return col;
      });
    };

    const updated = updateCollectionRecursive(collections);
    setCollections(updated);
    saveBookmarks(updated);
  };

  const deleteCollection = (id) => {
    // Function to recursively filter out the collection with the given id
    const filterCollectionsRecursive = (collections) => {
      return collections
        .filter(col => col.id !== id)
        .map(col => ({
          ...col,
          subcollections: col.subcollections ? filterCollectionsRecursive(col.subcollections) : []
        }));
    };

    const updated = filterCollectionsRecursive(collections);
    setCollections(updated);
    saveBookmarks(updated);
  };

  const addBookmark = (collectionId, bookmark) => {
    const newBookmark = {
      id: uuidv4(),
      ...bookmark,
      createdAt: new Date().toISOString(),
    };

    // Function to recursively find and update the collection
    const updateCollectionsRecursive = (collections) => {
      return collections.map(col => {
        if (col.id === collectionId) {
          return { ...col, bookmarks: [...col.bookmarks, newBookmark] };
        }

        if (col.subcollections && col.subcollections.length > 0) {
          return { ...col, subcollections: updateCollectionsRecursive(col.subcollections) };
        }

        return col;
      });
    };

    const updated = updateCollectionsRecursive(collections);
    setCollections(updated);
    saveBookmarks(updated);
    return newBookmark;
  };

  const updateBookmark = (collectionId, bookmarkId, updates) => {
    // Function to recursively find and update the bookmark
    const updateBookmarksRecursive = (collections) => {
      return collections.map(col => {
        if (col.id === collectionId) {
          return {
            ...col,
            bookmarks: col.bookmarks.map(bm => 
              bm.id === bookmarkId ? { ...bm, ...updates } : bm
            )
          };
        }

        if (col.subcollections && col.subcollections.length > 0) {
          return { ...col, subcollections: updateBookmarksRecursive(col.subcollections) };
        }

        return col;
      });
    };

    const updated = updateBookmarksRecursive(collections);
    setCollections(updated);
    saveBookmarks(updated);
  };

  const deleteBookmark = (collectionId, bookmarkId) => {
    // Function to recursively find and delete the bookmark
    const deleteBookmarkRecursive = (collections) => {
      return collections.map(col => {
        if (col.id === collectionId) {
          return { ...col, bookmarks: col.bookmarks.filter(bm => bm.id !== bookmarkId) };
        }

        if (col.subcollections && col.subcollections.length > 0) {
          return { ...col, subcollections: deleteBookmarkRecursive(col.subcollections) };
        }

        return col;
      });
    };

    const updated = deleteBookmarkRecursive(collections);
    setCollections(updated);
    saveBookmarks(updated);
  };

  const reorderCollections = (newOrder) => {
    setCollections(newOrder);
    saveBookmarks(newOrder);
  };

  const reorderBookmarks = (collectionId, newOrder) => {
    // Function to recursively find and reorder the bookmarks
    const reorderBookmarksRecursive = (collections) => {
      return collections.map(col => {
        if (col.id === collectionId) {
          return { ...col, bookmarks: newOrder };
        }

        if (col.subcollections && col.subcollections.length > 0) {
          return { ...col, subcollections: reorderBookmarksRecursive(col.subcollections) };
        }

        return col;
      });
    };

    const updated = reorderBookmarksRecursive(collections);
    setCollections(updated);
    saveBookmarks(updated);
  };

  const updateBackgroundImage = (imageUrl) => {
    setBackgroundImage(imageUrl);
    localStorage.setItem('jumpstart_background', imageUrl);
  };

  const getAllCollections = () => {
    // Get a flat list of all collections and subcollections
    const flattenCollections = (collections, result = []) => {
      collections.forEach(col => {
        result.push(col);
        if (col.subcollections && col.subcollections.length > 0) {
          flattenCollections(col.subcollections, result);
        }
      });
      return result;
    };

    return flattenCollections(collections);
  };

  const getCollectionById = (id) => {
    // Function to recursively find a collection by id
    const findCollectionRecursive = (collections) => {
      for (const col of collections) {
        if (col.id === id) {
          return col;
        }

        if (col.subcollections && col.subcollections.length > 0) {
          const found = findCollectionRecursive(col.subcollections);
          if (found) return found;
        }
      }
      return null;
    };

    return findCollectionRecursive(collections);
  };

  // Apply search filter to collections
  const filterCollectionsRecursive = (collections) => {
    return collections.map(collection => {
      // Filter bookmarks
      const filteredBookmarks = collection.bookmarks.filter(bookmark => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.description?.toLowerCase().includes(query) ||
          bookmark.url?.toLowerCase().includes(query) ||
          bookmark.notes?.toLowerCase().includes(query)
        );
      });

      // Filter subcollections
      const filteredSubcollections = collection.subcollections
        ? filterCollectionsRecursive(collection.subcollections)
        : [];

      return {
        ...collection,
        bookmarks: filteredBookmarks,
        subcollections: filteredSubcollections
      };
    });
  };

  const filteredCollections = filterCollectionsRecursive(collections);

  const value = {
    collections: filteredCollections,
    searchQuery,
    backgroundImage,
    setSearchQuery,
    updateBackgroundImage,
    createCollection,
    updateCollection,
    deleteCollection,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    reorderCollections,
    reorderBookmarks,
    getAllCollections,
    getCollectionById,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};