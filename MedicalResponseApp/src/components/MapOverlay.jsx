import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
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

const MapOverlay = () => {
    const [position, setPosition] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [fetchingHospitals, setFetchingHospitals] = useState(false);

    useEffect(() => {
        // 1. Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const userPos = [pos.coords.latitude, pos.coords.longitude];
                    setPosition(userPos);
                    // fetchHospitals() is called in a separate effect or simply here once.
                    // Actually, for "All India", we don't need user location to fetch.
                    setLoadingLocation(false);
                },
                (err) => {
                    console.error("Geolocation denied or error:", err);
                    setLoadingLocation(false);
                    const fallback = [20.5937, 78.9629]; // Center of India
                    setPosition(fallback);
                }
            );
        } else {
            setLoadingLocation(false);
        }

        // Initial fetch handled by effect when position is set? 
        // No, let's rely on map events + initial position effect.
    }, []);

    // 2. Fetch Hospitals inside Bounding Box
    const fetchHospitals = useCallback(async (bounds) => {
        if (!bounds) return;

        try {
            setFetchingHospitals(true);
            const south = bounds.getSouth();
            const west = bounds.getWest();
            const north = bounds.getNorth();
            const east = bounds.getEast();

            // Overpass Query: Get nodes in bounding box
            const query = `
                [out:json][timeout:25];
                (
                  node["amenity"="hospital"](${south},${west},${north},${east});
                );
                out center;
            `;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

            const response = await fetch(url);
            const data = await response.json();

            const mappedHospitals = data.elements.map(el => ({
                lat: el.lat || el.center.lat,
                lon: el.lon || el.center.lon,
                display_name: el.tags.name || "Unknown Hospital",
                type: el.tags.amenity
            }));

            setHospitals(mappedHospitals);
        } catch (error) {
            console.error("Failed to fetch hospitals:", error);
        } finally {
            setFetchingHospitals(false);
        }
    }, []);

    const handleBoundsChange = useCallback((bounds) => {
        // Simple debounce could be added here if needed, but moveend fires only after drag stops.
        fetchHospitals(bounds);
    }, [fetchHospitals]);

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

                    {/* Trigger fetch on initial load/recenter is tricky because we need bounds.
                        MapEvents handles user interaction. RecenterMap sets view.
                        We can add an effect in RecenterMap to pass bounds back? 
                        For simplicity, let's let the user move the map to trigger, OR
                        we can implement a smarter RecenterMap that calls onBoundsChange. 
                    */}

                    {/* User Marker */}
                    <Marker position={position} icon={UserIcon}>
                        <Popup>
                            <strong>You are here</strong>
                        </Popup>
                    </Marker>

                    {/* Hospital Markers with Clustering */}
                    <MarkerClusterGroup chunkedLoading>
                        {hospitals.map((hospital, idx) => (
                            <Marker
                                key={idx}
                                position={[parseFloat(hospital.lat), parseFloat(hospital.lon)]}
                                icon={HospitalIcon}
                            >
                                <Popup>
                                    <strong>{hospital.display_name}</strong><br />
                                    <span style={{ fontSize: '0.8em' }}>Hospital</span>
                                </Popup>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>
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
                    <span style={{ fontSize: '12px' }}>Your Location</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" width="12" />
                    <span style={{ fontSize: '12px' }}>Hospitals (All Nearby)</span>
                </div>
            </div>
        </div>
    );
};

export default MapOverlay;
