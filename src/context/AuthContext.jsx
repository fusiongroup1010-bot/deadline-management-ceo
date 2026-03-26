import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const EMPLOYEES = [
  // CEO - Access & Edit All
  { id: 'CEOFS', name: 'CEO', role: 'admin', pass: 'CEOChoFS', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi', 'hcm', 'hungyen'] },
  
  // Hanoi Authorized Staff - View All, Edit Hanoi
  { id: 'DMHuong', name: 'Huong', role: 'admin', pass: 'DMHFS123', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'Trangxu', name: 'Trang Xu', role: 'admin', pass: 'TrangX345!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'Trangsam', name: 'Trang Sam', role: 'admin', pass: 'TrangS345@', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'DungAd', name: 'Dung Admin', role: 'admin', pass: 'Dung123!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'ThuyAC', name: 'Thuy Acc', role: 'admin', pass: 'Thuy123#', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'PhucMKT', name: 'Phuc MKT', role: 'admin', pass: 'Phuc345@', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'MenPUR', name: 'Men PUR', role: 'admin', pass: 'Men345!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'LinhVuHR', name: 'Linh Vu HR', role: 'admin', pass: 'Thathu123!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'LienLOG', name: 'Lien LOG', role: 'admin', pass: 'Lien123$', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'PAnh', name: 'P Anh', role: 'admin', pass: 'PAnh456', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  { id: 'JiHK', name: 'Ji HK', role: 'admin', pass: 'JHKFS123', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'] },
  
  // HCM Authorized Staff - View All, Edit HCM
  { id: 'HCMLOG', name: 'HCM LOG', role: 'admin', pass: 'HCM456', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'] },
  { id: 'HCMMKT', name: 'HCM MKT', role: 'admin', pass: 'HCM6211#', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'] },
  { id: 'HCMHR', name: 'HCM HR', role: 'admin', pass: 'HCMHR111!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'] },
  { id: 'HCMTra', name: 'HCM Tra', role: 'admin', pass: 'Tra112!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'] },
  
  // Hung Yen Authorized Staff - View All, Edit Hung Yen
  { id: 'MunFD', name: 'Mun FD', role: 'admin', pass: 'MunFS123', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'] },
  { id: 'NamRD', name: 'Nam RD', role: 'admin', pass: 'NamFS345', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'] },
  { id: 'LeeCPO', name: 'Lee CPO', role: 'admin', pass: 'LeeFS345', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'] },
  { id: 'LinhHR', name: 'Linh HR', role: 'admin', pass: 'Linh123!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'] },
  { id: 'HueAC', name: 'Hue AC', role: 'admin', pass: 'Hue123#', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'] },
  { id: 'NiQC', name: 'Ni QC', role: 'admin', pass: 'Ni345@', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'] },
  { id: 'LinhDs', name: 'Linh Ds', role: 'admin', pass: 'LinhD345!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'] },
  { id: 'Evolution', name: 'Evolution', role: 'admin', pass: 'EV123!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'] },
  
  // Guest Mode
  { id: 'Guest', name: 'Guest Mode (Global View)', role: 'guest', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: [] }
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
