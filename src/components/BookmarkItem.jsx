import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBookmarks } from '../contexts/BookmarkContext';
import EditBookmarkModal from './EditBookmarkModal';

const { FiExternalLink, FiEdit2, FiTrash2, FiMoreHorizontal, FiMove, FiImage } = FiIcons;

const BookmarkItem = ({ bookmark, collectionId, index, viewMode }) => {
  const { deleteBookmark } = useBookmarks();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: bookmark.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const handleClick = (e) => {
    if (e.target.closest('.bookmark-menu') || e.target.closest('.drag-handle')) return;
    window.open(bookmark.url, '_blank');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      deleteBookmark(collectionId, bookmark.id);
    }
    setShowMenu(false);
  };

  if (viewMode === 'grid') {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.02 }}
        className={`group relative flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors cursor-pointer ${isDragging ? 'shadow-xl ring-2 ring-primary-500' : ''}`}
        onClick={handleClick}
        title={bookmark.title}
      >
        <div className="flex flex-col items-center space-y-1">
          {bookmark.customIcon ? (
            <img 
              src={bookmark.customIcon} 
              alt="" 
              className="w-8 h-8 rounded object-cover" 
            />
          ) : (
            <img 
              src={bookmark.favicon} 
              alt="" 
              className="w-8 h-8 rounded" 
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
          )}
        </div>
        
        {/* Actions */}
        <div className="bookmark-menu absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded bg-white dark:bg-dark-800 shadow-sm hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiMoreHorizontal} className="w-3 h-3 text-gray-500" />
          </motion.button>
          
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-1 w-32 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-10"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(bookmark.url, '_blank');
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <SafeIcon icon={FiExternalLink} className="w-3 h-3 mr-1" />
                Open
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <SafeIcon icon={FiEdit2} className="w-3 h-3 mr-1" />
                Edit
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="flex items-center w-full px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <SafeIcon icon={FiTrash2} className="w-3 h-3 mr-1" />
                Delete
              </button>
            </motion.div>
          )}
        </div>
        
        {/* Drag Handle */}
        <div 
          className="drag-handle absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-700"
          {...listeners}
          {...attributes}
        >
          <SafeIcon icon={FiMove} className="w-3 h-3 text-gray-400" />
        </div>
        
        {/* Edit Modal */}
        {showEditModal && (
          <EditBookmarkModal
            bookmark={bookmark}
            collectionId={collectionId}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative p-3 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 cursor-pointer bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 ${isDragging ? 'shadow-xl ring-2 ring-primary-500' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        {/* Drag Handle */}
        <div 
          className="drag-handle flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-500"
          {...listeners}
          {...attributes}
        >
          <SafeIcon icon={FiMove} className="w-4 h-4 text-gray-400" />
        </div>
        
        {/* Favicon */}
        <div className="flex-shrink-0">
          {bookmark.customIcon ? (
            <img 
              src={bookmark.customIcon} 
              alt="" 
              className="w-6 h-6 rounded object-cover" 
            />
          ) : (
            <img 
              src={bookmark.favicon} 
              alt="" 
              className="w-6 h-6 rounded" 
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900 dark:text-white truncate">
              {bookmark.title}
            </h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {bookmark.description || new URL(bookmark.url).hostname}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="bookmark-menu relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-dark-500 transition-all"
          >
            <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-500" />
          </motion.button>
          
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-10"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(bookmark.url, '_blank');
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <SafeIcon icon={FiExternalLink} className="w-4 h-4 mr-2" />
                Open
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2" />
                Edit
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Modal */}
      {showEditModal && (
        <EditBookmarkModal
          bookmark={bookmark}
          collectionId={collectionId}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </motion.div>
  );
};

export default BookmarkItem;