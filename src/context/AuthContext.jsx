import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const EMPLOYEES = [
  // CEO - Access & Edit All
  { id: 'CEOFS', name: 'CEO', role: 'admin', pass: 'CEOChoFS', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi', 'hcm'] },
  
  // Hanoi Authorized Staff - View All, Edit Hanoi
  { id: 'DMHuong', name: 'Huong', role: 'admin', pass: 'DMHFS123', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'Trangxu', name: 'Trang Xu', role: 'admin', pass: 'TrangX345!', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'Trangsam', name: 'Trang Sam', role: 'admin', pass: 'TrangS345@', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'DungAd', name: 'Dung Admin', role: 'admin', pass: 'Dung123!', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'ThuyAC', name: 'Thuy Acc', role: 'admin', pass: 'Thuy123#', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'PhucMKT', name: 'Phuc MKT', role: 'admin', pass: 'Phuc345@', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'MenPUR', name: 'Men PUR', role: 'admin', pass: 'Men345!', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'LinhVuHR', name: 'Linh Vu HR', role: 'admin', pass: 'Thathu123!', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'LienLOG', name: 'Lien LOG', role: 'admin', pass: 'Lien123$', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'PAnh', name: 'P Anh', role: 'admin', pass: 'PAnh456', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  { id: 'JiHK', name: 'Ji HK', role: 'admin', pass: 'JHKFS123', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hanoi'] },
  
  // HCM Authorized Staff - View All, Edit HCM
  { id: 'HCMLOG', name: 'HCM LOG', role: 'admin', pass: 'HCM456', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hcm'] },
  { id: 'HCMMKT', name: 'HCM MKT', role: 'admin', pass: 'HCM6211#', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hcm'] },
  { id: 'HCMHR', name: 'HCM HR', role: 'admin', pass: 'HCMHR111!', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hcm'] },
  { id: 'HCMTra', name: 'HCM Tra', role: 'admin', pass: 'Tra112!', allowedLocations: ['hanoi', 'hcm'], editableLocations: ['hcm'] },
  
  // Guest Mode
  { id: 'Guest', name: 'Guest Mode (Global View)', role: 'guest', allowedLocations: ['hanoi', 'hcm'], editableLocations: [] }
];

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function login(userId, password = '') {
    const targetUserId = userId === 'Guest' ? 'Guest' : userId;
    const user = EMPLOYEES.find(e => e.id.toLowerCase() === targetUserId.toLowerCase());
    
    if (user && (user.role === 'guest' || user.pass === password)) {
      const storedName = localStorage.getItem(`name_${user.id}`);
      const sessionUser = { ...user, name: storedName || user.name };
      setCurrentUser(sessionUser);
      localStorage.setItem('mockUser', JSON.stringify(sessionUser));
      return Promise.resolve(sessionUser);
    }
    return Promise.reject(new Error('Incorrect ID or password!'));
  }

  function updateProfile(newName) {
    if (!currentUser) return;
    const updated = { ...currentUser, name: newName };
    setCurrentUser(updated);
    localStorage.setItem('mockUser', JSON.stringify(updated));
    localStorage.setItem(`name_${currentUser.id}`, newName);
    return Promise.resolve(updated);
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('mockUser');
    return Promise.resolve();
  }

  const value = {
    currentUser,
    login,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
