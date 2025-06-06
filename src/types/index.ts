export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  description: string;
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  columnOrder: string[];
}

export interface AppState {
  boards: Record<string, Board>;
  boardOrder: string[];
  currentBoardId: string | null;
  users: Record<string, User>;
}

export type DropResult = {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  reason: 'DROP' | 'CANCEL';
};

export type ActionType = 
  | { type: 'SET_CURRENT_BOARD'; payload: string }
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'UPDATE_BOARD'; payload: { boardId: string; title: string; description: string } }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'ADD_COLUMN'; payload: { boardId: string; column: Column } }
  | { type: 'UPDATE_COLUMN'; payload: { boardId: string; columnId: string; title: string } }
  | { type: 'DELETE_COLUMN'; payload: { boardId: string; columnId: string } }
  | { type: 'ADD_TASK'; payload: { boardId: string; columnId: string; task: Task } }
  | { type: 'UPDATE_TASK'; payload: { boardId: string; task: Task } }
  | { type: 'DELETE_TASK'; payload: { boardId: string; columnId: string; taskId: string } }
  | { type: 'MOVE_TASK'; payload: { boardId: string; result: DropResult } };