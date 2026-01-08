import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons preventing them from showing
// See: https://github.com/Leaflet/Leaflet/issues/4968
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const HospitalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const UserIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const RecenterMap = ({ position, onBoundsChange }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, 13);
            // Wait for animation frame to ensure bounds are updated?
            setTimeout(() => {
                if (onBoundsChange) onBoundsChange(map.getBounds());
            }, 500);
        }
    }, [position, map, onBoundsChange]);
    return null;
};

const MapEvents = ({ onBoundsChange }) => {
    const map = useMapEvents({
        moveend: () => {
            onBoundsChange(map.getBounds());
        },
        zoomend: () => {
            onBoundsChange(map.getBounds());
        }
    });
    return null;
};

// Helper for route
const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

const RouteLine = ({ from, to }) => {
    const [positions, setPositions] = useState(null);

    useEffect(() => {
        if (!from || !to) return;
        const fetchRoute = async () => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
                const response = await fetch(url);
                const data = await response.json();
                if (data.routes && data.routes.length > 0) {
                    const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setPositions(coords);
                }
            } catch (err) {
                console.error("Failed to fetch route:", err);
                setPositions([[from.lat, from.lng], [to.lat, to.lng]]);
            }
        };
        fetchRoute();
    }, [from, to]);

    if (!positions) return null;
    return <Polyline positions={positions} color="blue" weight={4} dashArray="10, 10" />;
};

const MapOverlay = ({ onLocationFound, activeRequest }) => {
    const [position, setPosition] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [fetchingHospitals, setFetchingHospitals] = useState(false);
    const [ambulanceLocation, setAmbulanceLocation] = useState(null);

    // Simulate Ambulance Location if accepted
    useEffect(() => {
        if (activeRequest && activeRequest.status === 'ACCEPTED' && position) {
            setAmbulanceLocation({
                lat: position[0] - 0.018, // Similar offset as dashboard
                lng: position[1] - 0.018
            });
        } else {
            setAmbulanceLocation(null);
        }
    }, [activeRequest, position]);

    const [locationStatus, setLocationStatus] = useState('Locating...');

    useEffect(() => {
        // 1. Get Live User Location
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const userPos = [pos.coords.latitude, pos.coords.longitude];
                    setPosition(userPos);
                    if (onLocationFound) onLocationFound({ lat: userPos[0], lng: userPos[1] });
                    setLoadingLocation(false);
                    setLocationStatus('Active');
                },
                (err) => {
                    console.error("Geolocation denied or error:", err);
                    setLoadingLocation(false);
                    // Instead of "Error", show "Simulated" or "Default" so it looks intentional
                    if (err.code === 1) setLocationStatus('Permission Denied (Using Default)');
                    else setLocationStatus('Using Default Location');

                    // If we don't have a position yet, use fallback (Nagpur)
                    setPosition(prev => prev || [20.5937, 78.9629]);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 15000, // Increased timeout
                    maximumAge: 10000
                }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            setLoadingLocation(false);
            setLocationStatus('Not Supported');
            setPosition([20.5937, 78.9629]);
        }
    }, [onLocationFound]);

    // 2. Fetch Hospitals logic
    useEffect(() => {
        const fetchHospitals = async () => {
            setFetchingHospitals(true);
            try {
                const response = await fetch('http://localhost:8080/api/hospitals');
                if (response.ok) {
                    const data = await response.json();
                    setHospitals(data);
                }
            } catch (err) {
                console.error("Failed to fetch hospitals:", err);
            } finally {
                setFetchingHospitals(false);
            }
        };

        fetchHospitals();
    }, []);

    const handleBoundsChange = useCallback((bounds) => {
        // No-op for now, or used for other future bounds logic
    }, []);

    return (
        <div id="map" className="glass-panel" style={{
            height: '500px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            zIndex: 1
        }}>
            {loadingLocation && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--glass-bg)', color: 'white'
                }}>
                    Loading Location...
                </div>
            )}

            {fetchingHospitals && (
                <div style={{
                    position: 'absolute', top: '10px', right: '10px', zIndex: 1000,
                    background: 'rgba(230, 57, 70, 0.9)', color: 'white',
                    padding: '5px 10px', borderRadius: '4px', fontSize: '12px',
                    fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                    <span className="spinner">⌛</span> Loading Hospitals...
                </div>
            )}

            {position && (
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <RecenterMap position={position} onBoundsChange={handleBoundsChange} />
                    <MapEvents onBoundsChange={handleBoundsChange} />

                    {/* Route Line & Ambulance Marker */}
                    {ambulanceLocation && (
                        <>
                            <RouteLine
                                from={ambulanceLocation}
                                to={{ lat: position[0], lng: position[1] }}
                            />
                            <Marker position={[ambulanceLocation.lat, ambulanceLocation.lng]}>
                                <Popup><strong>Ambulance #{activeRequest?.assignedAmbulanceId}</strong><br />Arriving Soon</Popup>
                            </Marker>
                        </>
                    )}

                    {/* Hospital Markers */}
                    {hospitals.map(hospital => (
                        <Marker
                            key={hospital.id}
                            position={[hospital.latitude, hospital.longitude]}
                            icon={HospitalIcon}
                        >
                            <Popup>
                                <strong>{hospital.name}</strong><br />
                                {hospital.address}
                            </Popup>
                        </Marker>
                    ))}

                    {/* Route from Ambulance/User to Hospital (if active request has hospital) */}
                    {activeRequest && activeRequest.hospitalId && hospitals.find(h => h.id === activeRequest.hospitalId) && (
                        <RouteLine
                            from={ambulanceLocation || { lat: position[0], lng: position[1] }}
                            to={{
                                lat: hospitals.find(h => h.id === activeRequest.hospitalId).latitude,
                                lng: hospitals.find(h => h.id === activeRequest.hospitalId).longitude
                            }}
                        />
                    )}

                    {/* User Marker */}
                    <Marker position={position} icon={UserIcon}>
                        <Popup>
                            <strong>You are here</strong>
                        </Popup>
                    </Marker>
                </MapContainer>
            )}

            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(30, 41, 59, 0.9)',
                padding: '10px',
                borderRadius: '8px',
                zIndex: 999,
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" width="12" />
                    <span style={{ fontSize: '12px' }}>Your Location ({locationStatus})</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" width="12" />
                    <span style={{ fontSize: '12px' }}>Nearby Hospitals</span>
                </div>
                {activeRequest && activeRequest.hospitalId && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px' }}>
                        <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" width="12" />
                        <span style={{ fontSize: '12px', color: 'var(--positive-green)', fontWeight: 'bold' }}>Assigned Hospital</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapOverlay;
