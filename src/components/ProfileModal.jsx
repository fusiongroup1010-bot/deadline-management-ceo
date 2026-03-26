import React, { useState, useEffect } from 'react';
import { User, X, Check, Edit2, Shield, MapPin, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ isOpen, onClose, initialMode = 'view' }) => {
  const { currentUser, updateProfile } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'view' or 'edit'
  const [tempName, setTempName] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) setTempName(currentUser.name);
    setMode(initialMode);
    setSuccess(false);
  }, [isOpen, currentUser, initialMode]);

  if (!isOpen || !currentUser) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    await updateProfile(tempName);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setMode('view');
    }, 1500);
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 2000 }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '420px', padding: '0', overflow: 'hidden' }}>
        
        {/* Banner with Icon */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-accent), var(--pink-accent))', 
          height: '110px', width: '100%', position: 'relative', 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
           <button 
             onClick={onClose} 
             style={{ position: 'absolute', top: '16px', right: '16px', color: 'white', background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%' }}
           >
             <X size={20} />
           </button>
           
           <div style={{ position: 'absolute', bottom: '-40px', background: 'white', padding: '6px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
             <div style={{ background: 'var(--primary-pastel)', padding: '16px', borderRadius: '18px', color: 'var(--primary-accent)' }}>
               <User size={36} />
             </div>
           </div>
        </div>

        <div style={{ padding: '60px 32px 32px 32px', textAlign: 'center' }}>
          {mode === 'view' ? (
            <>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>{currentUser.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <Shield size={12} />
                {currentUser.role}
              </div>

              <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'var(--bg-main)', borderRadius: '16px' }}>
                   <Hash size={18} color="var(--primary-accent)" />
                   <div>
                     <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>USER ID</p>
                     <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{currentUser.id}</p>
                   </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'var(--bg-main)', borderRadius: '16px' }}>
                   <MapPin size={18} color="var(--primary-accent)" />
                   <div>
                     <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>PERMITTED REGIONS</p>
                     <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                       {currentUser.allowedLocations.join(', ')}
                     </p>
                   </div>
                </div>
              </div>

              <div style={{ marginTop: '32px', display: 'flex', gap: '10px' }}>
                <button onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>Close</button>
                <button onClick={() => setMode('edit')} className="btn-primary" style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Edit2 size={16} /> Edit Name
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Update Name</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>How would you like to be addressed?</p>
              
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label>Display Name</label>
                <input 
                  autoFocus
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  style={{ height: '52px', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginTop: '32px', display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setMode('view')} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', background: success ? '#10b981' : undefined }}>
                  {success ? <Check size={20} /> : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
