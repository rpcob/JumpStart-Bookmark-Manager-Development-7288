import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBookmarks } from '../contexts/BookmarkContext';
import BookmarkItem from './BookmarkItem';
import AddBookmarkModal from './AddBookmarkModal';
import AddCollectionModal from './AddCollectionModal';
import EditCollectionModal from './EditCollectionModal';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';

const Collection = ({ collection, index, transparent, parentId = null, onDragEnd }) => {
  const { updateCollection, deleteCollection, reorderBookmarks, createCollection } = useBookmarks();
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [showAddSubCollection, setShowAddSubCollection] = useState(false);
  const [showEditCollection, setShowEditCollection] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: collection.id,
    disabled: !!parentId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

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

  const handleToggleCollapse = () => {
    updateCollection(collection.id, { collapsed: !collection.collapsed });
  };

  const handleToggleViewMode = () => {
    const newMode = collection.viewMode === 'grid' ? 'list' : 'grid';
    updateCollection(collection.id, { viewMode: newMode });
  };

  const handleBookmarkDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = collection.bookmarks.findIndex(item => item.id === active.id);
      const newIndex = collection.bookmarks.findIndex(item => item.id === over.id);
      
      const newBookmarks = [...collection.bookmarks];
      const [movedItem] = newBookmarks.splice(oldIndex, 1);
      newBookmarks.splice(newIndex, 0, movedItem);
      
      reorderBookmarks(collection.id, newBookmarks);
    }
  };

  const handleShareCollection = () => {
    const shareableLink = `${window.location.origin}/#/public/${collection.id}`;
    
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        alert('Shareable link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
        alert(`Shareable link: ${shareableLink}`);
      });
    
    setShowMenu(false);
  };

  const colspanClass = {
    1: 'col-span-1',
    2: 'md:col-span-2',
    3: 'lg:col-span-3',
    4: 'xl:col-span-4',
  };

  const renderCollectionIcon = () => {
    if (collection.customIcon) {
      return (
        <img 
          src={collection.customIcon} 
          alt={collection.name} 
          className="w-5 h-5 object-contain" 
          style={{color: collection.color}}
        />
      );
    }
    
    return (
      <SafeIcon 
        name={collection.icon} 
        className="w-5 h-5 text-gray-700 dark:text-gray-300" 
        style={{color: collection.color}}
      />
    );
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${colspanClass[collection.colspan] || 'col-span-1'} ${parentId ? 'ml-4' : ''} ${isDragging ? 'shadow-2xl ring-2 ring-primary-500' : ''}`}
    >
      <div
        className={`rounded-xl border transition-all duration-200 ${
          transparent
            ? 'bg-white/20 dark:bg-dark-800/20 border-white/30 dark:border-dark-700/30 backdrop-blur-sm'
            : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700'
        } shadow-sm hover:shadow-md`}
      >
        {/* Collection Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleCollapse}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <SafeIcon 
                name={collection.collapsed ? "ChevronRight" : "ChevronDown"} 
                className="w-4 h-4 text-gray-500" 
              />
            </motion.button>
            
            {renderCollectionIcon()}
            
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {collection.name}
              </h3>
              
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {collection.bookmarks.length}
              </span>
              
              {!parentId && (
                <div className="drag-handle cursor-move ml-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-700" {...listeners}>
                  <SafeIcon name="Move" className="w-3 h-3 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleViewMode}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              title={`Switch to ${collection.viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              <SafeIcon 
                name={collection.viewMode === 'grid' ? "List" : "Grid"} 
                className="w-4 h-4 text-gray-500" 
              />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <SafeIcon name="MoreHorizontal" className="w-4 h-4 text-gray-500" />
              </motion.button>

              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-[100]"
                >
                  <button
                    onClick={() => {
                      setShowAddBookmark(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <SafeIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Bookmark
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAddSubCollection(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <SafeIcon name="Folder" className="w-4 h-4 mr-2" />
                    Add Sub-Collection
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowEditCollection(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <SafeIcon name="Edit2" className="w-4 h-4 mr-2" />
                    Edit Collection
                  </button>
                  
                  <button
                    onClick={handleShareCollection}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <SafeIcon name="Share2" className="w-4 h-4 mr-2" />
                    Share Collection
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this collection?')) {
                        deleteCollection(collection.id);
                      }
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <SafeIcon name="Trash2" className="w-4 h-4 mr-2" />
                    Delete Collection
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Collection Content */}
        {!collection.collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            {collection.bookmarks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">No bookmarks yet</p>
                <button
                  onClick={() => setShowAddBookmark(true)}
                  className="mt-2 text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  Add your first bookmark
                </button>
              </div>
            ) : (
              <DndContext 
                sensors={sensors} 
                onDragEnd={handleBookmarkDragEnd}
              >
                <SortableContext
                  items={collection.bookmarks.map(b => b.id)}
                  strategy={collection.viewMode === 'grid' ? horizontalListSortingStrategy : verticalListSortingStrategy}
                >
                  <div className={
                    collection.viewMode === 'grid' 
                      ? 'flex flex-wrap gap-2' 
                      : 'space-y-2'
                  }>
                    {collection.bookmarks.map((bookmark, bookmarkIndex) => (
                      <BookmarkItem
                        key={bookmark.id}
                        bookmark={bookmark}
                        collectionId={collection.id}
                        index={bookmarkIndex}
                        viewMode={collection.viewMode}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Subcollections */}
            {collection.subcollections && collection.subcollections.length > 0 && (
              <div className="mt-4 space-y-4">
                {collection.subcollections.map((subcollection, subIndex) => (
                  <Collection
                    key={subcollection.id}
                    collection={subcollection}
                    index={subIndex}
                    transparent={transparent}
                    parentId={collection.id}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showAddBookmark && (
        <AddBookmarkModal
          collectionId={collection.id}
          onClose={() => setShowAddBookmark(false)}
        />
      )}

      {showAddSubCollection && (
        <AddCollectionModal
          parentId={collection.id}
          onClose={() => setShowAddSubCollection(false)}
        />
      )}

      {showEditCollection && (
        <EditCollectionModal
          collection={collection}
          onClose={() => setShowEditCollection(false)}
        />
      )}
    </motion.div>
  );
};

export default Collection;