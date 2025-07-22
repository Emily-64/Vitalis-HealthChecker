
import React from 'react';
import { AnalysisRecord } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface HistoryListProps {
  history: AnalysisRecord[];
  onSelectItem: (record: AnalysisRecord) => void;
  onClearHistory: () => void;
  onBack: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelectItem, onClearHistory, onBack }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
          <ChevronLeftIcon className="w-5 h-5" />
          <span className="font-semibold">Back to Analysis</span>
        </button>
        <h2 className="text-2xl font-heading font-bold text-white">Analysis History</h2>
        <button 
          onClick={onClearHistory} 
          disabled={history.length === 0}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
          <span className="font-semibold">Clear All</span>
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/50 rounded-lg">
          <p className="text-gray-400">Your analysis history is empty.</p>
          <p className="text-gray-500 mt-2">Completed analyses will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(record => (
            <button
              key={record.id}
              onClick={() => onSelectItem(record)}
              className="w-full text-left p-4 bg-gray-700/60 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <div className="flex justify-between items-start gap-4">
                <p className="font-semibold text-gray-200 truncate pr-4">
                  {record.originalSymptoms}
                </p>
                <p className="text-xs text-gray-400 flex-shrink-0 text-right">
                  {new Date(record.timestamp).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <p className="text-sm text-green-400 mt-1 font-semibold">
                Recommendation: {record.analysis.recommendation.urgency}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;