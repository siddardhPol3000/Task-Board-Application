import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreHorizontal, Edit2, Trash2, Plus } from 'lucide-react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { Column as ColumnType, Task as TaskType } from '../../types';
import Task from '../Task/Task';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import CreateTaskForm from '../Task/CreateTaskForm';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const { state, dispatch } = useTaskBoard();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  
  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTitle.trim() || !state.currentBoardId) return;
    
    dispatch({
      type: 'UPDATE_COLUMN',
      payload: {
        boardId: state.currentBoardId,
        columnId: column.id,
        title: newTitle,
      },
    });
    
    setIsRenaming(false);
  };
  
  const handleDeleteColumn = () => {
    if (!state.currentBoardId) return;
    
    dispatch({
      type: 'DELETE_COLUMN',
      payload: {
        boardId: state.currentBoardId,
        columnId: column.id,
      },
    });
    
    setIsDeleteModalOpen(false);
  };
  
  return (
    <div className="shrink-0 w-72 flex flex-col bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <div className="px-3 py-2 flex items-center justify-between">
        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} className="flex-1">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onBlur={handleRenameSubmit}
            />
          </form>
        ) : (
          <h3 className="font-medium text-gray-800 flex items-center">
            <span>{column.title}</span>
            <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </h3>
        )}
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Column options"
          >
            <MoreHorizontal size={16} />
          </Button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
              <button
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  setNewTitle(column.title);
                  setIsRenaming(true);
                }}
              >
                <Edit2 size={14} className="mr-2" />
                Rename Column
              </button>
              <button
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 size={14} className="mr-2" />
                Delete Column
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Droppable droppableId={column.id} type="task">
        {(provided) => (
          <div
            className="flex-1 p-2 overflow-y-auto min-h-[200px]"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} columnId={column.id} />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                <p>No tasks yet</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
      
      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          className="justify-start text-gray-600 hover:text-gray-900"
          icon={<Plus size={16} />}
          onClick={() => setIsCreateTaskModalOpen(true)}
        >
          Add Task
        </Button>
      </div>
      
      {/* Delete Column Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Column"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the column "{column.title}"? This will also delete all tasks in this column.
          </p>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteColumn}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        title="Create New Task"
      >
        <CreateTaskForm
          boardId={state.currentBoardId as string}
          columnId={column.id}
          onClose={() => setIsCreateTaskModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Column;