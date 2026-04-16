import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import TaskBoard from './components/TaskBoard';
import TaskModal from './components/TaskModal';
import Login from './components/Login';
import NotifyBoard from './components/NotifyBoard';
import { EventProvider } from './context/EventContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotifyProvider } from './context/NotifyContext';
import NotifyWindow from './components/NotifyWindow';

function AppContent() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const themeColor = localStorage.getItem('themeColor');
    const bgColor = localStorage.getItem('bgColor');
    const fontFamily = localStorage.getItem('fontFamily');
    const appScale = localStorage.getItem('appScale');

    const root = document.documentElement;
    if (themeColor) {
      root.style.setProperty('--primary-accent', themeColor);
      root.style.setProperty('--primary-pastel', `${themeColor}33`);
    }
    if (bgColor) {
      root.style.setProperty('--bg-main', bgColor);
    }
    if (fontFamily) {
      document.body.style.fontFamily = fontFamily;
    }
    if (appScale) {
      document.body.style.zoom = appScale === '110%' ? '1.1' : (appScale === '90%' ? '0.9' : '1');
    }
  }, []);

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-active' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-content">
        <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/notify" element={<NotifyBoard />} />
            <Route path="/reports" element={<CalendarView />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <NotifyWindow />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  handleReset = () => {
    localStorage.clear();
    window.location.href = window.location.origin + window.location.pathname;
  };
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100vh', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', 
          padding: '20px', textAlign: 'center', background: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ color: '#e11d48', marginBottom: '16px' }}>Oops! Something went wrong.</h1>
          <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '500px' }}>
            The application encountered a runtime error. This might be due to corrupted local data or a browser compatibility issue.
          </p>
          <div style={{ 
            background: '#fee2e2', padding: '16px', borderRadius: '12px', 
            marginBottom: '24px', maxWidth: '800px', overflow: 'auto',
            textAlign: 'left', border: '1px solid #fecaca'
          }}>
            <code style={{ fontSize: '12px', color: '#991b1b' }}>{this.state.error?.toString()}</code>
          </div>
          <button 
            onClick={this.handleReset}
            style={{ 
              padding: '12px 24px', background: '#3b82f6', color: 'white', 
              border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
            }}
          >
            Clear Data & Restart App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotifyProvider>
          <EventProvider>
            <Router>
              <AppContent />
              <TaskModal />
            </Router>
          </EventProvider>
        </NotifyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
