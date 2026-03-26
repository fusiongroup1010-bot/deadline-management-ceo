import React, { createContext, useState, useContext, useEffect } from 'react';

/* ── Location-based Departments ── */
export const DEPARTMENTS = {
  hanoi: [
    { id: 'hn-bm', name: 'Branch Manager', color: '#dbeafe', text: '#1e40af', accent: '#3b82f6' },
    { id: 'hn-soff', name: 'Sale Offline', color: '#ffedd5', text: '#9a3412', accent: '#f97316' },
    { id: 'hn-sadmin', name: 'Sale Admin', color: '#fef9c3', text: '#854d0e', accent: '#eab308' },
    { id: 'hn-acc', name: 'Accountant', color: '#dcfce7', text: '#166534', accent: '#22c55e' },
    { id: 'hn-sonl', name: 'Sale Online', color: '#fce7f3', text: '#9d174d', accent: '#ec4899' },
    { id: 'hn-mkt', name: 'MKT', color: '#e0f2fe', text: '#075985', accent: '#0ea5e9' },
    { id: 'hn-pur', name: 'Purchasing', color: '#ede9fe', text: '#5b21b6', accent: '#8b5cf6' },
    { id: 'hn-hr', name: 'HR', color: '#fae8ff', text: '#86198f', accent: '#d946ef' },
    { id: 'hn-log', name: 'Logistics', color: '#f1f5f9', text: '#334155', accent: '#64748b' },
  ],
  hcm: [
    { id: 'hcm-bm', name: 'Branch Manager', color: '#dbeafe', text: '#1e40af', accent: '#3b82f6' },
    { id: 'hcm-log', name: 'Logistics', color: '#f1f5f9', text: '#334155', accent: '#64748b' },
    { id: 'hcm-sonl', name: 'Sale Online', color: '#fce7f3', text: '#9d174d', accent: '#ec4899' },
    { id: 'hcm-hr', name: 'HR', color: '#fae8ff', text: '#86198f', accent: '#d946ef' },
  ],
  hungyen: [
    { id: 'hy-fd', name: 'Factory Director', color: '#dbeafe', text: '#1e40af', accent: '#3b82f6' },
    { id: 'hy-rd', name: 'R&D', color: '#ede9fe', text: '#5b21b6', accent: '#8b5cf6' },
    { id: 'hy-cpo', name: 'CPO', color: '#e0f2fe', text: '#075985', accent: '#0ea5e9' },
    { id: 'hy-hr', name: 'HR', color: '#fae8ff', text: '#86198f', accent: '#d946ef' },
    { id: 'hy-ac', name: 'Accountant', color: '#fef3c7', text: '#92400e', accent: '#d97706' },
    { id: 'hy-qc', name: 'QC', color: '#f1f5f9', text: '#334155', accent: '#64748b' },
    { id: 'hy-ds', name: 'Designer', color: '#fce7f3', text: '#9d174d', accent: '#ec4899' },
    { id: 'hy-evo', name: 'Evolution', color: '#ecfdf5', text: '#065f46', accent: '#10b981' },
  ]
};

// Flat map for lookup
export const CATEGORY_MAP = Object.fromEntries(
  Object.values(DEPARTMENTS).flat().map(d => [d.id, d])
);

const initialItems = []; // Start fresh for CEO branch

import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [items, setItems] = useState([]); // Real-time sync
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const { currentUser } = useAuth();
  const [activeLocation, setActiveLocation] = useState('hanoi');

  // Auto-set location based on user permissions on login
  useEffect(() => {
    if (currentUser && currentUser.allowedLocations) {
      // If current activeLocation isn't allowed for this user, switch to the first allowed one
      if (!currentUser.allowedLocations.includes(activeLocation)) {
        setActiveLocation(currentUser.allowedLocations[0]);
      }
    }
  }, [currentUser]);

  // Sync with Firestore
  useEffect(() => {
    const q = query(collection(db, 'deadline_items_ceo'), orderBy('dueDate', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
      setItems(data);
    });
    return () => unsubscribe();
  }, []);

  /* ── CRUD (Firestore) ── */
  const addEvent = async (item) => {
    const newId = `item-${Date.now()}`;
    await setDoc(doc(db, 'deadline_items_ceo', newId), { ...item, id: newId });
    setIsModalOpen(false);
  };

  const updateEvent = async (updated) => {
    await setDoc(doc(db, 'deadline_items_ceo', updated.id), updated, { merge: true });
    setIsModalOpen(false);
    setCurrentEvent(null);
  };

  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, 'deadline_items_ceo', id));
    setIsModalOpen(false);
    setCurrentEvent(null);
  };

  const changeStatus = async (id, status) => {
    await setDoc(doc(db, 'deadline_items_ceo', id), { 
      status,
      updatedBy: currentUser ? currentUser.name : 'Unknown',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  /* ── Modal triggers ── */
  const openAddModal = () => { setCurrentEvent(null); setIsModalOpen(true); };
  const openEditModal = (item) => { setCurrentEvent(item); setIsModalOpen(true); };

  /* ── Derived: "events" for Calendar (items with dueTime, shown on calendar grid) ── */
  const events = items; // CalendarView will filter/compute day dynamically

  /* ── Notifications ── */
  const [notifiedIds, setNotifiedIds] = useState(new Set());

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkNotifications = () => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      items.forEach(item => {
        if (item.status === 'done' || !item.dueDate || !item.dueTime || item.dueDate !== todayStr) return;
        if (notifiedIds.has(item.id)) return;

        const [h, m] = item.dueTime.split(':').map(Number);
        const dueTime = new Date();
        dueTime.setHours(h, m, 0, 0);

        const diffMinutes = (dueTime.getTime() - now.getTime()) / 60000;

        // Notify if it's within 15 minutes
        if (diffMinutes > 0 && diffMinutes <= 15) {
          const typeLabel = item.type === 'meeting' ? '📅 Meeting' : item.type === 'report' ? '📊 Report' : '✅ Task';
          new Notification(`${typeLabel} soon: ${item.title}`, {
            body: `Starting at ${item.dueTime} (in ${Math.round(diffMinutes)} mins)`,
            icon: '/fusion-logo.png' // Fallback to provided logo if available
          });
          setNotifiedIds(prev => new Set([...prev, item.id]));
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); 
    checkNotifications(); // check immediately
    return () => clearInterval(interval);
  }, [items, notifiedIds]);

  return (
    <EventContext.Provider value={{
      items,           // raw unified list
      activeLocation,
      setActiveLocation,
      filteredItems: items.filter(i => i.location === activeLocation),
      events: items.filter(i => i.location === activeLocation), // For Calendar
      isEditable: currentUser?.editableLocations?.includes(activeLocation), 
      addEvent, updateEvent, deleteEvent, changeStatus,
      isModalOpen, setIsModalOpen,
      currentEvent,
      openAddModal, openEditModal,
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
