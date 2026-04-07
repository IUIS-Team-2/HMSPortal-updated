import React, { useState, createContext, useContext } from 'react';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminPanel from './components/AdminPanel';
import LoginPage from './pages/LoginPage';
import { HMSProvider } from './data/HMSContext';
import './App.css';

// ─── Global Auth Context ──────────────────────────────────────────────────────
export const AuthContext = createContext(null);
export function useAuth() { return useContext(AuthContext); }

// ─── Demo user credentials ────────────────────────────────────────────────────
const USERS = [
  { id:1, username:'superadmin',    password:'admin123',  role:'superadmin', name:'Super Admin',        branch:'all'   },
  { id:2, username:'admin.laxmi',   password:'laxmi123',  role:'admin',      name:'Admin Laxmi Nagar',  branch:'laxmi' },
  { id:3, username:'admin.raya',    password:'raya123',   role:'admin',      name:'Admin Raya',         branch:'raya'  },
  { id:4, username:'billing.laxmi', password:'bill123',   role:'employee',   dept:'Billing',  name:'Billing Staff',   branch:'laxmi' },
  { id:5, username:'pharma.raya',   password:'pharma123', role:'employee',   dept:'Pharmacy', name:'Pharmacy Staff',  branch:'raya'  },
];

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) { setUser(found); return { success: true }; }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => setUser(null);

  const renderDashboard = () => {
    if (!user) return <LoginPage />;
    if (user.role === 'superadmin') return <SuperAdminDashboard />;
    return <AdminPanel />;
  };

  return (
    // HMSProvider wraps everything — SuperAdminDashboard AND AdminPanel
    // both read/write the same db via useHMS()
    <HMSProvider>
      <AuthContext.Provider value={{ user, login, logout }}>
        {renderDashboard()}
      </AuthContext.Provider>
    </HMSProvider>
  );
}

export default App;
