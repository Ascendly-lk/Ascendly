import React, { useState, useMemo, createContext } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ClientsPage from './pages/Clients.jsx';
import ReportsPage from './pages/Reports.jsx';
import AiPage from './pages/Ai.jsx'; 
import { MOCK_CLIENTS, MOCK_TASKS, MOCK_DELIVERABLES } from './data/mockData.js';
import './App.css';
import Help from './pages/Help.jsx';
import CalendarPage from './pages/Calendar.jsx';
import FeedbackPage from './pages/Feedback.jsx';


export const AppContext = createContext();

const App = () => {
  const [clients] = useState(MOCK_CLIENTS);
  const [tasks] = useState(MOCK_TASKS);
  const [deliverables, setDeliverables] = useState(MOCK_DELIVERABLES);
  const [searchQuery, setSearchQuery] = useState('');

  const contextValue = useMemo(() => ({
    clients,
    tasks,
    deliverables,
    setDeliverables,
    searchQuery,
    setSearchQuery,
  }), [clients, tasks, deliverables, searchQuery]);

  return (
    <AppContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Layout>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/ai-analytics" element={<AiPage />} />
            <Route path="/help" element={<Help />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </MemoryRouter>
    </AppContext.Provider>
  );
};

export default App;