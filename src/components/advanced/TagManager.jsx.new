// src/components/advanced/TagManager.jsx for TodoForm
import React, { useState } from 'react';
import { useTodos } from '../../context/TodoContext';

const TagManager = ({ selectedTags = [], onTagsChange }) => {
  const { availableTags = [] } = useTodos();
  const [newTag, setNewTag] = useState('');
  
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    // Check if tag already exists
    if (!selectedTags.includes(newTag.trim())) {
      const updatedTags = [...selectedTags, newTag.trim()];
      onTagsChange(updatedTags);
    }
    
    setNewTag('');
  };
  
  const handleRemoveTag = (tag) => {
    const updatedTags = selectedTags.filter(t => t !== tag);
    onTagsChange(updatedTags);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tags
      </label>
      
      <div className="flex flex-wrap mb-2">
        {selectedTags.map(tag => (
          <span key={tag} className="tag">
            {tag}
            <button
              type="button"
              className="tag-remove"
              onClick={() => handleRemoveTag(tag)}
              aria-label={`Remove tag ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="input flex-grow mr-2"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
        >
          Add
        </button>
      </div>
      
      {availableTags.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">Suggestions:</p>
          <div className="flex flex-wrap">
            {availableTags
              .filter(tag => !selectedTags.includes(tag))
              .slice(0, 5)
              .map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    onTagsChange([...selectedTags, tag]);
                  }}
                  className="mr-1 mb-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                >
                  {tag}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManager;
