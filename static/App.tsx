
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Earthquake } from './types';
import Header from './components/Header';
import SummaryCard from './components/SummaryCard';
import EarthquakeTable from './components/EarthquakeTable';
import MagnitudeChart from './components/MagnitudeChart';
import { ClockIcon, GlobeAltIcon, TrendingUpIcon, WifiIcon, ChevronUpIcon, ChevronDownIcon, AlertTriangleIcon } from './components/icons';

const App: React.FC = () => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Earthquake; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });

  const fetchEarthquakes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/earthquakes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error('API returned an error status.');
      }
      // Combine date and time for proper sorting
      const processedData = result.data.map((eq: any) => ({
        ...eq,
        datetime: new Date(`${eq.date}T${eq.time.replace(/\s/g, '')}`).toISOString(),
      }));
      setEarthquakes(processedData);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to fetch earthquake data: ${e.message}. Make sure the backend is running.`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarthquakes();
  }, [fetchEarthquakes]);

  const sortedEarthquakes = useMemo(() => {
    let sortableItems = [...earthquakes];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if(sortConfig.key === 'date') {
            aValue = new Date(a.datetime);
            bValue = new Date(b.datetime);
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [earthquakes, sortConfig]);

  const requestSort = (key: keyof Earthquake) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const summaryStats = useMemo(() => {
    if (earthquakes.length === 0) {
      return { total: 0, maxMagnitude: 0, mostRecent: 'N/A', mostActive: 'N/A' };
    }
    const maxMagnitude = Math.max(...earthquakes.map(eq => eq.magnitude));
    const mostRecent = new Date(Math.max(...earthquakes.map(eq => new Date(eq.datetime).getTime())));
    const locationCounts = earthquakes.reduce((acc, eq) => {
      // Basic normalization of location string
      const location = eq.location.split('(')[0].trim().split(',')[0];
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActive = Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b, 'N/A');

    return {
      total: earthquakes.length,
      maxMagnitude,
      mostRecent: mostRecent.toLocaleString(),
      mostActive
    };
  }, [earthquakes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <WifiIcon className="w-16 h-16 animate-pulse text-blue-400" />
          <p className="mt-4 text-lg">Fetching Latest Earthquake Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-gray-800 border border-red-500/50 rounded-lg p-8 max-w-2xl text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
             <AlertTriangleIcon className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-red-400">Connection Error</h2>
          <p className="mt-2 text-gray-300">{error}</p>
          <button 
            onClick={fetchEarthquakes}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Total Quakes (M3+)" value={summaryStats.total} icon={<WifiIcon />} />
          <SummaryCard title="Strongest Quake" value={`M ${summaryStats.maxMagnitude.toFixed(1)}`} icon={<TrendingUpIcon />} />
          <SummaryCard title="Most Recent" value={summaryStats.mostRecent} icon={<ClockIcon />} />
          <SummaryCard title="Most Active Area" value={summaryStats.mostActive} icon={<GlobeAltIcon />} />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
             <h2 className="text-xl font-semibold mb-4 text-white">Recent Earthquakes</h2>
            <EarthquakeTable 
              earthquakes={sortedEarthquakes} 
              requestSort={requestSort}
              sortConfig={sortConfig}
            />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Magnitude Distribution</h2>
            <MagnitudeChart data={earthquakes} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;