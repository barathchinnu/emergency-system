import React from 'react';

const ContactItem = ({ name, relation, phone }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: 'rgba(30, 41, 59, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        marginBottom: '0.75rem'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--medical-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
            }}>👤</div>
            <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{name}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{relation}</p>
            </div>
        </div>
        <button style={{
            background: 'var(--success-green)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600
        }}>
            Call
        </button>
    </div>
);

const ContactList = () => {
    return (
        <div id="contacts" className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Emergency Contacts</h3>
                <button style={{ color: 'var(--accent-blue)', background: 'transparent', fontSize: '0.875rem', fontWeight: 600 }}>
                    + Add New
                </button>
            </div>

            <ContactItem name="Dr. Sarah Jenkins" relation="Primary Physician" phone="+1234567890" />
            <ContactItem name="John Doe" relation="Spouse" phone="+1987654321" />
            <ContactItem name="City General ER" relation="Hospital" phone="911" />
        </div>
    );
};

export default ContactList;
