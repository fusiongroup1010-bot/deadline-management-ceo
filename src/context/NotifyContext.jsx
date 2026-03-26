import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, where, arrayUnion } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const NotifyContext = createContext();

export const useNotify = () => useContext(NotifyContext);

export const NotifyProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    // Query for notifications where current user is a recipient or it's public
    const q = query(
      collection(db, 'notifications_ceo'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter client-side for simplicity in this demo, or use complex Firestore queries
      // Recipients can be: 'all', location (hanoi, hcm, hungyen), or specific user ID
      const myNotifs = allNotifs.filter(n => {
        if (n.recipients.includes('all')) return true;
        if (n.recipients.includes(currentUser.id)) return true;
        // Check if user is in a location that is a recipient
        const userLocs = currentUser.allowedLocations || [];
        return n.recipients.some(r => userLocs.includes(r));
      });

      setNotifications(myNotifs);
      setUnreadCount(myNotifs.filter(n => !n.readBy?.includes(currentUser.id)).length);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const sendNotification = async (notifData) => {
    if (!currentUser || !currentUser.canSendNotify) return;

    const payload = {
      ...notifData,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderTitle: currentUser.title,
      createdAt: serverTimestamp(),
      readBy: [currentUser.id], // Sender has read it
      pinned: false
    };

    await addDoc(collection(db, 'notifications_ceo'), payload);
  };

  const markAsRead = async (id) => {
    if (!currentUser) return;
    const ref = doc(db, 'notifications_ceo', id);
    await updateDoc(ref, {
      readBy: arrayUnion(currentUser.id)
    });
  };

  const togglePin = async (id, currentVal) => {
    const ref = doc(db, 'notifications_ceo', id);
    await updateDoc(ref, { pinned: !currentVal });
  };

  const deleteNotification = async (id) => {
    await deleteDoc(doc(db, 'notifications_ceo', id));
  };

  const value = {
    notifications,
    unreadCount,
    sendNotification,
    markAsRead,
    togglePin,
    deleteNotification,
    loading
  };

  return <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>;
};
