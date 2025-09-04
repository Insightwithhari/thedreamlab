import React from 'react';

type Page = 'home' | 'chatbot' | 'supervisor' | 'about' | 'contact';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, setCurrentPage }) => {
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    onClose();
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
        <div className="p-4">
          <h2 className="text-xl font-bold text-white">Navigation</h2>
        </div>
        <nav>
          <ul>
            <li>
              <button 
                onClick={() => handleNavigation('home')}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('chatbot')}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Dr. Rhesus Chatbot
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('supervisor')}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Supervisor Page
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('about')}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                About Us
              </button>
            </li>
             <li>
              <button 
                onClick={() => handleNavigation('contact')}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
