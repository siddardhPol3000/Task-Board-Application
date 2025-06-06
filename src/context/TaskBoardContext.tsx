import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, ActionType, Board, Column, Task } from '../types';

// Initial demo users
const initialUsers = {
  'user-1': { id: 'user-1', name: 'Siddardh' },
  'user-2': { id: 'user-2', name: 'Vamshi' },
};

// Initial demo board data
const initialBoard: Board = {
  id: 'board-1',
  title: 'My First Board',
  description: 'A sample board to get you started',
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Create Task Board UI',
      description: 'Design the main layout and add sections for tasks.',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'user-1',
      assignedTo: 'user-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'task-2': {
      id: 'task-2',
      title: 'Set Up Project Folder',
      description: 'Create folders for components, context, and UI files.',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'user-1',
      assignedTo: 'user-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'task-3': {
      id: 'task-3',
      title: 'Add Login Page',
      description: 'Build a simple login form with username and password.',
      priority: 'medium',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'user-1',
      assignedTo: 'user-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const initialState: AppState = {
  boards: { 'board-1': initialBoard },
  boardOrder: ['board-1'],
  currentBoardId: 'board-1',
  users: initialUsers,
};

// Reducer function handling all actions
const taskBoardReducer = (state: AppState, action: ActionType): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_BOARD':
      return {
        ...state,
        currentBoardId: action.payload,
      };

    case 'ADD_BOARD': {
      const newBoard = action.payload;
      return {
        ...state,
        boards: {
          ...state.boards,
          [newBoard.id]: newBoard,
        },
        boardOrder: [...state.boardOrder, newBoard.id],
        currentBoardId: newBoard.id,
      };
    }

    case 'UPDATE_BOARD': {
      const { boardId, title, description } = action.payload;
      const board = state.boards[boardId];
      if (!board) return state;

      const updatedBoard = {
        ...board,
        title,
        description,
      };

      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: updatedBoard,
        },
      };
    }

    case 'DELETE_BOARD': {
      const boardId = action.payload;
      const newBoards = { ...state.boards };
      delete newBoards[boardId];

      const newBoardOrder = state.boardOrder.filter(id => id !== boardId);

      return {
        ...state,
        boards: newBoards,
        boardOrder: newBoardOrder,
        currentBoardId: newBoardOrder.length > 0 ? newBoardOrder[0] : null,
      };
    }

    case 'ADD_COLUMN': {
      const { boardId, column } = action.payload;
      const board = state.boards[boardId];
      if (!board) return state;

      const updatedBoard = {
        ...board,
        columns: {
          ...board.columns,
          [column.id]: column,
        },
        columnOrder: [...board.columnOrder, column.id],
      };

      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: updatedBoard,
        },
      };
    }

    case 'UPDATE_COLUMN': {
      const { boardId, columnId, title } = action.payload;
      const board = state.boards[boardId];
      if (!board || !board.columns[columnId]) return state;

      const updatedColumn = {
        ...board.columns[columnId],
        title,
      };

      const updatedBoard = {
        ...board,
        columns: {
          ...board.columns,
          [columnId]: updatedColumn,
        },
      };

      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: updatedBoard,
        },
      };
    }

    case 'DELETE_COLUMN': {
      const { boardId, columnId } = action.payload;
      const board = state.boards[boardId];
      if (!board) return state;

      const newColumns = { ...board.columns };
      delete newColumns[columnId];

      const newColumnOrder = board.columnOrder.filter(id => id !== columnId);

      // Remove tasks in the deleted column
      const tasksToRemove = board.columns[columnId]?.taskIds || [];
      const newTasks = { ...board.tasks };
      tasksToRemove.forEach(taskId => {
        delete newTasks[taskId];
      });

      const updatedBoard = {
        ...board,
        columns: newColumns,
        columnOrder: newColumnOrder,
        tasks: newTasks,
      };

      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: updatedBoard,
        },
      };
    }

    case 'ADD_TASK': {
      const { boardId, columnId, task } = action.payload;
      const board = state.boards[boardId];
      if (!board) return state;

      const column = board.columns[columnId];
      if (!column) return state;

      const updatedColumn = {
        ...column,
        taskIds: [...column.taskIds, task.id],
      };

      const updatedBoard = {
        ...board,
        columns: {
          ...board.columns,
          [columnId]: updatedColumn,
        },
        tasks: {
          ...board.tasks,
          [task.id]: task,
        },
      };

      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: updatedBoard,
        },
      };
    }

    case 'UPDATE_TASK': {
      const { boardId, task } = action.payload;
      const board = state.boards[boardId];
      if (!board) return state;

      const updatedBoard = {
        ...board,
        tasks: {
          ...board.tasks,
          [task.id]: {
            ...task,
            updatedAt: new Date().toISOString(),
          },
        },
      };

      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: updatedBoard,
        },
      };
    }

    case 'DELETE_TASK': {
      const { boardId, columnId, taskId } = action.payload;
      const board = state.boards[boardId];
      if (!board) return state;

      const column = board.columns[columnId];
      if (!column) return state;

      const updatedTaskIds = column.taskIds.filter(id => id !== taskId);

      const updatedColumn = {
        ...column,
        taskIds: updatedTaskIds,
      };

      const newTasks = { ...board.tasks };
      delete newTasks[taskId];

      const updatedBoard = {
        ...board,
        columns: {
          ...board.columns,
          [columnId]: updatedColumn,
        },
        tasks: newTasks,
      };

      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: updatedBoard,
        },
      };
    }

    case 'MOVE_TASK': {
      const { boardId, result } = action.payload;
      const { destination, source, draggableId } = result;
      if (!destination) return state;

      const board = state.boards[boardId];
      if (!board) return state;

      // If dropped at the same place
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return state;
      }

      // Moving within the same column but different position
      if (source.droppableId === destination.droppableId) {
        const column = board.columns[source.droppableId];
        const newTaskIds = Array.from(column.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...column,
          taskIds: newTaskIds,
        };

        const newBoard = {
          ...board,
          columns: {
            ...board.columns,
            [newColumn.id]: newColumn,
          },
        };

        return {
          ...state,
          boards: {
            ...state.boards,
            [boardId]: newBoard,
          },
        };
      }

      // Moving from one column to another
      const sourceColumn = board.columns[source.droppableId];
      const destinationColumn = board.columns[destination.droppableId];

      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);

      const destinationTaskIds = Array.from(destinationColumn.taskIds);
      destinationTaskIds.splice(destination.index, 0, draggableId);

      const newSourceColumn = {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      };

      const newDestinationColumn = {
        ...destinationColumn,
        taskIds: destinationTaskIds,
      };

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newSourceColumn.id]: newSourceColumn,
          [newDestinationColumn.id]: newDestinationColumn,
        },
      };

      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: newBoard,
        },
      };
    }

    default:
      return state;
  }
};

