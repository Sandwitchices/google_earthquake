
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg flex items-center space-x-4 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-3 bg-gray-700/50 rounded-lg text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
