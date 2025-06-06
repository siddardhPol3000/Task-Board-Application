import React, { useState } from 'react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import Button from '../UI/Button';
import { Priority } from '../../types';

interface CreateTaskFormProps {
  boardId: string;
  columnId: string;
  onClose: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ boardId, columnId, onClose }) => {
  const { createTask } = useTaskBoard();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!createdBy.trim()) {
      setError('Created By is required');
      return;
    }

    createTask(boardId, columnId, {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      createdBy,
      assignedTo: assignedTo || null,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          placeholder="Enter task title"
          required
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          placeholder="Enter task description (optional)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-created-by" className="block text-sm font-medium text-gray-700">
            Created By
          </label>
          <input
            id="task-created-by"
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            placeholder="Enter creator's name"
            required
          />
        </div>

        <div>
          <label htmlFor="task-assigned-to" className="block text-sm font-medium text-gray-700">
            Assigned To
          </label>
          <input
            id="task-assigned-to"
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            placeholder="Enter assignee's name (optional)"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Task
        </Button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
