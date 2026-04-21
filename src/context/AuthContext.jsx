import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const EMPLOYEES = [
  // CEO - Access & Edit All
  { id: 'CEOFS', name: 'CEO', role: 'admin', pass: 'CEOChoFS', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi', 'hcm', 'hungyen'], canSendNotify: true, notifyScope: 'all', title: 'CEO', allowedCategoryIds: 'all' },
  
  // Hanoi Authorized Staff
  { id: 'DMHuong', name: 'Huong', role: 'admin', pass: 'DMHFS123', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: true, notifyScope: 'restricted', title: 'Branch Manager', allowedCategoryIds: 'all' },
  { id: 'Trangxu', name: 'Trang Xu', role: 'admin', pass: 'TrangX345!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: false, title: 'Staff', allowedCategoryIds: ['hn-soff'] },
  { id: 'Trangsam', name: 'Trang Sam', role: 'admin', pass: 'TrangS345@', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: false, title: 'Staff', allowedCategoryIds: ['hn-sonl'] },
  { id: 'DungAd', name: 'Dung Admin', role: 'admin', pass: 'Dung123!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: false, title: 'Sale Operation', allowedCategoryIds: ['hn-sadmin'] },
  { id: 'ThuyAC', name: 'Thuy Acc', role: 'admin', pass: 'Thuy123#', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: false, title: 'Accountant', allowedCategoryIds: ['hn-acc'] },
  { id: 'PhucMKT', name: 'Phuc MKT', role: 'admin', pass: 'Phuc345@', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: false, title: 'MKT', allowedCategoryIds: ['hn-mkt'] },
  { id: 'MenPUR', name: 'Men PUR', role: 'admin', pass: 'Men345!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: false, title: 'Purchasing', allowedCategoryIds: ['hn-pur'] },
  { id: 'LinhVuHR', name: 'Linh Vu HR', role: 'admin', pass: 'Thathu123!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: false, title: 'HR', allowedCategoryIds: ['hn-hr'] },
  { id: 'LienLOG', name: 'Lien LOG', role: 'admin', pass: 'Lien123$', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: false, title: 'Logistics', allowedCategoryIds: ['hn-log'] },
  { id: 'PAnh', name: 'P Anh', role: 'admin', pass: 'PAnh456', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hanoi'], canSendNotify: false, title: 'Staff', allowedCategoryIds: ['hn-sonl'] },
  
  // HCM Authorized Staff
  { id: 'JiHK', name: 'Ji HK', role: 'admin', pass: 'JHKFS123', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'], canSendNotify: true, notifyScope: 'restricted', title: 'Branch Manager', allowedCategoryIds: 'all' },
  { id: 'HCMLOG', name: 'HCM LOG', role: 'admin', pass: 'HCM456', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'], canSendNotify: false, title: 'Logistics', allowedCategoryIds: ['hcm-log'] },
  { id: 'HCMMKT', name: 'HCM MKT', role: 'admin', pass: 'HCM6211#', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'], canSendNotify: false, title: 'MKT', allowedCategoryIds: ['hcm-mkt'] },
  { id: 'HCMHR', name: 'HCM HR', role: 'admin', pass: 'HCMHR111!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'], canSendNotify: false, title: 'HR', allowedCategoryIds: ['hcm-hr'] },
  { id: 'HCMTra', name: 'HCM Tra', role: 'admin', pass: 'Tra112!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'], canSendNotify: false, title: 'Staff', allowedCategoryIds: ['hcm-sonl'] },
  { id: 'HCMSales', name: 'HCM Sales', role: 'admin', pass: 'HCMS222@', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hcm'], canSendNotify: false, title: 'Sale Offline', allowedCategoryIds: ['hcm-soff'] },
  
  // Hung Yen Authorized Staff
  { id: 'MunFD', name: 'Mun FD', role: 'admin', pass: 'MunFS123', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: true, notifyScope: 'restricted', title: 'Factory Director', allowedCategoryIds: 'all' },
  { id: 'NamRD', name: 'Nam RD', role: 'admin', pass: 'NamFS345', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: true, notifyScope: 'restricted', title: 'R&D Head', allowedCategoryIds: 'all' },
  { id: 'LeeCPO', name: 'Lee CPO', role: 'admin', pass: 'LeeFS345', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: true, notifyScope: 'restricted', title: 'CPO', allowedCategoryIds: 'all' },
  { id: 'LinhHR', name: 'Linh HR', role: 'admin', pass: 'Linh123!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: false, title: 'HR', allowedCategoryIds: ['hy-hr'] },
  { id: 'HueAC', name: 'Hue AC', role: 'admin', pass: 'Hue123#', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: false, title: 'Accountant', allowedCategoryIds: ['hy-ac'] },
  { id: 'NiQC', name: 'Ni QC', role: 'admin', pass: 'Ni123', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: false, title: 'QC', allowedCategoryIds: ['hy-qc'] },
  { id: 'LinhDs', name: 'Linh Ds', role: 'admin', pass: 'LinhD345!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: false, title: 'Design', allowedCategoryIds: ['hy-ds'] },
  { id: 'Evolution', name: 'Evolution', role: 'admin', pass: 'EV123!', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: false, title: 'Evolution', allowedCategoryIds: ['hy-evo'] },
  { id: 'HongPM', name: 'Hong PM', role: 'admin', pass: 'Hong345@', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: false, title: 'Purchasing Material', allowedCategoryIds: ['hy-pm'] },
  { id: 'LanPP', name: 'Lan PP', role: 'admin', pass: 'Lan123$', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: false, title: 'Purchasing Production', allowedCategoryIds: ['hy-pp'] },
  { id: 'LienLOGHY', name: 'Lien LOG HY', role: 'admin', pass: 'Lien789@', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: ['hungyen'], canSendNotify: false, title: 'Logistics', allowedCategoryIds: ['hy-log'] },
  
  // Guest Mode
  { id: 'Guest', name: 'Guest Mode', role: 'guest', allowedLocations: ['hanoi', 'hcm', 'hungyen'], editableLocations: [], canSendNotify: false, title: 'Guest', allowedCategoryIds: 'all' }
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
    
    if (user) {
      const savedPass = localStorage.getItem(`pass_${user.id}`);
      const validPass = savedPass || user.pass;
      
      if (user.role === 'guest' || validPass === password) {
      const savedName = localStorage.getItem(`name_${user.id}`);
      const savedDept = localStorage.getItem(`dept_${user.id}`);
      const savedAddr = localStorage.getItem(`addr_${user.id}`);
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
      
      const sessionUser = { 
        ...user, 
        name: savedName || user.name,
        department: savedDept || user.title,
        address: savedAddr || user.allowedLocations[0],
        avatar: savedAvatar || null
      };
      
      setCurrentUser(sessionUser);
      localStorage.setItem('mockUser', JSON.stringify(sessionUser));
      return Promise.resolve(sessionUser);
      }
    }
    return Promise.reject(new Error('Incorrect ID or password!'));
  }

  function updateProfile(profileData) {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profileData };
    setCurrentUser(updated);
    localStorage.setItem('mockUser', JSON.stringify(updated));
    
    // Save specific fields for long-term persistence linked to user ID
    if (profileData.name) localStorage.setItem(`name_${currentUser.id}`, profileData.name);
    if (profileData.department) localStorage.setItem(`dept_${currentUser.id}`, profileData.department);
    if (profileData.address) localStorage.setItem(`addr_${currentUser.id}`, profileData.address);
    if (profileData.avatar) localStorage.setItem(`avatar_${currentUser.id}`, profileData.avatar);
    
    return Promise.resolve(updated);
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('mockUser');
    return Promise.resolve();
  }

  function changePassword(oldPassword, newPassword) {
    if (!currentUser) return Promise.reject(new Error('Not logged in'));
    
    // Check old password
    const savedPass = localStorage.getItem(`pass_${currentUser.id}`);
    const currentValidPass = savedPass || currentUser.pass;
    
    if (oldPassword !== currentValidPass && currentUser.role !== 'guest') {
       return Promise.reject(new Error('Incorrect current password'));
    }
    
    // Save new password
    localStorage.setItem(`pass_${currentUser.id}`, newPassword);
    
    // Also save in user object if memory state needs it, but we use localStorage directly for checks
    const updated = { ...currentUser, pass: newPassword };
    setCurrentUser(updated);
    localStorage.setItem('mockUser', JSON.stringify(updated));
    
    return Promise.resolve();
  }

  const value = {
    currentUser,
    login,
    logout,
    updateProfile,
    changePassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
