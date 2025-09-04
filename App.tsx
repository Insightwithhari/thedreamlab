import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProteinBackground from './components/ProteinBackground';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import SupervisorPage from './pages/SupervisorPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import { MenuIcon } from './components/icons';

export type Page = 'home' | 'chatbot' | 'supervisor' | 'about' | 'contact';

const getPageFromHash = (): Page => {
    const hash = window.location.hash.substring(1);
    const validPages: Page[] = ['home', 'chatbot', 'supervisor', 'about', 'contact'];
    if (validPages.includes(hash as Page)) {
        return hash as Page;
    }
    return 'home';
};

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial hash if none exists to ensure a valid starting point
    if (!window.location.hash) {
        window.location.hash = '#home';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'chatbot':
        return <ChatbotPage />;
      case 'supervisor':
        return <SupervisorPage />;
      case 'about':
        return <AboutUsPage />;
      case 'contact':
        return <ContactUsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <ProteinBackground />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentPage={currentPage}
      />
      
      <div className="relative z-10 flex flex-col flex-grow">
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

        <footer className="p-4 bg-gray-900/70 backdrop-blur-sm border-t border-gray-700/50 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} The Dream Lab. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default App;
