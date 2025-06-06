import React from 'react';
import { Link } from 'react-router-dom';
import BoardList from '../Board/BoardList';
import logo from './../../assets/logo.png';

const Sidebar: React.FC = () => {
  return (
    <aside
      className="w-64 h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden"
      aria-label="Sidebar Navigation"
    >
      {/* Logo / Brand */}
      <div className="p-5 border-b border-gray-200">
        <Link
          to="/"
          className="flex items-center space-x-1 hover:opacity-90 transition-opacity duration-200"
          aria-label="Go to homepage"
          title="Go to homepage"
        >
          <img
            src={logo}
            alt="TaskBoard Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Task<span className="text-blue-600">Board</span>
          </h1>
        </Link>
      </div>

      {/* Board Navigation List */}
      <nav className="flex-1 overflow-auto">
        <BoardList />
      </nav>
    </aside>
  );
};

export default Sidebar;
