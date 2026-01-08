import React from 'react';

const RoleSelection = ({ onRoleSelect }) => {
    const roles = [
        { id: 'USER', label: 'User', icon: '👤', desc: 'Report emergencies' },
        { id: 'AMBULANCE', label: 'Ambulance Driver', icon: '🚑', desc: 'Respond to requests' },
        { id: 'HOSPITAL', label: 'Hospital', icon: '🏥', desc: 'Manage admissions' }
    ];

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100vh', background: 'var(--bg-dark)', color: 'white', padding: '2rem'
        }}>
            <h1 style={{ marginBottom: '3rem', fontSize: '2.5rem' }}>Who are you?</h1>

            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem', width: '100%', maxWidth: '800px'
            }}>
                {roles.map(role => (
                    <div
                        key={role.id}
                        onClick={() => onRoleSelect(role.id)}
                        className="glass-panel"
                        style={{
                            padding: '2rem', textAlign: 'center', cursor: 'pointer',
                            transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{role.icon}</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{role.label}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{role.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoleSelection;
