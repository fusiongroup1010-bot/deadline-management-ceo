import React from 'react';
import { Bell, Search, Plus, Calendar as CalendarIcon, Menu, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

const TopNav = ({ onMenuClick }) => {
  const today = new Date();
  const { openAddModal, activeLocation, setActiveLocation } = useEvents();
  const { currentUser } = useAuth();

  return (
    <header className="top-nav" style={{ marginBottom: '24px' }}>
      <button 
        className="sidebar-toggle-main-mobile"
        style={{ display: 'none' }}
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
        {/* Location Switcher Tabs - Filtered by user permissions */}
        <div style={{ 
          display: 'flex', 
          background: 'var(--bg-main)', 
          padding: '4px', 
          borderRadius: '14px',
          border: '1px solid var(--border-light)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          {['hanoi', 'hcm'].filter(loc => currentUser?.allowedLocations?.includes(loc)).map(loc => (
            <button
              key={loc}
              onClick={() => setActiveLocation(loc)}
              style={{
                padding: '8px 24px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: activeLocation === loc ? 'var(--primary-accent)' : 'transparent',
                color: activeLocation === loc ? 'white' : 'var(--text-muted)',
                boxShadow: activeLocation === loc ? '0 4px 12px rgba(96, 165, 250, 0.3)' : 'none',
                cursor: currentUser?.allowedLocations?.length > 1 ? 'pointer' : 'default'
              }}
            >
              {loc}
            </button>
          ))}
        </div>

        <div className="soft-panel" style={{ display: 'none', alignItems: 'center', padding: '12px 20px', borderRadius: 'var(--radius-full)', width: '340px', gap: '12px', background: 'var(--bg-panel)' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Quick Search..." 
            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '15px', fontWeight: '500' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontWeight: '600', paddingRight: '12px', borderRight: '1px solid var(--border-light)' }}>
           <CalendarIcon size={18} color="var(--primary-accent)"/>
           <span>{format(today, 'EEEE, MMM dd', { locale: enUS })}</span>
        </div>

        {currentUser?.role !== 'guest' && (
          <button 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={openAddModal}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Task</span>
          </button>
        )}
        
        <div style={{ padding: '0 16px', height: '44px', borderRadius: '16px', background: 'var(--pink-pastel)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--pink-accent)', marginLeft: '4px', cursor: 'pointer', boxShadow: 'var(--shadow-soft)', fontSize: '13px' }}>
          {currentUser ? (currentUser.id === 'Guest' ? 'Guest mode' : currentUser.name) : 'Guest'}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
