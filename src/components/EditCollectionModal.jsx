import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChromePicker } from 'react-color';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBookmarks } from '../contexts/BookmarkContext';
import toast from 'react-hot-toast';

const { FiX, FiSave, FiUpload } = FiIcons;

// Extended icon options (same as in AddCollectionModal)
const iconOptions = [
  { name: 'Folder', icon: FiIcons.FiFolder },
  { name: 'Star', icon: FiIcons.FiStar },
  { name: 'Heart', icon: FiIcons.FiHeart },
  { name: 'Code', icon: FiIcons.FiCode },
  { name: 'Bookmark', icon: FiIcons.FiBookmark },
  { name: 'Grid', icon: FiIcons.FiGrid },
  { name: 'Home', icon: FiIcons.FiHome },
  { name: 'Work', icon: FiIcons.FiBriefcase },
  { name: 'School', icon: FiIcons.FiBook },
  { name: 'Music', icon: FiIcons.FiMusic },
  { name: 'Video', icon: FiIcons.FiVideo },
  { name: 'Image', icon: FiIcons.FiImage },
  { name: 'File', icon: FiIcons.FiFile },
  { name: 'Globe', icon: FiIcons.FiGlobe },
  { name: 'Shield', icon: FiIcons.FiShield },
  { name: 'Lock', icon: FiIcons.FiLock },
  { name: 'Key', icon: FiIcons.FiKey },
  { name: 'Tool', icon: FiIcons.FiTool },
  { name: 'Settings', icon: FiIcons.FiSettings },
  { name: 'Zap', icon: FiIcons.FiZap },
  { name: 'Target', icon: FiIcons.FiTarget },
  { name: 'Trophy', icon: FiIcons.FiAward },
  { name: 'Gift', icon: FiIcons.FiGift },
  { name: 'Coffee', icon: FiIcons.FiCoffee },
  { name: 'Camera', icon: FiIcons.FiCamera },
  { name: 'Headphones', icon: FiIcons.FiHeadphones },
  { name: 'Smartphone', icon: FiIcons.FiSmartphone },
  { name: 'Monitor', icon: FiIcons.FiMonitor },
  { name: 'Printer', icon: FiIcons.FiPrinter },
  { name: 'Server', icon: FiIcons.FiServer },
  { name: 'Cloud', icon: FiIcons.FiCloud },
  { name: 'Database', icon: FiIcons.FiDatabase },
  { name: 'Map', icon: FiIcons.FiMap },
  { name: 'Calendar', icon: FiIcons.FiCalendar },
  { name: 'Clock', icon: FiIcons.FiClock },
  { name: 'Sun', icon: FiIcons.FiSun },
  { name: 'Moon', icon: FiIcons.FiMoon },
  { name: 'User', icon: FiIcons.FiUser },
  { name: 'Users', icon: FiIcons.FiUsers },
  { name: 'Mail', icon: FiIcons.FiMail },
  { name: 'Phone', icon: FiIcons.FiPhone },
  { name: 'MessageSquare', icon: FiIcons.FiMessageSquare },
  { name: 'Bell', icon: FiIcons.FiBell },
  { name: 'Search', icon: FiIcons.FiSearch },
  { name: 'List', icon: FiIcons.FiList },
  { name: 'Package', icon: FiIcons.FiPackage },
  { name: 'Box', icon: FiIcons.FiBox },
  { name: 'Tag', icon: FiIcons.FiTag },
  { name: 'ShoppingCart', icon: FiIcons.FiShoppingCart },
  { name: 'CreditCard', icon: FiIcons.FiCreditCard },
  { name: 'DollarSign', icon: FiIcons.FiDollarSign },
  { name: 'Eye', icon: FiIcons.FiEye },
  { name: 'GitHub', icon: FiIcons.FiGithub },
  { name: 'Linkedin', icon: FiIcons.FiLinkedin },
  { name: 'Twitter', icon: FiIcons.FiTwitter },
  { name: 'Facebook', icon: FiIcons.FiFacebook },
  { name: 'Instagram', icon: FiIcons.FiInstagram },
  { name: 'Youtube', icon: FiIcons.FiYoutube },
];

const colorOptions = [
  '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
  '#6366f1', '#14b8a6', '#eab308', '#dc2626', '#9333ea', '#db2777', '#0891b2', '#65a30d', '#ea580c',
  '#7c3aed', '#be185d', '#0e7490', '#4d7c0f', '#c2410c', '#6d28d9', '#a21caf', '#155e75', '#365314',
  '#9a3412', '#581c87', '#831843', '#164e63', '#1a2e05', '#7c2d12', '#4c1d95', '#701a75', '#0f172a',
  '#052e16', '#431407', '#312e81', '#4a044e', '#64748b', '#6b7280', '#78716c', '#6c6c6c', '#525252',
  '#374151', '#1f2937', '#111827', '#0f0f0f', '#000000',
];

const EditCollectionModal = ({ collection, onClose }) => {
  const { updateCollection } = useBookmarks();
  const [formData, setFormData] = useState({
    name: collection.name,
    color: collection.color,
    icon: collection.icon,
    colspan: collection.colspan,
    customIcon: collection.customIcon || null,
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Collection name is required');
      return;
    }
    
    updateCollection(collection.id, formData);
    toast.success('Collection updated successfully!');
    onClose();
  };

  const handleCustomIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          customIcon: event.target.result,
          icon: 'custom'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredIcons = iconOptions.filter(option => 
    option.name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Collection
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Collection Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
              placeholder="Enter collection name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            
            {/* Custom Icon Upload */}
            <div className="mb-3">
              <label className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Upload Custom Icon</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomIconUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            {/* Current custom icon preview */}
            {formData.customIcon && (
              <div className="flex items-center space-x-3 mb-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <img src={formData.customIcon} alt="Custom Icon" className="w-8 h-8 object-contain" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Custom icon set</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, customIcon: null, icon: 'Folder' })}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Icon Search */}
            <input
              type="text"
              placeholder="Search icons..."
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
              className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm"
            />
            
            <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto">
              {filteredIcons.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: option.name, customIcon: null })}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    formData.icon === option.name && !formData.customIcon
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
                  }`}
                  title={option.name}
                >
                  <SafeIcon icon={option.icon} className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            
            {/* Color Presets */}
            <div className="grid grid-cols-10 gap-2 mb-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-colors ${
                    formData.color === color
                      ? 'border-gray-800 dark:border-white'
                      : 'border-gray-300 dark:border-dark-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Color Picker */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-dark-600"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formData.color}
              </span>
            </div>
            
            {showColorPicker && (
              <div className="mt-2 z-[1001] relative">
                <ChromePicker
                  color={formData.color}
                  onChange={(color) => setFormData({ ...formData, color: color.hex })}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Width
            </label>
            <select
              value={formData.colspan}
              onChange={(e) => setFormData({ ...formData, colspan: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            >
              <option value={1}>1 Column</option>
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>Full Width</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditCollectionModal;