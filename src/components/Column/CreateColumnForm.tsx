import React, { useState } from 'react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import Button from '../UI/Button';

interface CreateColumnFormProps {
  boardId: string;
  onClose: () => void;
}

const CreateColumnForm: React.FC<CreateColumnFormProps> = ({ boardId, onClose }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  
  const { createColumn } = useTaskBoard();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Column title is required');
      return;
    }
    
    createColumn(boardId, title);
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="column-title" className="block text-sm font-medium text-gray-700">
            Column Title
          </label>
          <input
            id="column-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            placeholder="e.g., To Do, In Progress, Done"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
            Create Column
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateColumnForm;