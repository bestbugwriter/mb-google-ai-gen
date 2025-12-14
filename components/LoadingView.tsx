import React from 'react';
import { GenerationStatus } from '../types';

interface LoadingViewProps {
  status: GenerationStatus;
}

const LoadingView: React.FC<LoadingViewProps> = ({ status }) => {
  if (status === GenerationStatus.IDLE) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-12 text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 border-8 border-purple-100 rounded-full"></div>
        <div className="absolute inset-0 border-8 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        {status === GenerationStatus.GENERATING_STORY && "Thinking of a magical story..."}
        {status === GenerationStatus.GENERATING_IMAGES && "Drawing the pictures..."}
      </h3>
      <p className="text-gray-500">
        {status === GenerationStatus.GENERATING_STORY && "Our AI wizard is writing the plot."}
        {status === GenerationStatus.GENERATING_IMAGES && "Adding colors and characters to the pages."}
      </p>
    </div>
  );
};

export default LoadingView;
