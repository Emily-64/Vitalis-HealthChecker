
import React from 'react';

interface SymptomInputFormProps {
  symptoms: string;
  onSymptomChange: (newSymptoms: string) => void;
  onSubmit: (symptoms: string) => void;
  isLoading: boolean;
}

const SymptomInputForm: React.FC<SymptomInputFormProps> = ({ symptoms, onSymptomChange, onSubmit, isLoading }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(symptoms);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="symptoms" className="block text-lg font-heading font-bold text-gray-200 mb-2">
          Describe your symptoms
        </label>
        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => onSymptomChange(e.target.value)}
          placeholder="e.g., I have a headache, a high fever, and I've been feeling tired for two days..."
          className="w-full h-40 p-3 text-base bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 placeholder-gray-500"
          disabled={isLoading}
        />
      </div>
      <div className="text-center">
        <button
          type="submit"
          disabled={isLoading || !symptoms.trim()}
          className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800 disabled:bg-green-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
      </div>
    </form>
  );
};

export default SymptomInputForm;