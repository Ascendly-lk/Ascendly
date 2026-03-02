
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Dashboard Overview';
      case '/clients': return 'My Clients & Matches';
      case '/reports': return 'Campaign Reports';
      default: return 'Ascendly';
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-[#E6FBFF] overflow-hidden">
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out border-r border-[#12324A] bg-[#071426] hidden md:block`}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header title={getPageTitle(location.pathname)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
