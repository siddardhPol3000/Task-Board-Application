import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User, Edit2, Trash2 } from 'lucide-react';
import { Task, Priority } from '../../types';
import { useTaskBoard } from '../../context/TaskBoardContext';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

interface TaskDetailsProps {
  task: Task;
  columnId: string;
  onClose: () => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-amber-100 text-amber-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, columnId, onClose }) => {
  const { state, dispatch } = useTaskBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || '');
  const [createdBy, setCreatedBy] = useState(task.createdBy || '');

  const creatorName = createdBy || 'Unknown';
  const assigneeName = assignedTo || null;

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!state.currentBoardId || !title.trim()) return;

    const updatedTask: Task = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      assignedTo: assignedTo || null,
      createdBy: createdBy || null,
      updatedAt: new Date().toISOString(),
    };

    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        boardId: state.currentBoardId,
        task: updatedTask,
      },
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!state.currentBoardId) return;

    dispatch({
      type: 'DELETE_TASK',
      payload: {
        boardId: state.currentBoardId,
        columnId,
        taskId: task.id,
      },
    });

    setIsDeleteModalOpen(false);
    onClose();
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
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
              required
            />
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
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

          <div>
            <label htmlFor="task-assignee" className="block text-sm font-medium text-gray-700">
              Assigned To
            </label>
            <input
              id="task-assignee"
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Enter assignee name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="task-createdby" className="block text-sm font-medium text-gray-700">
              Created By
            </label>
            <input
              id="task-createdby"
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="Enter creator name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" icon={<Edit2 size={16} />} onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                icon={<Trash2 size={16} />}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>

          {task.description && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <User size={16} className="mr-2 text-gray-500" />
                <span className="font-medium mr-2">Created by:</span>
                <span>{creatorName}</span>
              </div>

              {assigneeName && (
                <div className="flex items-center text-gray-700">
                  <User size={16} className="mr-2 text-gray-500" />
                  <span className="font-medium mr-2">Assigned to:</span>
                  <span>{assigneeName}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {task.dueDate && (
                <div className="flex items-center text-gray-700">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  <span className="font-medium mr-2">Due date:</span>
                  <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                </div>
              )}

              <div className="flex items-center text-gray-700">
                <Clock size={16} className="mr-2 text-gray-500" />
                <span className="font-medium mr-2">Created:</span>
                <span>{format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock size={16} className="mr-2 text-gray-500" />
                <span className="font-medium mr-2">Updated:</span>
                <span>{format(new Date(task.updatedAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetails;
