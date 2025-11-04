import React from 'react';
import { TravelMode, Pin, GeminiResult } from '../types';
import { CIRCLE_COLORS } from '../constants';
import { SpinnerIcon } from './Icons';
import AnalysisDisplay from './AnalysisDisplay';

interface SidebarProps {
  travelTime: number;
  setTravelTime: (time: number) => void;
  retailCategory: string;
  setRetailCategory: (category: string) => void;
  pins: Pin[];
  loading: boolean;
  onClear: () => void;
  selectedPinId: string | null;
  results: { [pinId: string]: GeminiResult };
}

const Legend: React.FC = () => (
    <div className="mt-4">
        <h3 className="text-lg font-semibold text-sky-300 mb-2">Legend</h3>
        <div className="space-y-2">
            {Object.values(TravelMode).map(mode => (
                <div key={mode} className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full" style={{backgroundColor: CIRCLE_COLORS[mode]}}></div>
                    <span className="capitalize text-slate-300">{mode}</span>
                </div>
            ))}
        </div>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  travelTime, 
  setTravelTime, 
  retailCategory, 
  setRetailCategory, 
  pins, 
  loading, 
  onClear,
  selectedPinId,
  results
}) => {
  const selectedResult = selectedPinId ? results[selectedPinId] : null;
  const isPinSelectedButLoading = selectedPinId && !selectedResult;

  return (
    <aside className="bg-slate-800/80 backdrop-blur-sm p-4 md:p-6 overflow-y-auto h-full flex flex-col">
      <div className="flex-grow">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-400">Retail Catchment Analyzer</h1>
        <p className="mt-2 text-slate-400">Analyze potential store locations with AI.</p>

        <div className="mt-6">
          <label htmlFor="travelTime" className="block text-lg font-semibold text-sky-300">
            Travel Time: <span className="font-bold text-white">{travelTime} minutes</span>
          </label>
          <input
            id="travelTime"
            type="range"
            min="5"
            max="60"
            step="5"
            value={travelTime}
            onChange={(e) => setTravelTime(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mt-2 accent-sky-500"
            disabled={loading}
          />
        </div>

        <div className="mt-6">
          <label htmlFor="retailCategory" className="block text-lg font-semibold text-sky-300">
            Retail Category
          </label>
          <input
            id="retailCategory"
            type="text"
            value={retailCategory}
            onChange={(e) => setRetailCategory(e.target.value)}
            placeholder="e.g., cafe, bookstore, boutique"
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-2 mt-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-white"
            disabled={loading}
          />
        </div>
        
        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg text-center text-slate-300 border border-slate-700">
          {retailCategory.trim()
            ? <p className="text-green-400">Ready! Click on the map to drop a pin.</p>
            : <p className="text-amber-400">Enter a retail category to enable pin dropping.</p>
          }
        </div>

        <Legend />
        
        <div className="mt-6">
           <h2 className="text-xl font-semibold text-sky-300 mb-2 flex items-center space-x-2">
             <span>Analysis Result</span>
             {loading && <SpinnerIcon className="h-5 w-5" />}
           </h2>
            {isPinSelectedButLoading ? (
              <div className="flex items-center justify-center space-x-2 text-slate-300 p-4">
                <SpinnerIcon />
                <span>Analyzing selected location...</span>
              </div>
            ) : selectedResult ? (
              <AnalysisDisplay result={selectedResult} />
            ) : (
              <div className="p-4 bg-slate-900/50 rounded-lg text-center text-slate-400 border border-slate-700">
                {loading ? (
                  <p>Analyzing new location(s)...</p>
                ) : (
                  <p>Click a pin on the map to view its detailed analysis.</p>
                )}
              </div>
            )}
        </div>
      </div>

      {pins.length > 0 && (
        <div className="mt-4 flex-shrink-0">
          <button
            onClick={onClear}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-red-900 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Clear All Pins
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;