
import React from 'react';
import { WifiIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
             <WifiIcon className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">PHIVOLCS Earthquake Viewer</h1>
            <p className="text-sm text-gray-400">Real-time seismic activity monitor</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-400 font-medium">Live</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
