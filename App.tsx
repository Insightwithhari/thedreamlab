import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProteinBackground from './components/ProteinBackground';
import ChatbotPage from './pages/ChatbotPage';
import SupervisorPage from './pages/SupervisorPage';
import AboutUsPage from './pages/AboutUsPage';
import { MenuIcon } from './components/icons';

type Page = 'chatbot' | 'supervisor' | 'about';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('chatbot');

  const renderPage = () => {
    switch (currentPage) {
      case 'chatbot':
        return <ChatbotPage />;
      case 'supervisor':
        return <SupervisorPage />;
      case 'about':
        return <AboutUsPage />;
      default:
        return <ChatbotPage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
      <ProteinBackground />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        setCurrentPage={setCurrentPage}
      />
      
      <div className="relative z-10 flex flex-col h-screen">
        <header className="flex items-center p-4 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 rounded-md hover:bg-gray-700 transition-colors mr-4"
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </button>
          <div className="text-center flex-grow">
            <h1 className="text-2xl font-bold text-cyan-300 tracking-wider">The Dream Lab</h1>
            <p className="text-sm text-gray-400">- we explore the questions we want the answers for.</p>
          </div>
          <div className="w-10"></div> {/* Spacer to balance the button */}
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
