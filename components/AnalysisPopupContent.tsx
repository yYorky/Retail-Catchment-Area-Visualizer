import React from 'react';
import Markdown from 'react-markdown';
import { GeminiResult, GroundingChunk, TravelMode } from '../types';
import { CarIcon, LinkIcon, TransitIcon, WalkIcon } from './Icons';

interface AnalysisPopupContentProps {
  result: GeminiResult;
}

const modeToIcon: Record<TravelMode, React.ReactNode> = {
  [TravelMode.WALK]: <WalkIcon className="h-5 w-5" />,
  [TravelMode.DRIVE]: <CarIcon className="h-5 w-5" />,
  [TravelMode.TRANSIT]: <TransitIcon className="h-5 w-5" />,
}

const AnalysisPopupContent: React.FC<AnalysisPopupContentProps> = ({ result }) => {
  return (
    <div className="w-80 max-h-80 overflow-y-auto p-1 bg-slate-800 text-white">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-sky-400">{result.locationName}</h3>
      </div>

      <div className="bg-slate-700/50 p-3 rounded-md">
        <div className="mb-3">
          <h4 className="text-md font-semibold text-slate-100 mb-2">Estimated Travel Radii</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            {Object.entries(result.estimatedDistancesKm).map(([mode, dist]) => {
              const distance = dist as number;
              return (
                <li key={mode} className="flex items-center space-x-2">
                  {modeToIcon[mode as TravelMode]}
                  <span className="capitalize w-28">{mode}</span>
                  <span className="font-mono">{distance > 0 ? `${distance.toFixed(1)} km` : '-'}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="prose prose-invert prose-sm text-slate-300 max-w-none pt-3 border-t border-slate-600">
          <Markdown>{result.analysis}</Markdown>
        </div>
        {result.sources && result.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-600">
            <h5 className="text-sm font-semibold text-slate-400 mb-2">Sources from Google Maps:</h5>
            <ul className="space-y-1">
              {result.sources.filter(s => s.maps).map((source: GroundingChunk, index: number) => (
                <li key={index}>
                  <a href={source.maps!.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-sky-400 hover:text-sky-300 hover:underline truncate">
                    <LinkIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{source.maps!.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPopupContent;
