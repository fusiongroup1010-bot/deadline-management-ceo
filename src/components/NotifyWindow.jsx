import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Bell, Send, X, AlertCircle, Pin, Search, Filter, Trash2, CheckCheck, Maximize2, Minimize2, ChevronDown, User, Shield, Megaphone } from 'lucide-react';
import { useNotify } from '../context/NotifyContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const NotifyWindow = () => {
  const { currentUser } = useAuth();
  const { notifications, unreadCount, sendNotification, markAsRead, togglePin, deleteNotification } = useNotify();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, unread, pined
  const [search, setSearch] = useState('');
  const [composeMode, setComposeMode] = useState(false);

  // Compose State
  const [newContent, setNewContent] = useState('');
  const [recipientScope, setRecipientScope] = useState('all'); // all, hanoi, hcm, hungyen, CEOFS
  const [urgent, setUrgent] = useState(false);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0; // Or bottom if it's a chat
    }
  }, [notifications, isOpen]);

  if (!currentUser) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setSending(true);
    try {
      await sendNotification({
        content: newContent,
        recipients: [recipientScope],
        type: urgent ? 'emergency' : 'normal',
      });
      setNewContent('');
      setComposeMode(false);
      setUrgent(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const filteredNotifs = notifications.filter(n => {
    const matchesSearch = n.content.toLowerCase().includes(search.toLowerCase()) || 
                         n.senderName.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'unread') return matchesSearch && !n.readBy?.includes(currentUser.id);
    if (activeTab === 'pinned') return matchesSearch && n.pinned;
    return matchesSearch;
  });

  const ScopeLabel = {
      all: 'Everyone',
      hanoi: 'Hanoi Dept',
      hcm: 'HCM Dept',
      hungyen: 'Hung Yen Dept',
      CEOFS: 'Direct to CEO'
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Potentially mark all visible as read? Or just on individual click.
    }
  };

  return (
    <div className={`notify-wrapper ${isOpen ? 'open' : ''} ${isMaximized ? 'maximized' : ''}`}>
      
      {/* Floating Toggle Button */}
      <button 
        className={`notify-toggle ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={toggleOpen}
        title="Notifications & Internal Chat"
      >
        {isOpen ? <X size={24} /> : (
            <>
              <MessageSquare size={24} />
              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </>
        )}
      </button>

      {/* Main Window */}
      {isOpen && (
        <div className="notify-window soft-panel animate-slide-up">
          
          {/* Header */}
          <div className="notify-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="notify-icon-container">
                <Bell size={20} />
              </div>
              <div>
                <h4>Notify Center</h4>
                <p>{unreadCount} messages waiting</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-icon-mini" 
                onClick={() => setIsMaximized(!isMaximized)}
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button 
                className="btn-icon-mini" 
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="notify-controls">
            <div className="search-mini">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search notices..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '4px' }}>
              {['all', 'unread', 'pinned'].map(tab => (
                <button 
                  key={tab}
                  className={`tab-btn-mini ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* List Area */}
          <div className="notify-body" ref={scrollRef}>
            
            {composeMode ? (
              <form className="notify-compose animate-fade-in" onSubmit={handleSend}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                   <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'var(--primary-accent)' }}>New Broadcast</h5>
                   <button type="button" className="btn-icon-mini" onClick={() => setComposeMode(false)}><X size={16}/></button>
                 </div>

                 <div className="form-group-mini">
                   <label>To</label>
                   <select value={recipientScope} onChange={e => setRecipientScope(e.target.value)}>
                     <option value="all">Company Wide (All)</option>
                     {currentUser.allowedLocations.map(loc => (
                       <option key={loc} value={loc}>{loc.toUpperCase()} Team</option>
                     ))}
                     {currentUser.id !== 'CEOFS' && <option value="CEOFS">CEO (Direct)</option>}
                   </select>
                 </div>

                 <div className="form-group-mini">
                   <label>Content</label>
                   <textarea 
                     placeholder="Type your announcement..."
                     value={newContent}
                     onChange={e => setNewContent(e.target.value)}
                     autoFocus
                   />
                 </div>

                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                   <label className="urgent-toggle">
                     <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} />
                     <AlertCircle size={14} color={urgent ? '#ef4444' : '#64748b'} />
                     <span style={{ color: urgent ? '#ef4444' : '#64748b' }}>Urgent Notice</span>
                   </label>
                   <button type="submit" className="btn-primary" disabled={sending || !newContent.trim()}>
                     {sending ? '...' : <><Send size={14} /> Post</>}
                   </button>
                 </div>
              </form>
            ) : (
              <>
                {filteredNotifs.length === 0 ? (
                  <div className="empty-notifs">
                    <Megaphone size={40} opacity={0.2} />
                    <p>No notifications found</p>
                  </div>
                ) : (
                  <div className="message-list">
                    {filteredNotifs.map(n => {
                      const isMine = n.senderId === currentUser.id;
                      const isUnread = !n.readBy?.includes(currentUser.id);
                      const dt = n.createdAt?.toDate ? n.createdAt.toDate() : new Date();
                      
                      return (
                        <div 
                          key={n.id} 
                          className={`message-item ${n.type === 'emergency' ? 'urgent' : ''} ${isUnread ? 'unread' : ''}`}
                          onClick={() => isUnread && markAsRead(n.id)}
                        >
                          <div className="message-header">
                            <div className="sender-badge">
                              <span className="sender-name">{n.senderName}</span>
                              <span className="sender-title">{n.senderTitle}</span>
                            </div>
                            <span className="message-time">{format(dt, 'HH:mm', { locale: enUS })}</span>
                          </div>
                          
                          <div className="message-bubble">
                            <p>{n.content}</p>
                            {n.pinned && <Pin size={12} className="pin-indicator" />}
                          </div>

                          <div className="message-actions">
                             <div className="scope-tag">{ScopeLabel[n.recipients[0]] || 'Direct'}</div>
                             <div style={{ flex: 1 }} />
                             {currentUser.canSendNotify && (
                               <button onClick={(e) => { e.stopPropagation(); togglePin(n.id, n.pinned); }}>
                                 <Pin size={14} style={{ opacity: n.pinned ? 1 : 0.4 }} />
                               </button>
                             )}
                             {(isMine || currentUser.id === 'CEOFS') && (
                               <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }} style={{ color: '#ef4444' }}>
                                 <Trash2 size={14} />
                               </button>
                             )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer / Send Button */}
          {!composeMode && currentUser.canSendNotify && (
            <div className="notify-footer">
              <button className="btn-primary" style={{ width: '100%', padding: '12px', gap: '10px' }} onClick={() => setComposeMode(true)}>
                <Megaphone size={18} /> Send New Broadcast
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotifyWindow;
