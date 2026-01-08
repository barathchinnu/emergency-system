import React, { useState } from 'react';

const EmergencyForm = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState('idle'); // idle, submitting, success
    const [natureOfEmergency, setNatureOfEmergency] = useState('Accident');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Emergency Request:", { natureOfEmergency });
        setStatus('submitting');
        // Simulate network request
        setTimeout(() => {
            setStatus('success');
        }, 2000);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '500px',
                padding: '2rem',
                border: '1px solid var(--primary-red)',
                boxShadow: '0 25px 50px -12px rgba(230, 57, 70, 0.25)'
            }}>
                {status === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h2 style={{ color: 'var(--success-green)', marginBottom: '1rem' }}>Help is on the way!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Ambulance Unit A-12 has been dispatched to your location.<br />
                            Estimated arrival: 8 minutes.
                        </p>
                        <button
                            onClick={onClose}
                            className="btn-primary"
                            style={{ background: 'var(--medical-blue)', width: '100%' }}
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-red)' }}>Emergency Request</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '1.5rem' }}
                            >
                                ✕
                            </button>
                        </div>



                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nature of Emergency</label>
                            <select
                                value={natureOfEmergency}
                                onChange={(e) => setNatureOfEmergency(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(30, 41, 59, 0.6)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="Accident">Road Accident</option>
                                <option value="Cardiac">Cardiac / Medical</option>
                                <option value="Fire">Fire / Burn</option>
                                <option value="Pregnancy">Pregnancy / Labor</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Current Location</label>
                            <div style={{
                                padding: '0.75rem',
                                background: 'rgba(30, 41, 59, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>📍</span>
                                <span>Detected: 123 Main St, Tech District (Accuracy: 5m)</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting' ? 'Dispatching...' : 'CONFIRM REQUEST'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EmergencyForm;
