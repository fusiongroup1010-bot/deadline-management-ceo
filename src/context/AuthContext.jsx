import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const EMPLOYEES = [
  // CEO - Access to All
  { id: 'CEOFS', name: 'CEO', role: 'admin', pass: 'CEOChoFS', allowedLocations: ['hanoi', 'hcm'] },
  
  // Hanoi Authorized Staff
  { id: 'DMHuong', name: 'Huong', role: 'admin', pass: 'DMHFS123', allowedLocations: ['hanoi'] },
  { id: 'Trangxu', name: 'Trang Xu', role: 'admin', pass: 'TrangX345!', allowedLocations: ['hanoi'] },
  { id: 'Trangsam', name: 'Trang Sam', role: 'admin', pass: 'TrangS345@', allowedLocations: ['hanoi'] },
  { id: 'DungAd', name: 'Dung Admin', role: 'admin', pass: 'Dung123!', allowedLocations: ['hanoi'] },
  { id: 'ThuyAC', name: 'Thuy Acc', role: 'admin', pass: 'Thuy123#', allowedLocations: ['hanoi'] },
  { id: 'PhucMKT', name: 'Phuc MKT', role: 'admin', pass: 'Phuc345@', allowedLocations: ['hanoi'] },
  { id: 'MenPUR', name: 'Men PUR', role: 'admin', pass: 'Men345!', allowedLocations: ['hanoi'] },
  { id: 'LinhVuHR', name: 'Linh Vu HR', role: 'admin', pass: 'Thathu123!', allowedLocations: ['hanoi'] },
  { id: 'LienLOG', name: 'Lien LOG', role: 'admin', pass: 'Lien123$', allowedLocations: ['hanoi'] },
  { id: 'PAnh', name: 'P Anh', role: 'admin', pass: 'PAnh456', allowedLocations: ['hanoi'] },
  { id: 'JiHK', name: 'Ji HK', role: 'admin', pass: 'JHKFS123', allowedLocations: ['hanoi'] },
  
  // HCM Authorized Staff
  { id: 'HCMLOG', name: 'HCM LOG', role: 'admin', pass: 'HCM456', allowedLocations: ['hcm'] },
  { id: 'HCMMKT', name: 'HCM MKT', role: 'admin', pass: 'HCM6211#', allowedLocations: ['hcm'] },
  { id: 'HCMHR', name: 'HCM HR', role: 'admin', pass: 'HCMHR111!', allowedLocations: ['hcm'] },
  { id: 'HCMTra', name: 'HCM Tra', role: 'admin', pass: 'Tra112!', allowedLocations: ['hcm'] },
  
  // Guest Modes
  { id: 'Guest_HN', name: 'Guest (Hanoi)', role: 'guest', allowedLocations: ['hanoi'] },
  { id: 'Guest_HCM', name: 'Guest (HCM)', role: 'guest', allowedLocations: ['hcm'] },
  { id: 'Guest', name: 'Guest Mode (Global View)', role: 'guest', allowedLocations: ['hanoi', 'hcm'] }
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
    return new Promise((resolve, reject) => {
      if (userId.toLowerCase() === 'guest') {
        const guest = EMPLOYEES.find(e => e.id === 'Guest');
        setCurrentUser(guest);
        localStorage.setItem('mockUser', JSON.stringify(guest));
        resolve(guest);
        return;
      }
      
      const user = EMPLOYEES.find(e => e.id.toLowerCase() === userId.toLowerCase());
      if (user && user.pass === password) {
        setCurrentUser(user);
        localStorage.setItem('mockUser', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Incorrect ID or password!'));
      }
    });
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
