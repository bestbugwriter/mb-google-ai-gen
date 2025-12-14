import React, { useState } from 'react';
import { Story } from '../types';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface StoryBookProps {
  story: Story;
  onReset: () => void;
}

const StoryBook: React.FC<StoryBookProps> = ({ story, onReset }) => {
  const [activePage, setActivePage] = useState(0);

  const nextPage = () => setActivePage(p => Math.min(p + 1, story.pages.length - 1));
  const prevPage = () => setActivePage(p => Math.max(p - 1, 0));

  const currentPageData = story.pages[activePage];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          {story.title}
        </h1>
        <p className="text-gray-600 text-lg italic">"{story.moral}"</p>
      </div>

      {/* Book Container */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-purple-900/5">
        
        {/* Navigation Buttons Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none flex justify-between items-center px-4">
          <button 
            onClick={prevPage}
            disabled={activePage === 0}
            className={`pointer-events-auto p-2 rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-opacity hover:bg-white ${activePage === 0 ? 'opacity-0' : 'opacity-100'}`}
          >
            <ChevronLeft className="w-8 h-8 text-purple-700" />
          </button>
          <button 
            onClick={nextPage}
            disabled={activePage === story.pages.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-opacity hover:bg-white ${activePage === story.pages.length - 1 ? 'opacity-0' : 'opacity-100'}`}
          >
            <ChevronRight className="w-8 h-8 text-purple-700" />
          </button>
        </div>

        {/* Page Content */}
        <div className="flex flex-col md:flex-row h-full w-full bg-[#fdfbf7]">
          
          {/* Image Side */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-gray-100 flex items-center justify-center overflow-hidden">
            {currentPageData.imageUrl ? (
              <img 
                src={currentPageData.imageUrl} 
                alt={`Page ${currentPageData.pageNumber}`} 
                className="w-full h-full object-cover animate-fade-in"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-400">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="font-medium animate-pulse">Painting magic...</p>
              </div>
            )}
            
            {/* Page Number Badge */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
              Page {activePage + 1} / {story.pages.length}
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center items-center text-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
             <div className="prose prose-xl prose-purple">
               <p className="font-serif text-xl md:text-2xl leading-relaxed text-gray-800">
                 {currentPageData.text}
               </p>
             </div>
          </div>

        </div>
      </div>

      {/* Pagination / Controls */}
      <div className="flex gap-4">
        <button 
          onClick={onReset}
          className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
        >
          Create New Story
        </button>
      </div>

    </div>
  );
};

export default StoryBook;
