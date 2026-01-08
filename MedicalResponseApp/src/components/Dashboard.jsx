import React from 'react';

const StatusCard = ({ title, value, unit, color, icon }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
            background: `rgba(${color}, 0.2)`,
            color: `rgb(${color})`,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{title}</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {value} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{unit}</span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div id="dashboard" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Live Situation Overview</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Real-time data from local emergency services.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ width: '8px', height: '8px', background: 'var(--success-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--success-green)' }}></span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--success-green)' }}>System Operational</span>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatusCard
                    title="Active Ambulances"
                    value="12"
                    unit="nearby"
                    color="46, 196, 182" // success-green rgb
                    icon="🚑"
                />
                <StatusCard
                    title="Avg. Response Time"
                    value="08"
                    unit="mins"
                    color="255, 159, 28" // alert-orange rgb
                    icon="⚡"
                />
                <StatusCard
                    title="Hospital Capacity"
                    value="85"
                    unit="%"
                    color="69, 123, 157" // accent-blue rgb
                    icon="🏥"
                />
                <StatusCard
                    title="Active Incidents"
                    value="3"
                    unit="local"
                    color="230, 57, 70" // primary-red rgb
                    icon="⚠️"
                />
            </div>
        </div>
    );
};

export default Dashboard;
