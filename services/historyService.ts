
import { AnalysisRecord, HealthAnalysis } from '../types';

const HISTORY_KEY = 'vitalis_ai_history';

export const getHistory = (): AnalysisRecord[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) {
      return [];
    }
    const history = JSON.parse(historyJson) as AnalysisRecord[];
    // Sort by most recent first
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const addAnalysisToHistory = (originalSymptoms: string, analysis: HealthAnalysis): AnalysisRecord[] => {
  const currentHistory = getHistory();
  const newRecord: AnalysisRecord = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    originalSymptoms,
    analysis,
  };

  // Prevent duplicate entries if analyzed in quick succession
  const updatedHistory = [newRecord, ...currentHistory.filter(h => h.originalSymptoms !== originalSymptoms)];
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }

  return updatedHistory;
};

export const clearHistory = (): AnalysisRecord[] => {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear history from localStorage", error);
    }
    return [];
};
