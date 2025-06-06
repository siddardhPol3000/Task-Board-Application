import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { Task as TaskType } from '../../types';
import { useTaskBoard } from '../../context/TaskBoardContext';
import Modal from '../UI/Modal';
import TaskDetails from './TaskDetails';

interface TaskProps {
  task: TaskType;
  index: number;
  columnId: string;
}

const getPriorityColor = (priority: string) => {
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

const Task: React.FC<TaskProps> = ({ task, index, columnId }) => {
  // No need for state.users lookup now since createdBy and assignedTo are plain text
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const creator = task.createdBy || 'Unknown';
  const assignee = task.assignedTo || null;

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-3 mb-2 bg-white rounded-md shadow-sm border border-gray-200 
              hover:shadow-md transition-shadow duration-200 cursor-pointer select-none
              ${snapshot.isDragging ? 'shadow-md rotate-1' : ''}`}
            onClick={() => setIsDetailsOpen(true)}
          >
            <div className="mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>

            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>

            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {task.dueDate && (
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}

              {creator && (
                <div className="flex items-center italic text-blue-600">
                  <User size={12} className="mr-1" />
                  <span>By: {creator}</span>
                </div>
              )}

              {assignee && (
                <div className="flex items-center">
                  <User size={12} className="mr-1" />
                  <span>To: {assignee}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Task Details"
        size="lg"
      >
        <TaskDetails task={task} columnId={columnId} onClose={() => setIsDetailsOpen(false)} />
      </Modal>
    </>
  );
};

export default Task;
