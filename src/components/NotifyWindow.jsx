import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Bell, Send, X, AlertCircle, Pin, Search, Filter, Trash2, CheckCheck, Maximize2, Minimize2, ChevronDown, User, Shield, Megaphone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotify } from '../context/NotifyContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const NotifyWindow = () => {
  const { currentUser } = useAuth();
  const { notifications, unreadCount, sendNotification, markAsRead, togglePin, deleteNotification } = useNotify();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('unread'); // default to unread
  const [search, setSearch] = useState('');
  const [composeMode, setComposeMode] = useState(false);

  // ... (compose state remains)

  const filteredNotifs = notifications.filter(n => {
    const matchesSearch = n.content.toLowerCase().includes(search.toLowerCase()) || 
                         n.senderName.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'unread') return matchesSearch && !n.readBy?.includes(currentUser.id);
    if (activeTab === 'pinned') return matchesSearch && n.pinned;
    return matchesSearch;
  });

  // Check if we should auto-open on new message? (Toast logic is better)
  // For now just keep it manual.

  const toggleOpen = () => { setIsOpen(!isOpen); };

  return (
    <div className={`notify-wrapper ${isOpen ? 'open' : ''} ${isMaximized ? 'maximized' : ''}`}>
      <button 
        className={`notify-toggle ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={toggleOpen}
      >
        {isOpen ? <X size={24} /> : <><MessageSquare size={24} />{unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}</>}
      </button>

      {isOpen && (
        <div className="notify-window soft-panel animate-slide-up">
          <div className="notify-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="notify-icon-container"><Bell size={20} /></div>
              <div>
                <h4>{activeTab === 'unread' ? 'New Announcements' : 'Notify Center'}</h4>
                <p>{unreadCount} messages waiting</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
               <Link to="/notify" onClick={() => setIsOpen(false)} style={{ color: 'white', background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                 <ExternalLink size={16} />
               </Link>
               <button className="btn-icon-mini" onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}><X size={16} /></button>
            </div>
          </div>

          <div className="notify-controls">
            <div style={{ display: 'flex', gap: '4px' }}>
              {['unread', 'pinned', 'all'].map(tab => (
                <button key={tab} className={`tab-btn-mini ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="notify-body" style={{ background: 'var(--bg-main)' }}>
            {composeMode ? (
              <form className="notify-compose animate-fade-in" onSubmit={handleSend}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                   <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'var(--primary-accent)' }}>New Broadcast</h5>
                   <button type="button" className="btn-icon-mini" onClick={() => setComposeMode(false)}><X size={16}/></button>
                 </div>
                 {/* ... (rest of compose form) ... */}
                 <div className="form-group-mini">
                   <label>To</label>
                   <select value={recipientScope} onChange={e => setRecipientScope(e.target.value)}>
                     <option value="all">Everyone</option>
                     {currentUser.allowedLocations.map(loc => <option key={loc} value={loc}>{loc.toUpperCase()}</option>)}
                     {currentUser.id !== 'CEOFS' && <option value="CEOFS">CEO</option>}
                   </select>
                 </div>
                 <div className="form-group-mini">
                   <label>Content</label>
                   <textarea placeholder="Message..." value={newContent} onChange={e => setNewContent(e.target.value)} />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                   <label className="urgent-toggle">
                     <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} />
                     <AlertCircle size={14} color={urgent ? '#ef4444' : '#64748b'} />
                     <span style={{ fontSize: '11px' }}>Urgent</span>
                   </label>
                   <button type="submit" className="btn-primary" disabled={sending}>{sending ? '...' : 'Send'}</button>
                 </div>
              </form>
            ) : (
              <div className="message-list">
                {filteredNotifs.length === 0 ? (
                  <div className="empty-notifs">
                    <p>{activeTab === 'unread' ? '✨ No new messages' : 'No messages found'}</p>
                    {activeTab === 'unread' && <button className="btn-ghost-mini" onClick={() => setActiveTab('all')}>View History</button>}
                  </div>
                ) : (
                  filteredNotifs.map(n => (
                    <div key={n.id} className={`message-item ${n.type === 'emergency' ? 'urgent' : ''}`} onClick={() => !n.readBy?.includes(currentUser.id) && markAsRead(n.id)}>
                      <div className="message-header" style={{ marginBottom: '4px' }}>
                         <span className="sender-name" style={{ fontSize: '12px' }}>{n.senderName}</span>
                         <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{format(n.createdAt?.toDate ? n.createdAt.toDate() : new Date(), 'HH:mm')}</span>
                      </div>
                      <div className="message-bubble" style={{ padding: '12px 14px' }}>
                         <p style={{ fontSize: '13px' }}>{n.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="notify-footer" style={{ display: 'flex', gap: '8px' }}>
            <Link to="/notify" onClick={() => setIsOpen(false)} className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
               <Clock size={14} /> Full History
            </Link>
            {currentUser.canSendNotify && (
              <button className="btn-primary" style={{ flex: 1.5, padding: '10px', fontSize: '12px' }} onClick={() => setComposeMode(true)}>
                <Megaphone size={14} /> Broadcast
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifyWindow;
