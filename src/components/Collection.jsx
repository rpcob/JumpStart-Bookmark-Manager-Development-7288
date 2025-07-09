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

const { FiChevronDown, FiChevronRight, FiPlus, FiEdit2, FiTrash2, FiMoreHorizontal, FiGrid, FiList, FiMove, FiShare2, FiLock, FiGlobe, FiFolder } = FiIcons;

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

  const getCollectionIcon = () => {
    if (collection.customIcon) {
      return collection.customIcon;
    }
    
    const iconMap = {
      'Folder': FiIcons.FiFolder,
      'Star': FiIcons.FiStar,
      'Heart': FiIcons.FiHeart,
      'Code': FiIcons.FiCode,
      'Bookmark': FiIcons.FiBookmark,
      'Grid': FiIcons.FiGrid,
      'Home': FiIcons.FiHome,
      'Work': FiIcons.FiBriefcase,
      'School': FiIcons.FiBook,
      'Music': FiIcons.FiMusic,
      'Video': FiIcons.FiVideo,
      'Image': FiIcons.FiImage,
      'File': FiIcons.FiFile,
      'Globe': FiIcons.FiGlobe,
      'Shield': FiIcons.FiShield,
      'Lock': FiIcons.FiLock,
      'Key': FiIcons.FiKey,
      'Tool': FiIcons.FiTool,
      'Settings': FiIcons.FiSettings,
      'Zap': FiIcons.FiZap,
      'Target': FiIcons.FiTarget,
      'Trophy': FiIcons.FiAward,
      'Gift': FiIcons.FiGift,
      'Coffee': FiIcons.FiCoffee,
      'Camera': FiIcons.FiCamera,
      'Headphones': FiIcons.FiHeadphones,
      'Smartphone': FiIcons.FiSmartphone,
      'Monitor': FiIcons.FiMonitor,
      'Printer': FiIcons.FiPrinter,
      'Server': FiIcons.FiServer,
      'Cloud': FiIcons.FiCloud,
      'Database': FiIcons.FiDatabase,
      'Map': FiIcons.FiMap,
      'Calendar': FiIcons.FiCalendar,
      'Clock': FiIcons.FiClock,
      'Sun': FiIcons.FiSun,
      'Moon': FiIcons.FiMoon,
      'User': FiIcons.FiUser,
      'Users': FiIcons.FiUsers,
      'Mail': FiIcons.FiMail,
      'Phone': FiIcons.FiPhone,
      'MessageSquare': FiIcons.FiMessageSquare,
      'Bell': FiIcons.FiBell,
      'Search': FiIcons.FiSearch,
      'List': FiIcons.FiList,
      'Package': FiIcons.FiPackage,
      'Box': FiIcons.FiBox,
      'Tag': FiIcons.FiTag,
      'ShoppingCart': FiIcons.FiShoppingCart,
      'CreditCard': FiIcons.FiCreditCard,
      'DollarSign': FiIcons.FiDollarSign,
      'Eye': FiIcons.FiEye,
      'GitHub': FiIcons.FiGithub,
      'Linkedin': FiIcons.FiLinkedin,
      'Twitter': FiIcons.FiTwitter,
      'Facebook': FiIcons.FiFacebook,
      'Instagram': FiIcons.FiInstagram,
      'Youtube': FiIcons.FiYoutube,
    };
    
    return iconMap[collection.icon] || FiIcons.FiFolder;
  };

  const renderCollectionIcon = () => {
    if (collection.customIcon) {
      return (
        <img 
          src={collection.customIcon} 
          alt={collection.name} 
          className="w-5 h-5 object-contain"
          style={{ color: collection.color }}
        />
      );
    }
    
    return (
      <SafeIcon 
        icon={getCollectionIcon()} 
        className="w-5 h-5 text-gray-700 dark:text-gray-300" 
        style={{ color: collection.color }}
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
                icon={collection.collapsed ? FiChevronRight : FiChevronDown} 
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
                  <SafeIcon icon={FiMove} className="w-3 h-3 text-gray-400" />
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
                icon={collection.viewMode === 'grid' ? FiList : FiGrid} 
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
                <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-500" />
              </motion.button>

              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-10"
                >
                  <button
                    onClick={() => {
                      setShowAddBookmark(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Add Bookmark
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAddSubCollection(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <SafeIcon icon={FiFolder} className="w-4 h-4 mr-2" />
                    Add Sub-Collection
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowEditCollection(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2" />
                    Edit Collection
                  </button>
                  
                  <button
                    onClick={handleShareCollection}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <SafeIcon icon={FiShare2} className="w-4 h-4 mr-2" />
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
                    <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
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