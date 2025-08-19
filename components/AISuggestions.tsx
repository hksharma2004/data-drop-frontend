"use client";

import React from 'react';

type AISuggestions = Record<string, string[]>;

interface AISuggestionsProps {
    suggestions: AISuggestions | null;
    onSuggestionClick: (folderName: string, fileNames: string[]) => void;
}

const AISuggestions = ({ suggestions, onSuggestionClick }: AISuggestionsProps) => {
    if (!suggestions) return null;

    return (
        <div className="p-4 border rounded-xl bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg">
            <p className="text-sm font-semibold mb-3 text-white/90">
                ✨ AI Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
                {Object.entries(suggestions).map(([folderName, fileNames]) => (
                    <button
                        key={folderName}
                        onClick={() => onSuggestionClick(folderName, fileNames)}
                        className="px-3 py-1.5 text-xs font-medium border border-white/30 rounded-full hover:bg-white hover:text-primary transition-all duration-200 backdrop-blur-sm bg-white/10"
                    >
                        {folderName} ({fileNames.length})
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AISuggestions;