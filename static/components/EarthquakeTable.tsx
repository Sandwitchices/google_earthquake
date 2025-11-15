
import React from 'react';
import { Earthquake } from '../types';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

interface EarthquakeTableProps {
  earthquakes: Earthquake[];
  requestSort: (key: keyof Earthquake) => void;
  sortConfig: { key: keyof Earthquake; direction: 'ascending' | 'descending' } | null;
}

const getMagnitudeColor = (magnitude: number) => {
  if (magnitude >= 6) return 'bg-red-500 text-red-100';
  if (magnitude >= 5) return 'bg-orange-500 text-orange-100';
  if (magnitude >= 4) return 'bg-yellow-500 text-yellow-100';
  return 'bg-green-500 text-green-100';
};

const SortableHeader: React.FC<{
    label: string;
    sortKey: keyof Earthquake;
    requestSort: (key: keyof Earthquake) => void;
    sortConfig: { key: keyof Earthquake; direction: 'ascending' | 'descending' } | null;
}> = ({ label, sortKey, requestSort, sortConfig }) => {
    const isSorted = sortConfig?.key === sortKey;
    const directionIcon = isSorted ? (sortConfig.direction === 'ascending' ? <ChevronUpIcon /> : <ChevronDownIcon />) : null;

    return (
        <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
            <button onClick={() => requestSort(sortKey)} className="flex items-center gap-2 group">
                {label}
                <span className={`transition-opacity ${isSorted ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`}>
                    {directionIcon}
                </span>
            </button>
        </th>
    );
};

const EarthquakeTable: React.FC<EarthquakeTableProps> = ({ earthquakes, requestSort, sortConfig }) => {
  return (
    <div className="overflow-x-auto">
        <div className="max-h-[60vh] overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800 sticky top-0">
          <tr>
            <SortableHeader label="Date & Time" sortKey="date" requestSort={requestSort} sortConfig={sortConfig} />
            <SortableHeader label="Location" sortKey="location" requestSort={requestSort} sortConfig={sortConfig} />
            <SortableHeader label="Magnitude" sortKey="magnitude" requestSort={requestSort} sortConfig={sortConfig} />
            <SortableHeader label="Depth (km)" sortKey="depth" requestSort={requestSort} sortConfig={sortConfig} />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 bg-gray-800/50">
          {earthquakes.map((eq, index) => (
            <tr key={index} className="hover:bg-gray-700/50 transition-colors">
              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                <div>{new Date(eq.datetime).toLocaleDateString()}</div>
                <div className="text-gray-400">{new Date(eq.datetime).toLocaleTimeString()}</div>
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">{eq.location}</td>
              <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMagnitudeColor(eq.magnitude)}`}>
                  {eq.magnitude.toFixed(1)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">{eq.depth}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default EarthquakeTable;