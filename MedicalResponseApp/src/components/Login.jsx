import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToSignup, selectedRole }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const roleIcons = {
        'USER': '👤',
        'AMBULANCE': '🚑',
        'HOSPITAL': '🏥'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const user = await response.json();
                onLogin(user);
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Is the backend running?');
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
                        {selectedRole ? roleIcons[selectedRole] : '👤'}
                    </div>
                    <h2>Login as {selectedRole ? selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase() : 'User'}</h2>
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
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Login</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <span style={{ color: 'var(--medical-blue)', cursor: 'pointer' }} onClick={onSwitchToSignup}>Sign Up</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
