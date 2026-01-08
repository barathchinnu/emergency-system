import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../apiConfig';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const EmergencyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Helper component to fly to location
const FlyToLocation = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15, { duration: 2 });
        }
    }, [position, map]);
    return null;
};

// Helper to calculate distance (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

// Component to draw route line
const RouteLine = ({ from, to }) => {
    const [positions, setPositions] = useState(null);

    useEffect(() => {
        if (!from || !to) return;

        const fetchRoute = async () => {
            try {
                // OSRM Public API (Demo server)
                const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    // OSRM returns [lon, lat], Leaflet needs [lat, lon]
                    const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setPositions(coords);
                }
            } catch (err) {
                console.error("Failed to fetch route:", err);
                // Fallback to straight line
                setPositions([[from.lat, from.lng], [to.lat, to.lng]]);
            }
        };

        fetchRoute();
    }, [from, to]);

    if (!positions) return null;

    return <Polyline positions={positions} color="blue" weight={4} dashArray="10, 10" />;
};

const AmbulanceDashboard = ({ user }) => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [ambulanceLocation, setAmbulanceLocation] = useState(null);
    const [hospitalInfo, setHospitalInfo] = useState(null);

    // Fetch hospital info if request has hospitalId
    useEffect(() => {
        if (selectedRequest && selectedRequest.hospitalId) {
            const fetchHospital = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/hospitals`);
                    if (response.ok) {
                        const data = await response.json();
                        const hospital = data.find(h => h.id === selectedRequest.hospitalId);
                        setHospitalInfo(hospital);
                    }
                } catch (err) {
                    console.error("Failed to fetch hospital info");
                }
            };
            fetchHospital();
        } else {
            setHospitalInfo(null);
        }
    }, [selectedRequest]);

    // Fetch requests logic
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/emergencies`);
                if (response.ok) {
                    const data = await response.json();
                    setRequests(data);
                }
            } catch (err) {
                console.error("Failed to fetch emergencies:", err);
            }
        };

        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, [refreshTrigger]);

    // Simulate Ambulance Location (approx 2km away from the first request or user)
    // For demo: whenever a request is selected, place ambulance ~2km away
    useEffect(() => {
        if (selectedRequest) {
            // Simply minus 0.018 lat roughly equals 2km
            setAmbulanceLocation({
                lat: selectedRequest.latitude - 0.018,
                lng: selectedRequest.longitude - 0.018
            });
        }
    }, [selectedRequest]);

    // Format date helper
    const formatDate = (dateString = new Date().toISOString()) => {
        return new Date().toLocaleString();
    };

    const handleAcceptRequest = async () => {
        if (!selectedRequest) return;

        try {
            const payload = {
                status: "ACCEPTED",
                assignedAmbulanceId: user.username // Use username as ID for now
            };

            const response = await fetch(`${API_BASE_URL}/api/emergencies/${selectedRequest.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Update local state to reflect change immediately
                setRequests(prev => prev.map(req =>
                    req.id === selectedRequest.id ? { ...req, status: 'ACCEPTED', assignedAmbulanceId: user.username } : req
                ));
                setSelectedRequest(prev => ({ ...prev, status: 'ACCEPTED', assignedAmbulanceId: user.username }));
                alert(`Request #${selectedRequest.id} Accepted!`);
            } else {
                console.error("Failed to accept request");
            }
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-dark)', color: 'white' }}>
            {/* Sidebar List */}
            <div style={{ width: '400px', borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🚑 Ambulance Dispatch
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Logged in as: {user?.username}</p>
                </div>

                <div style={{ flex: 1 }}>
                    {requests.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No active emergency requests.
                        </div>
                    ) : (
                        requests.map(req => (
                            <div
                                key={req.id}
                                onClick={() => setSelectedRequest(req)}
                                style={{
                                    padding: '1.5rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    background: selectedRequest?.id === req.id ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                                    transition: 'background 0.2s',
                                    borderLeft: selectedRequest?.id === req.id ? '4px solid var(--medical-blue)' : '4px solid transparent'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{
                                        background: req.status === 'PENDING' ? 'var(--primary-red)' : 'var(--positive-green)',
                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                                    }}>
                                        {req.status}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: #{req.id}</span>
                                </div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{req.natureOfEmergency || 'Emergency Request'}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Patient ID: {req.userId}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Map Area */}
            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {selectedRequest && (
                        <>
                            <FlyToLocation position={[selectedRequest.latitude, selectedRequest.longitude]} />

                            {/* Route Line */}
                            {ambulanceLocation && (
                                <RouteLine
                                    from={ambulanceLocation}
                                    to={{ lat: selectedRequest.latitude, lng: selectedRequest.longitude }}
                                />
                            )}

                            {/* Victim Marker */}
                            <Marker position={[selectedRequest.latitude, selectedRequest.longitude]} icon={EmergencyIcon}>
                                <Popup>
                                    <strong>{selectedRequest.natureOfEmergency}</strong><br />
                                    Patient: {selectedRequest.userId}<br />
                                    Status: {selectedRequest.status}
                                </Popup>
                            </Marker>

                            {/* Ambulance Marker */}
                            {ambulanceLocation && (
                                <Marker position={[ambulanceLocation.lat, ambulanceLocation.lng]}>
                                    <Popup><strong>Ambulance (You)</strong></Popup>
                                </Marker>
                            )}

                            {/* Hospital Marker */}
                            {hospitalInfo && (
                                <>
                                    <Marker position={[hospitalInfo.latitude, hospitalInfo.longitude]} icon={new L.Icon({
                                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                                        iconSize: [25, 41],
                                        iconAnchor: [12, 41],
                                        popupAnchor: [1, -34],
                                        shadowSize: [41, 41]
                                    })}>
                                        <Popup>
                                            <strong>{hospitalInfo.name}</strong><br />
                                            {hospitalInfo.address}
                                        </Popup>
                                    </Marker>
                                    <RouteLine
                                        from={{ lat: selectedRequest.latitude, lng: selectedRequest.longitude }}
                                        to={{ lat: hospitalInfo.latitude, lng: hospitalInfo.longitude }}
                                    />
                                </>
                            )}
                        </>
                    )}
                </MapContainer>

                {/* Overlay Info Panel */}
                {selectedRequest && (
                    <div style={{
                        position: 'absolute', top: '20px', right: '20px', width: '300px',
                        background: 'rgba(30, 41, 59, 0.95)', padding: '1.5rem', borderRadius: '12px',
                        zIndex: 1000, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            Request Details
                        </h3>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Type</label>
                                <div>{selectedRequest.natureOfEmergency}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Location</label>
                                <div style={{ fontFamily: 'monospace' }}>
                                    {selectedRequest.latitude.toFixed(6)}, {selectedRequest.longitude.toFixed(6)}
                                </div>
                            </div>
                            {hospitalInfo && (
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Destination Hospital</label>
                                    <div style={{ color: 'var(--positive-green)', fontWeight: 'bold' }}>{hospitalInfo.name}</div>
                                    <div style={{ fontSize: '0.8rem' }}>Accepted by Dr. {selectedRequest.doctorName}</div>
                                </div>
                            )}
                            {ambulanceLocation && (
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Est. Distance</label>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--medical-blue)' }}>
                                        {calculateDistance(
                                            ambulanceLocation.lat, ambulanceLocation.lng,
                                            selectedRequest.latitude, selectedRequest.longitude
                                        )} km
                                    </div>
                                </div>
                            )}
                            <button
                                className="btn-primary"
                                style={{
                                    marginTop: '1rem',
                                    width: '100%',
                                    background: selectedRequest.status === 'ACCEPTED' ? 'var(--positive-green)' : ''
                                }}
                                onClick={handleAcceptRequest}
                                disabled={selectedRequest.status === 'ACCEPTED'}
                            >
                                {selectedRequest.status === 'ACCEPTED' ? 'ACCEPTED' : 'Accept Request'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AmbulanceDashboard;
