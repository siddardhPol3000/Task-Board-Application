import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import Button from '../UI/Button';
import CreateBoardForm from './CreateBoardForm';
import Modal from '../UI/Modal';

const BoardList: React.FC = () => {
  const { state, dispatch } = useTaskBoard();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const handleBoardClick = (boardId: string) => {
    dispatch({ type: 'SET_CURRENT_BOARD', payload: boardId });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-4 py-2 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Your Boards</h2>
        <Button 
          variant="ghost"
          size="sm"
          icon={<PlusCircle size={16} />}
          onClick={() => setIsCreateModalOpen(true)}
          aria-label="Create new board"
        >
          New
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-grow px-2">
        <ul className="space-y-1">
          {state.boardOrder.map(boardId => {
            const board = state.boards[boardId];
            return (
              <li key={boardId}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors duration-150 ${
                    state.currentBoardId === boardId
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleBoardClick(boardId)}
                >
                  {board.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Board"
      >
        <CreateBoardForm onClose={() => setIsCreateModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default BoardList;