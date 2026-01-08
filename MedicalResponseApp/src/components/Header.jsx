import React from 'react';

const Header = () => {
    return (
        <header className="glass-panel" style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--primary-red)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white'
                }}>+</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                    ResQ<span style={{ color: 'var(--primary-red)' }}>Now</span>
                </h2>
            </div>

            <nav style={{ display: 'flex', gap: '2rem' }}>
                <a href="#dashboard" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Dashboard</a>
                <a href="#map" style={{ color: 'var(--text-secondary)' }}>Live Map</a>
                <a href="#contacts" style={{ color: 'var(--text-secondary)' }}>Contacts</a>
            </nav>

            <button className="btn-primary" style={{
                background: 'rgba(230, 57, 70, 0.2)',
                color: 'var(--primary-red)',
                border: '1px solid var(--primary-red)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <span style={{ fontSize: '1.2rem' }}>📞</span> Emergency Call
            </button>
        </header>
    );
};

export default Header;
