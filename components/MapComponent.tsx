import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import { Location, TravelMode, Pin, GeminiResult } from '../types';
import { CIRCLE_COLORS } from '../constants';
import { Icon } from 'leaflet';

interface MapComponentProps {
  center: Location;
  pins: Pin[];
  onMapClick: (location: Location) => void;
  results: { [pinId: string]: GeminiResult };
  retailCategory: string;
  selectedPinId: string | null;
  onPinSelect: (pinId: string) => void;
}

const defaultIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const selectedIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});


const MapEventsHandler: React.FC<{ onMapClick: (location: Location) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const MapCursorHandler: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const map = useMap();
  React.useEffect(() => {
    const container = map.getContainer();
    if (enabled) {
      container.style.cursor = 'crosshair';
    } else {
      container.style.cursor = 'not-allowed';
    }
  }, [map, enabled]);
  return null;
};


const MapComponent: React.FC<MapComponentProps> = ({ center, pins, onMapClick, results, retailCategory, selectedPinId, onPinSelect }) => {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventsHandler onMapClick={onMapClick} />
      <MapCursorHandler enabled={!!retailCategory.trim()} />
      {pins.map((pin) => {
        const pinResult = results[pin.id];
        const isSelected = pin.id === selectedPinId;
        return (
          <React.Fragment key={pin.id}>
            <Marker 
              position={[pin.location.lat, pin.location.lng]} 
              icon={isSelected ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => onPinSelect(pin.id),
              }}
            >
            </Marker>
            {pinResult && Object.entries(pinResult.estimatedDistancesKm).map(([mode, distanceKm]) => {
              const radiusMeters = (distanceKm as number) * 1000;
              const color = CIRCLE_COLORS[mode as TravelMode];
              if (radiusMeters <= 0 || !color) return null;

              return (
                <Circle
                  key={`${pin.id}-${mode}`}
                  center={[pin.location.lat, pin.location.lng]}
                  radius={radiusMeters}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.2 }}
                />
              );
            })}
          </React.Fragment>
        )
      })}
    </MapContainer>
  );
};

export default MapComponent;
