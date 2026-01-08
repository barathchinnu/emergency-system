import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../apiConfig';

const HospitalDashboard = ({ user }) => {
    const [requests, setRequests] = useState([]);
    const [hospitalInfo, setHospitalInfo] = useState(null);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/hospitals`);
                if (response.ok) {
                    const data = await response.json();
                    // Assuming for demo the first hospital matches the logged in user or we just pick one
                    // In a real app, we'd link user to hospitalId
                    setHospitalInfo(data[0] || { id: 1, name: "City General Hospital" });
                }
            } catch (err) {
                console.error("Failed to fetch hospitals");
            }
        };
        fetchHospitals();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/emergencies`);
            if (response.ok) {
                const data = await response.json();
                // Filter requests that are for this hospital or unassigned
                setRequests(data.filter(req => req.status !== 'COMPLETED'));
            }
        } catch (err) {
            console.error("Failed to fetch emergencies");
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (requestId) => {
        if (!hospitalInfo) return;

        const doctorName = user.username;
        try {
            const response = await fetch(`${API_BASE_URL}/api/hospitals/accept/${requestId}?hospitalId=${hospitalInfo.id}&doctorName=${doctorName}`, {
                method: 'PUT'
            });

            if (response.ok) {
                alert("Request Accepted by Doctor " + doctorName);
                fetchRequests();
            }
        } catch (err) {
            console.error("Error accepting request:", err);
        }
    };

    return (
        <div style={{ padding: '2rem', background: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
            <div className="container">
                <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>🏥 Hospital Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Logged in as: <span style={{ color: 'var(--medical-blue)' }}>{user.username}</span> |
                        Hospital: <span style={{ color: 'var(--medical-blue)' }}>{hospitalInfo?.name}</span>
                    </p>
                </header>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🔔 Incoming Emergency Requests
                        </h2>
                        {requests.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No active requests.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {requests.map(req => (
                                    <div key={req.id} style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderLeft: req.hospitalStatus === 'ACCEPTED' ? '4px solid var(--positive-green)' : '4px solid var(--primary-red)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{req.natureOfEmergency}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: #{req.id}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            Patient: {req.userId} | Location: {req.latitude.toFixed(4)}, {req.longitude.toFixed(4)}
                                        </p>

                                        {req.hospitalStatus === 'ACCEPTED' ? (
                                            <div style={{ color: 'var(--positive-green)', fontWeight: 'bold' }}>
                                                ✅ Accepted by Dr. {req.doctorName}
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                style={{ width: '100%', background: 'var(--medical-blue)' }}
                                                onClick={() => handleAccept(req.id)}
                                            >
                                                Accept Patient
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>🏥 Hospital Status</h2>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="stat-card">
                                <label style={{ color: 'var(--text-secondary)' }}>Emergency Beds Available</label>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--positive-green)' }}>12</div>
                            </div>
                            <div className="stat-card">
                                <label style={{ color: 'var(--text-secondary)' }}>On-Duty Doctors</label>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--medical-blue)' }}>8</div>
                            </div>
                            <div className="stat-card">
                                <label style={{ color: 'var(--text-secondary)' }}>Active Admissions</label>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>4</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
