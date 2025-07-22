
import React from 'react';
import { HealthAnalysis, PotentialCondition, SeverityLevel, UrgencyLevel } from '../types';
import { HeartPulseIcon } from './icons/HeartPulseIcon';
import { PillIcon } from './icons/PillIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface HealthReportProps {
  analysis: HealthAnalysis;
  originalSymptoms: string;
  onBack?: () => void; // Optional back handler
}

const severityStyles: Record<SeverityLevel, { bg: string, text: string, border: string }> = {
  'Low': { bg: 'bg-green-900/50', text: 'text-green-300', border: 'border-green-600' },
  'Medium': { bg: 'bg-yellow-900/50', text: 'text-yellow-300', border: 'border-yellow-600' },
  'High': { bg: 'bg-orange-900/50', text: 'text-orange-300', border: 'border-orange-600' },
  'Critical': { bg: 'bg-red-900/50', text: 'text-red-300', border: 'border-red-600' },
};

const urgencyStyles: Record<UrgencyLevel, { bg: string, text: string, border: string, icon: React.ReactNode }> = {
  'Self-Care': { bg: 'bg-teal-900/50', text: 'text-teal-200', border: 'border-teal-500', icon: <PillIcon className="w-8 h-8"/> },
  'Consult a Doctor': { bg: 'bg-yellow-900/50', text: 'text-yellow-200', border: 'border-yellow-500', icon: <HeartPulseIcon className="w-8 h-8"/> },
  'Urgent Care': { bg: 'bg-orange-900/50', text: 'text-orange-200', border: 'border-orange-500', icon: <AlertTriangleIcon className="w-8 h-8"/> },
  'Emergency': { bg: 'bg-red-900/50', text: 'text-red-200', border: 'border-red-500', icon: <AlertTriangleIcon className="w-8 h-8"/> },
};

const ConditionCard: React.FC<{ condition: PotentialCondition }> = ({ condition }) => {
  const styles = severityStyles[condition.severity] || severityStyles['Medium'];
  return (
    <div className={`p-4 rounded-lg border-l-4 ${styles.bg} ${styles.border}`}>
      <h4 className={`font-bold text-lg ${styles.text}`}>{condition.name}</h4>
      <p className="text-gray-300 mt-1">{condition.description}</p>
      <div className={`mt-3 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${styles.bg} ${styles.text}`}>
        Severity: {condition.severity}
      </div>
    </div>
  );
};


const HealthReport: React.FC<HealthReportProps> = ({ analysis, originalSymptoms, onBack }) => {
  const recommendationStyles = urgencyStyles[analysis.recommendation.urgency];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {onBack && (
         <button onClick={onBack} className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-4 font-semibold">
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Back to History</span>
        </button>
      )}

      <div className={`p-6 rounded-2xl border-2 ${recommendationStyles.border} ${recommendationStyles.bg} shadow-md`}>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className={`flex-shrink-0 p-3 rounded-full ${recommendationStyles.text} ${recommendationStyles.bg}`}>
            {recommendationStyles.icon}
          </div>
          <div>
            <h2 className={`text-2xl font-heading font-bold ${recommendationStyles.text}`}>Recommendation: {analysis.recommendation.urgency}</h2>
            <p className="mt-2 text-lg text-gray-200">{analysis.recommendation.advice}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">Your Symptoms</h3>
            <div className="p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-300 italic">"{originalSymptoms}"</p>
            </div>
        </div>

        <div>
          <h3 className="text-xl font-heading font-bold text-white mb-3">AI Symptom Summary</h3>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="text-gray-300">{analysis.symptomSummary}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-heading font-bold text-white mb-3">Potential Conditions</h3>
          <div className="space-y-4">
            {analysis.potentialConditions.map((condition, index) => (
              <ConditionCard key={index} condition={condition} />
            ))}
          </div>
        </div>
      </div>

       <div className="mt-6 bg-red-900/50 border border-red-600 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold font-heading text-red-300">Important Disclaimer</h3>
            <p className="text-red-300/90 text-sm">
              {analysis.disclaimer}
            </p>
          </div>
        </div>

    </div>
  );
};

export default HealthReport;