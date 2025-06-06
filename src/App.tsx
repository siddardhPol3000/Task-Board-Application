// src/App.tsx
// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TaskBoardProvider } from './context/TaskBoardContext'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Board from './components/Board/Board'
import Home from './pages/Home' // You'll create this next

function App() {
  return (
    <TaskBoardProvider>
      <BrowserRouter>
        <div className="h-screen flex flex-col bg-gray-50">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/board" element={<Board />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TaskBoardProvider>
  )
}

export default App
