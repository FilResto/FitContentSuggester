'use client';

import { useState } from 'react';
import { AISuggestion } from '@/lib/types';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  onGenerate: () => Promise<void>;
}

export default function AISuggestions({ suggestions, onGenerate }: AISuggestionsProps) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Content Suggestions</h2>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Generating...
            </span>
          ) : (
            'Generate Suggestions'
          )}
        </Button>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          Click "Generate Suggestions" to get AI-powered content recommendations
        </p>
      ) : (
        <div className="space-y-6">
          {suggestions.map((suggestion, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{suggestion.category}</h3>
              <ul className="list-disc list-inside space-y-1">
                {suggestion.suggestions.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
