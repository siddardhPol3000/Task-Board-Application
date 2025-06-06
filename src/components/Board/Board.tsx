import React, { useState } from 'react';
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import { Plus, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import Column from '../Column/Column';
import CreateColumnForm from '../Column/CreateColumnForm';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

const Board: React.FC = () => {
  const { state, dispatch } = useTaskBoard();
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  
  const currentBoard = state.currentBoardId ? state.boards[state.currentBoardId] : null;
  
  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No board selected</h2>
          <p className="text-gray-600">Select a board from the sidebar or create a new one.</p>
        </div>
      </div>
    );
  }
  
  const handleDragEnd = (result: DropResult) => {
    if (!state.currentBoardId) return;
    
    dispatch({
      type: 'MOVE_TASK',
      payload: {
        boardId: state.currentBoardId,
        result,
      },
    });
  };
  
  const handleEditBoard = () => {
    setBoardTitle(currentBoard.title);
    setBoardDescription(currentBoard.description);
    setIsEditBoardModalOpen(true);
  };
  
  const handleUpdateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.currentBoardId || !boardTitle.trim()) return;
    
    dispatch({
      type: 'UPDATE_BOARD',
      payload: {
        boardId: state.currentBoardId,
        title: boardTitle,
        description: boardDescription,
      },
    });
    
    setIsEditBoardModalOpen(false);
  };
  
  const handleDeleteBoard = () => {
    if (!state.currentBoardId) return;
    
    dispatch({
      type: 'DELETE_BOARD',
      payload: state.currentBoardId,
    });
    
    setIsDeleteBoardModalOpen(false);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{currentBoard.title}</h1>
          {currentBoard.description && (
            <p className="text-sm text-gray-600 mt-1">{currentBoard.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit2 size={16} />}
            onClick={handleEditBoard}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => setIsDeleteBoardModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex h-full gap-6">
            {currentBoard.columnOrder.map((columnId) => {
              const column = currentBoard.columns[columnId];
              const tasks = column.taskIds.map((taskId) => currentBoard.tasks[taskId]);
              
              return <Column key={column.id} column={column} tasks={tasks} />;
            })}
            
            <div className="shrink-0 w-72">
              <Button
                variant="ghost"
                fullWidth
                className="border-2 border-dashed border-gray-300 h-16 rounded-lg hover:border-gray-400 hover:bg-gray-50"
                onClick={() => setIsCreateColumnModalOpen(true)}
                icon={<Plus size={20} />}
              >
                Add Column
              </Button>
            </div>
          </div>
        </div>
      </DragDropContext>
      
      {/* Create Column Modal */}
      <Modal
        isOpen={isCreateColumnModalOpen}
        onClose={() => setIsCreateColumnModalOpen(false)}
        title="Create New Column"
      >
        <CreateColumnForm 
          boardId={state.currentBoardId as string}
          onClose={() => setIsCreateColumnModalOpen(false)} 
        />
      </Modal>
      
      {/* Edit Board Modal */}
      <Modal
        isOpen={isEditBoardModalOpen}
        onClose={() => setIsEditBoardModalOpen(false)}
        title="Edit Board"
      >
        <form onSubmit={handleUpdateBoard}>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-board-title" className="block text-sm font-medium text-gray-700">
                Board Title
              </label>
              <input
                id="edit-board-title"
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="edit-board-description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="edit-board-description"
                value={boardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditBoardModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Board
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      
      {/* Delete Board Modal */}
      <Modal
        isOpen={isDeleteBoardModalOpen}
        onClose={() => setIsDeleteBoardModalOpen(false)}
        title="Delete Board"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this board? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteBoardModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteBoard}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Board;