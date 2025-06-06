import React, { useState } from 'react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import Button from '../UI/Button';

interface CreateBoardFormProps {
  onClose: () => void;
}

const CreateBoardForm: React.FC<CreateBoardFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  
  const { createBoard } = useTaskBoard();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Board title is required');
      return;
    }
    
    createBoard(title, description);
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="board-title" className="block text-sm font-medium text-gray-700">
            Board Title
          </label>
          <input
            id="board-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            placeholder="Enter board title"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <div>
          <label htmlFor="board-description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="board-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            placeholder="Enter board description (optional)"
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            Create Board
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateBoardForm;