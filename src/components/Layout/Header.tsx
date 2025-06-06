import React from 'react';
import { Settings, Moon } from 'lucide-react';
import Button from '../UI/Button';

// Simulated current user (replace with auth context later)
const currentUser = {
  name: 'Siddardh Polepalli',
};

const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-gray-200 bg-white px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* Left Section: Welcome Message */}
      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-gray-800 text-sm md:text-base font-medium tracking-tight">
          Welcome back, {currentUser.name.split(' ')[0]} 👋
        </span>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full p-1.5 text-gray-500 hover:text-gray-900"
          aria-label="Toggle theme"
          title="Toggle Theme"
        >
          <Moon size={18} />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full p-1.5 text-gray-500 hover:text-gray-900"
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={18} />
        </Button>

        {/* User Avatar */}
        <div
          className="h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm"
          title={currentUser.name}
          aria-label={`Logged in as ${currentUser.name}`}
        >
          {getUserInitials(currentUser.name)}
        </div>
      </div>
    </header>
  );
};

export default Header;