// Context interface
interface TaskBoardContextProps {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
  createBoard: (title: string, description: string) => void;
  createColumn: (boardId: string, title: string) => void;
  createTask: (boardId: string, columnId: string, taskData: Partial<Task>) => void;
}

// Create context
const TaskBoardContext = createContext<TaskBoardContextProps | undefined>(undefined);

// Provider component
export const TaskBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or use initial
  const loadState = (): AppState => {
    try {
      const savedState = localStorage.getItem('taskBoardState');
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(taskBoardReducer, loadState());

  // Persist state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('taskBoardState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [state]);

  // Create a new board
  const createBoard = (title: string, description: string) => {
    // Create columns with unique IDs
    const col1Id = `column-${uuidv4()}`;
    const col2Id = `column-${uuidv4()}`;
    const col3Id = `column-${uuidv4()}`;

    const newBoard: Board = {
      id: `board-${uuidv4()}`,
      title,
      description,
      columns: {
        [col1Id]: { id: col1Id, title: 'To Do', taskIds: [] },
        [col2Id]: { id: col2Id, title: 'In Progress', taskIds: [] },
        [col3Id]: { id: col3Id, title: 'Done', taskIds: [] },
      },
      tasks: {},
      columnOrder: [col1Id, col2Id, col3Id],
    };

    dispatch({ type: 'ADD_BOARD', payload: newBoard });
  };

  // Create a new column in a board
  const createColumn = (boardId: string, title: string) => {
    const newColumn: Column = {
      id: `column-${uuidv4()}`,
      title,
      taskIds: [],
    };

    dispatch({
      type: 'ADD_COLUMN',
      payload: { boardId, column: newColumn },
    });
  };

  // Create a new task in a specific column of a board
  const createTask = (boardId: string, columnId: string, taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${uuidv4()}`,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdBy: taskData.createdBy || Object.keys(state.users)[0],
      assignedTo: taskData.assignedTo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({
      type: 'ADD_TASK',
      payload: { boardId, columnId, task: newTask },
    });
  };

  return (
    <TaskBoardContext.Provider
      value={{
        state,
        dispatch,
        createBoard,
        createColumn,
        createTask,
      }}
    >
      {children}
    </TaskBoardContext.Provider>
  );
};

// Custom hook to use the context
export const useTaskBoard = (): TaskBoardContextProps => {
  const context = useContext(TaskBoardContext);
  if (!context) {
    throw new Error('useTaskBoard must be used within a TaskBoardProvider');
  }
  return context;
};
