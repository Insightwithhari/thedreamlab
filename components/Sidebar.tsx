import React from 'react';
import type { Page } from '../App';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage }) => {
  const NavLink: React.FC<{ page: Page; label: string }> = ({ page, label }) => {
    const isActive = currentPage === page;
    const activeClasses = 'bg-cyan-500/20 text-white';
    const inactiveClasses = 'text-gray-300 hover:bg-gray-700 hover:text-white';

    return (
      <li>
        <a
          href={`#${page}`}
          onClick={onClose}
          className={`w-full text-left px-4 py-3 block transition-colors rounded-r-md ${isActive ? activeClasses : inactiveClasses}`}
        >
          {label}
        </a>
      </li>
    );
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-20 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-xl z-30 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Navigation</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <NavLink page="home" label="Home" />
            <NavLink page="chatbot" label="Dr. Rhesus Chatbot" />
            <NavLink page="supervisor" label="Supervisor Page" />
            <NavLink page="about" label="About Us" />
            <NavLink page="contact" label="Contact Us" />
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;