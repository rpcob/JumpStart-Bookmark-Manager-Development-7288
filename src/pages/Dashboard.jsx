import React from 'react';
import { motion } from 'framer-motion';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useTheme } from '../contexts/ThemeContext';
import Collection from '../components/Collection';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const Dashboard = () => {
  const { collections, searchQuery, reorderCollections } = useBookmarks();
  const { transparentCollections } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = collections.findIndex(item => item.id === active.id);
      const newIndex = collections.findIndex(item => item.id === over.id);
      
      const newCollections = [...collections];
      const [movedItem] = newCollections.splice(oldIndex, 1);
      newCollections.splice(newIndex, 0, movedItem);
      
      reorderCollections(newCollections);
    }
  };

  // Filter collections to exclude subcollections that are directly inside a parent
  const topLevelCollections = collections.filter(collection => 
    !collection.parentId || !collections.some(c => c.id === collection.parentId)
  );

  const hasResults = collections.some(collection => 
    collection.bookmarks.length > 0 || 
    (collection.subcollections && collection.subcollections.some(sub => sub.bookmarks.length > 0))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Your bookmarks at a glance'}
        </p>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon name="Folder" className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No collections yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first collection to start organizing your bookmarks
          </p>
        </motion.div>
      ) : searchQuery && !hasResults ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms
          </p>
        </motion.div>
      ) : (
        <DndContext 
          sensors={sensors} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={topLevelCollections.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topLevelCollections.map((collection, index) => (
                <Collection
                  key={collection.id}
                  collection={collection}
                  index={index}
                  transparent={transparentCollections}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default Dashboard;