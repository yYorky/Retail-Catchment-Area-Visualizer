import React, { useState, useEffect, useCallback } from 'react';
import { Location, GeminiResult, Pin } from './types';
import Sidebar from './components/Sidebar';
import { fetchTravelInfo } from './services/geminiService';

const MapComponent = React.lazy(() => import('./components/MapComponent'));

const App: React.FC = () => {
  const [mapCenter, setMapCenter] = useState<Location>({ lat: 1.3521, lng: 103.8198 });
  const [pins, setPins] = useState<Pin[]>([]);
  const [travelTime, setTravelTime] = useState<number>(15);
  const [retailCategory, setRetailCategory] = useState<string>('');
  const [results, setResults] = useState<{ [pinId: string]: GeminiResult }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        console.log("Geolocation permission denied. Using default location (Singapore).");
      }
    );
  }, []);

  const handleMapClick = useCallback((location: Location) => {
    if (!retailCategory.trim()) {
      alert("Please enter a Retail Category before dropping a pin.");
      return;
    }
    const newPin: Pin = {
      id: `pin_${Date.now()}`,
      location,
    };
    setPins(prevPins => [...prevPins, newPin]);
  }, [retailCategory]);

  useEffect(() => {
    // This effect triggers analysis for new pins that don't have results yet
    const pinsWithoutResults = pins.filter(pin => !results[pin.id]);
    if (pinsWithoutResults.length === 0) return;

    const fetchForNewPins = async () => {
        setLoading(true);
        const newPinPromises = pinsWithoutResults.map(async (pin) => {
          try {
            const pinResult = await fetchTravelInfo(pin.location, travelTime, retailCategory);
            return { pinId: pin.id, result: pinResult };
          } catch (error) {
            console.error(`Failed fetching for pin ${pin.id}`, error);
            return { pinId: pin.id, result: null };
          }
        });
  
        const newResultsArray = await Promise.all(newPinPromises);
  
        setResults(prevResults => {
          const updatedResults = { ...prevResults };
          newResultsArray.forEach(({ pinId, result }) => {
            if (result) {
              updatedResults[pinId] = result;
            }
          });
          return updatedResults;
        });
        setLoading(false);
      };
      fetchForNewPins();
  }, [pins, travelTime, retailCategory, results]);

  const handleClear = () => {
    setPins([]);
    setResults({});
    setSelectedPinId(null);
  };

  const handlePinSelect = (pinId: string) => {
    setSelectedPinId(pinId);
  };

  const handleReanalyze = useCallback(() => {
    if(pins.length === 0) return;

    // Clear old results to trigger re-fetch for all pins
    setResults({});

    // The useEffect hook will automatically pick up the pins and fetch new data.
  }, [pins]);

  // Use a separate effect to re-trigger analysis when travelTime or category changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (pins.length > 0) {
        handleReanalyze();
      }
    }, 500); // Debounce

    return () => clearTimeout(handler);
  }, [travelTime, retailCategory]);


  return (
    <main className="h-screen w-screen bg-slate-900 flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full flex-shrink-0 z-10 shadow-lg">
        <Sidebar
          travelTime={travelTime}
          setTravelTime={setTravelTime}
          retailCategory={retailCategory}
          setRetailCategory={setRetailCategory}
          pins={pins}
          loading={loading}
          onClear={handleClear}
          selectedPinId={selectedPinId}
          results={results}
        />
      </div>
      <div className="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full">
        {isClient && (
          <React.Suspense fallback={<div className="flex items-center justify-center h-full bg-slate-700 text-white">Loading Map...</div>}>
            <MapComponent 
              center={mapCenter} 
              pins={pins} 
              onMapClick={handleMapClick} 
              results={results}
              retailCategory={retailCategory}
              selectedPinId={selectedPinId}
              onPinSelect={handlePinSelect}
            />
          </React.Suspense>
        )}
      </div>
    </main>
  );
};

export default App;
