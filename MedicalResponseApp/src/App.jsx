import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Dashboard from './components/Dashboard';
import MapOverlay from './components/MapOverlay';
import ContactList from './components/ContactList';
import EmergencyForm from './components/EmergencyForm';

function App() {
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState(false);

  return (
    <div className="app-container">
      <Header />

      <main>
        <HeroSection onRequestHelp={() => setEmergencyModalOpen(true)} />

        <div className="container">
          <Dashboard />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            <div style={{ minWidth: 0 }}> {/* Prevent grid overflow */}
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Live Map Tracking</h3>
              <MapOverlay />
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
