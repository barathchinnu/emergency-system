import React, { useState } from 'react';

const Signup = ({ onSignupSuccess, onSwitchToLogin, selectedRole }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: selectedRole || 'USER'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onSignupSuccess();
            } else {
                const data = await response.json();
                setError(data.error || 'Signup failed');
            }
        } catch (err) {
            setError('Signup failed. Is the backend running?');
        }
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',
            background: 'var(--bg-dark)', color: 'white'
        }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        {selectedRole === 'AMBULANCE' ? '🚑' : selectedRole === 'HOSPITAL' ? '🏥' : '👤'}
                    </div>
                    <h2>Join as {selectedRole ? selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase() : 'User'}</h2>
                </div>
                {error && <div style={{ color: 'var(--primary-red)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Sign Up</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <span style={{ color: 'var(--medical-blue)', cursor: 'pointer' }} onClick={onSwitchToLogin}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
