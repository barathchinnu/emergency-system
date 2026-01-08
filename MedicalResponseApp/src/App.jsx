import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Dashboard from './components/Dashboard';
import MapOverlay from './components/MapOverlay';
import ContactList from './components/ContactList';
import EmergencyForm from './components/EmergencyForm';
import Login from './components/Login';
import Signup from './components/Signup';
import RoleSelection from './components/RoleSelection';
import AmbulanceDashboard from './components/AmbulanceDashboard';
import HospitalDashboard from './components/HospitalDashboard';
import API_BASE_URL from './apiConfig';

function App() {
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);

  // Poll for active request status
  React.useEffect(() => {
    if (!user || user.role === 'AMBULANCE') return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/emergencies`);
        if (response.ok) {
          const data = await response.json();
          const myRequests = data.filter(req => req.userId === user.username);
          if (myRequests.length > 0) {
            const latest = myRequests[myRequests.length - 1];
            if (latest.status !== 'COMPLETED') {
              setActiveRequest(latest);
            } else {
              setActiveRequest(null);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch status");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [user]);

  if (!selectedRole && !user) {
    return <RoleSelection onRoleSelect={(role) => {
      setSelectedRole(role);
      setAuthView('signup'); // Go straight to signup after picking role usually
    }} />;
  }

  if (!user) {
    if (authView === 'login') {
      return <Login
        onLogin={setUser}
        onSwitchToSignup={() => setAuthView('signup')}
        selectedRole={selectedRole}
      />;
    } else {
      return <Signup
        onSignupSuccess={() => setAuthView('login')}
        onSwitchToLogin={() => setAuthView('login')}
        selectedRole={selectedRole}
      />;
    }
  }

  // Role-based Dashboard Rendering
  if (user.role === 'AMBULANCE') {
    return <AmbulanceDashboard user={user} />;
  }

  if (user.role === 'HOSPITAL') {
    return <HospitalDashboard user={user} />;
  }

  return (
    <div className="app-container">
      <Header />

      <main>
        <HeroSection onRequestHelp={() => setEmergencyModalOpen(true)} />

        <div className="container">
          <Dashboard user={user} activeRequest={activeRequest} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            <div style={{ minWidth: 0 }}> {/* Prevent grid overflow */}
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Live Map Tracking</h3>
              <MapOverlay onLocationFound={setUserLocation} activeRequest={activeRequest} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Key Contacts</h3>
              <ContactList />
            </div>
          </div>
        </div>
      </main>

      <EmergencyForm
        isOpen={isEmergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        userLocation={userLocation}
        user={user}
      />

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-secondary)',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <p>© 2026 ResQNow Medical Response System. Critical infrastructure.</p>
      </footer>
    </div>
  );
}

export default App;
