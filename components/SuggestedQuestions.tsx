
import React from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface SuggestedQuestionsProps {
    onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
    "I have a sharp pain in my chest and difficulty breathing.",
    "For the past week, I've had a runny nose, a cough, and a mild sore throat.",
    "I twisted my ankle playing basketball and now it's swollen and painful to walk on.",
    "I'm experiencing a constant dull headache and sensitivity to light."
];

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSuggestionClick }) => {
    return (
        <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
                <LightbulbIcon className="w-6 h-6 text-green-400" />
                <h3 className="font-heading font-bold text-lg text-green-300">Need some inspiration? Try one of these:</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((q, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(q)}
                        className="text-left p-3 bg-gray-700/60 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors duration-200"
                    >
                        <p className="text-sm text-gray-300">"{q}"</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SuggestedQuestions;