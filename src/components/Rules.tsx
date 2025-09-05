import React from 'react';
import { AppTexts } from '../types';

interface RulesProps {
  texts: AppTexts;
  onClose: () => void;
}

export function Rules({ texts, onClose }: RulesProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{texts.rulesTitle}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div 
            className="prose prose-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: texts.rulesContent }}
          />
          
          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Compris !
          </button>
        </div>
      </div>
    </div>
  );
}