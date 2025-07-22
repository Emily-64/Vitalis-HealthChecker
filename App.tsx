
import React, { useState, useEffect } from 'react';
import { HealthAnalysis, AnalysisRecord } from './types';
import { analyzeSymptoms } from './services/geminiService';
import * as historyService from './services/historyService';
import SymptomInputForm from './components/SymptomInputForm';
import HealthReport from './components/HealthReport';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import SuggestedQuestions from './components/SuggestedQuestions';
import HistoryList from './components/HistoryList';
import { StethoscopeIcon } from './components/icons/StethoscopeIcon';
import { HistoryIcon } from './components/icons/HistoryIcon';

type View = 'main' | 'historyList' | 'historyDetail';

const App: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string>('');
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSymptoms, setOriginalSymptoms] = useState<string>('');

  const [view, setView] = useState<View>('main');
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<AnalysisRecord | null>(null);

  useEffect(() => {
    setHistory(historyService.getHistory());
  }, []);

  const handleAnalyze = async (inputText: string) => {
    if (!inputText.trim()) {
      setError('Please enter your symptoms before analyzing.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setOriginalSymptoms(inputText);
    setSymptoms('');

    try {
      const result = await analyzeSymptoms(inputText);
      setAnalysis(result);
      const updatedHistory = historyService.addAnalysisToHistory(inputText, result);
      setHistory(updatedHistory);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing symptoms. Please check your connection or API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSymptoms(suggestion);
    handleAnalyze(suggestion);
  };

  const handleStartNewAnalysis = () => {
    setSymptoms('');
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
    setOriginalSymptoms('');
    setView('main');
    setSelectedHistoryItem(null);
  }

  const handleViewHistory = () => {
    setView('historyList');
    setAnalysis(null);
    setError(null);
  };
  
  const handleSelectItemFromHistory = (record: AnalysisRecord) => {
    setSelectedHistoryItem(record);
    setView('historyDetail');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire analysis history? This action cannot be undone.')) {
        const updatedHistory = historyService.clearHistory();
        setHistory(updatedHistory);
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error && !isLoading && view === 'main') return <ErrorMessage message={error} />;

    switch (view) {
      case 'historyList':
        return (
          <HistoryList
            history={history}
            onSelectItem={handleSelectItemFromHistory}
            onClearHistory={handleClearHistory}
            onBack={handleStartNewAnalysis}
          />
        );
      case 'historyDetail':
        if (selectedHistoryItem) {
          return (
            <div>
              <HealthReport 
                analysis={selectedHistoryItem.analysis} 
                originalSymptoms={selectedHistoryItem.originalSymptoms}
                onBack={() => setView('historyList')}
              />
              <div className="text-center mt-8">
                <button
                  onClick={handleStartNewAnalysis}
                  className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800 transition-colors duration-200"
                >
                  Analyze New Symptoms
                </button>
              </div>
            </div>
          );
        }
        return null; 
      
      case 'main':
      default:
        if (analysis) {
           return (
              <div>
                <HealthReport analysis={analysis} originalSymptoms={originalSymptoms} />
                 <div className="text-center mt-8">
                    <button
                      onClick={handleStartNewAnalysis}
                      className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800 transition-colors duration-200"
                    >
                      Analyze New Symptoms
                    </button>
                </div>
              </div>
            );
        }
        return (
          <>
            <SymptomInputForm 
              onSubmit={() => handleAnalyze(symptoms)} 
              isLoading={isLoading}
              symptoms={symptoms}
              onSymptomChange={setSymptoms}
            />
             {error && !isLoading && <div className="mt-6"><ErrorMessage message={error} /></div>}
            <SuggestedQuestions onSuggestionClick={handleSuggestionClick} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <StethoscopeIcon className="w-10 h-10 text-green-500" />
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">
              Vitalis AI
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Your Personal Health Symptom Navigator
          </p>
          {view === 'main' && !analysis && (
            <button
                onClick={handleViewHistory}
                className="absolute top-0 right-0 flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-semibold py-2 px-3 rounded-lg bg-gray-800/60 hover:bg-gray-700/80"
                aria-label="View analysis history"
              >
              <HistoryIcon className="w-5 h-5" />
              <span>History</span>
            </button>
          )}
        </header>

        <main>
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
            {renderContent()}
          </div>
          
          <footer className="text-center mt-8 text-xs text-gray-400">
            <p><strong>Disclaimer:</strong> This AI Health Checker is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
