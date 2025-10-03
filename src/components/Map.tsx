import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from './Icon';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface RoutePoint {
  lat: number;
  lng: number;
  elevation?: number;
  timestamp?: number;
}

interface FitFileStats {
  fileName: string;
  fileSize: number;
  duration: string;
  distance: string;
  avgPace: string;
  avgHeartRate: string;
  maxHeartRate: string;
  calories: string;
  elevationGain: string;
  avgCadence: string;
  sport: string;
  startTime: string;
  routeData?: RoutePoint[];
}

interface MapProps {
  fitStats: FitFileStats | null;
  primaryColor: string;
  onMapReset?: () => void;
}

export const Map: React.FC<MapProps> = ({ fitStats, primaryColor, onMapReset }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const initialBoundsRef = useRef<L.LatLngBounds | null>(null);
  const [showResetButton, setShowResetButton] = useState(false);

  // Generate mock route data if no real data is available
  const generateMockRoute = (stats: FitFileStats): RoutePoint[] => {
    const centerLat = 40.7128;
    const centerLng = -74.006;
    const points: RoutePoint[] = [];

    // Parse distance to determine route complexity
    const distanceStr = stats.distance.replace(/[^\d.]/g, '');
    const distance = parseFloat(distanceStr) || 5; // Default 5km
    const numPoints = Math.min(Math.max(Math.floor(distance * 20), 50), 200); // 20 points per km, capped

    // Parse duration to determine route type
    const durationParts = stats.duration.split(':');
    const totalMinutes = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
    const isLongRun = totalMinutes > 30;

    if (isLongRun) {
      // Generate a more complex route for longer runs
      for (let i = 0; i < numPoints; i++) {
        const progress = i / numPoints;
        const angle = progress * 4 * Math.PI; // Multiple loops
        const radius = 0.008 + Math.sin(progress * 6) * 0.003;
        const lat = centerLat + Math.cos(angle) * radius + Math.sin(progress * 10) * 0.001;
        const lng = centerLng + Math.sin(angle) * radius + Math.cos(progress * 8) * 0.001;
        points.push({ lat, lng });
      }
    } else {
      // Generate a simpler circular route for shorter runs
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const radius = 0.005 + Math.sin(i * 0.1) * 0.002;
        const lat = centerLat + Math.cos(angle) * radius;
        const lng = centerLng + Math.sin(angle) * radius;
        points.push({ lat, lng });
      }
    }

    return points;
  };

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create the map instance
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create layer groups for route and markers
    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Reset map to fit bounds
  const handleResetMap = () => {
    if (!mapInstanceRef.current || !fitStats || !initialBoundsRef.current) return;

    // Call analytics handler if provided
    if (onMapReset) {
      onMapReset();
    }

    const map = mapInstanceRef.current;
    map.fitBounds(initialBoundsRef.current, { padding: [20, 20] });
    setShowResetButton(false);
  };

  // Check if map view has changed from initial
  const checkMapViewChanged = () => {
    if (!mapInstanceRef.current || !initialBoundsRef.current) return;

    const map = mapInstanceRef.current;
    const currentBounds = map.getBounds();
    const initialBounds = initialBoundsRef.current;

    // Check if bounds are significantly different
    const tolerance = 0.001; // Adjust as needed
    const boundsChanged =
      Math.abs(currentBounds.getNorth() - initialBounds.getNorth()) > tolerance ||
      Math.abs(currentBounds.getSouth() - initialBounds.getSouth()) > tolerance ||
      Math.abs(currentBounds.getEast() - initialBounds.getEast()) > tolerance ||
      Math.abs(currentBounds.getWest() - initialBounds.getWest()) > tolerance;

    setShowResetButton(boundsChanged);
  };

  // Update the map when fitStats or primaryColor changes
  useEffect(() => {
    if (!mapInstanceRef.current || !fitStats) return;

    const map = mapInstanceRef.current;

    // Clear existing route and markers
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
    }
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    // Get route data (real or mock)
    const routeData =
      fitStats.routeData && fitStats.routeData.length > 0
        ? fitStats.routeData
        : generateMockRoute(fitStats);

    if (routeData.length === 0) return;

    // Convert route data to Leaflet LatLng format
    const latLngs: L.LatLngExpression[] = routeData.map((point) => [point.lat, point.lng]);

    // Create the route polyline
    const routePolyline = L.polyline(latLngs, {
      color: primaryColor,
      weight: 5,
      opacity: 1,
      smoothFactor: 1,
      // Add a subtle glow effect
      className: 'route-line',
    });

    // Add route to map
    routePolyline.addTo(map);
    routeLayerRef.current = routePolyline;

    // Add start and end markers
    if (routeData.length > 0) {
      const startPoint = routeData[0];
      const endPoint = routeData[routeData.length - 1];

      // Custom start marker (green)
      const startIcon = L.divIcon({
        className: 'custom-marker start-marker',
        html: '<div style="background-color: #00ff00; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      // Custom end marker (red)
      const endIcon = L.divIcon({
        className: 'custom-marker end-marker',
        html: '<div style="background-color: #ff0000; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      // Add markers to the markers layer
      L.marker([startPoint.lat, startPoint.lng], { icon: startIcon })
        .bindPopup('Start')
        .addTo(markersLayerRef.current!);

      L.marker([endPoint.lat, endPoint.lng], { icon: endIcon })
        .bindPopup('End')
        .addTo(markersLayerRef.current!);
    }

    // Fit the map to show the entire route
    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [20, 20] });

    // Store initial bounds for reset functionality
    initialBoundsRef.current = bounds;
    setShowResetButton(false);

    // Add event listeners for map movement
    map.on('moveend zoomend', checkMapViewChanged);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('moveend zoomend', checkMapViewChanged);
      }
    };
  }, [fitStats, primaryColor]);

  return (
    <div className="map-container">
      <h3 className="map-title">
        <Icon emoji="📍" filterColor={primaryColor} /> Route Map
      </h3>
      <div className="map-wrapper">
        <div
          ref={mapRef}
          className="leaflet-map"
          style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        />
      </div>
      {!fitStats && (
        <div className="map-placeholder">
          <p>Upload a TCX file to view the route</p>
        </div>
      )}
      <div className="map-legend-container">
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-marker start"></span> Start
          </div>
          <div className="legend-item">
            <span className="legend-marker end"></span> End
          </div>
          <div className="legend-item">
            <span className="legend-line" style={{ backgroundColor: primaryColor }}></span> Route
          </div>
        </div>
        {showResetButton && (
          <>
            <div className="map-legend-divider"></div>
            <button className="map-reset-link" onClick={handleResetMap}>
              Reset view
            </button>
          </>
        )}
      </div>
    </div>
  );
};
