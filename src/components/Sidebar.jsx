import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CalendarClock, Settings, LayoutDashboard, LogOut, ChevronLeft } from 'lucide-react';
import logo from '../assets/fusion-logo.png';
import { useAuth } from '../context/AuthContext';
import SettingsModal from './SettingsModal';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
    {/* Overlay on mobile when sidebar is open */}
    {isOpen && <div className="sidebar-overlay-mobile" onClick={onClose} />}
    
    <aside className={`sidebar soft-panel ${isOpen ? 'active' : ''}`}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '48px', width: '100%' }}>
        <img src={logo} alt="CEO Deadline Management Logo" style={{ height: '56px', width: 'auto', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '1px', color: 'var(--primary-accent)', lineHeight: '1.4', textTransform: 'uppercase' }}>
          CEO Deadline<br />Management
        </h2>
        
        {/* Mobile close button - absolute to not affect centering */}
        <button 
          className="sidebar-close-mobile"
          onClick={onClose}
          style={{ position: 'absolute', right: '-12px', top: '0', display: 'none' }}
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Main Menu</p>
        
        <NavLink to="/" style={{ textDecoration: 'none' }} end>
          {({ isActive }) => (
            <div className={`btn-ghost ${isActive ? 'active' : ''}`}>
              <Home size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>Dashboard</span>
            </div>
          )}
        </NavLink>

        <NavLink to="/tasks" style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <div className={`btn-ghost ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>Planner Board</span>
            </div>
          )}
        </NavLink>

        <NavLink to="/calendar" style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <div className={`btn-ghost ${isActive ? 'active' : ''}`}>
              <CalendarClock size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>Calendar</span>
            </div>
          )}
        </NavLink>
        
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn-ghost" title="Settings" onClick={() => setIsSettingsOpen(true)}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button 
          className="btn-ghost" 
          onClick={logout} 
          style={{ color: 'var(--pink-accent)' }}
          title="Logout"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
    </>
  );
};

export default Sidebar;
