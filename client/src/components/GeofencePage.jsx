// File: client/src/components/GeofencePage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import { getGeofence, setGeofence } from '../api/geofenceApi';

// A helper component to handle map clicks and recenter the view
const MapEvents = ({ setPosition, map }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      // Smoothly fly to the new marker position
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
};

const GeofencePage = () => {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(500);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Default to a central location in Kolkata
  const defaultPosition = useMemo(() => ({ lat: 22.5726, lng: 88.3639 }), []);

  useEffect(() => {
    const fetchGeofence = async () => {
      try {
        const response = await getGeofence();
        const data = response.data;
        if (data && data.geoLatitude && data.geoLongitude) {
          const fetchedPosition = { lat: data.geoLatitude, lng: data.geoLongitude };
          setPosition(fetchedPosition);
          setRadius(data.geoRadius || 500);
          // If a map instance exists, fly to the loaded position
          if (map) {
            map.flyTo(fetchedPosition, 15);
          }
        }
      } catch (err) {
        setError('Failed to load existing geofence settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchGeofence();
  }, [map]); // Re-run if the map instance becomes available

  const handleSave = async () => {
    if (!position) {
      setError('Please click on the map to set the center of the campus.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await setGeofence({
        latitude: position.lat,
        longitude: position.lng,
        radius: radius,
      });
      setSuccess('Geofence settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings.');
    }
  };

  if (loading) {
    return <p className="text-center p-4">Loading map settings...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800">Geofence Settings</h2>
      <p className="text-gray-600 mt-2 mb-6">
        Click on the map to set the center of your campus, then adjust the radius. This will create a virtual boundary for attendance verification.
      </p>
      
      {success && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">{success}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

      <div className="h-96 w-full rounded-lg overflow-hidden z-0 mb-6 border">
        <MapContainer
          center={position || defaultPosition}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          ref={setMap} // This is a more reliable way to get the map instance
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Only render the event handler when the map is ready */}
          {map ? <MapEvents setPosition={setPosition} map={map} /> : null}
          {position && (
            <>
              <Marker position={position}></Marker>
              <Circle center={position} radius={radius} pathOptions={{ color: 'blue', fillColor: 'blue' }} />
            </>
          )}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">Radius: {radius} meters</label>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="text-sm text-gray-600">
            <p><strong>Latitude:</strong> {position ? position.lat.toFixed(6) : 'N/A'}</p>
            <p><strong>Longitude:</strong> {position ? position.lng.toFixed(6) : 'N/A'}</p>
        </div>
        <div>
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded w-full">
                Save Settings
            </button>
        </div>
      </div>
    </div>
  );
};

export default GeofencePage;
