import React, { useState, useCallback } from 'react';
import { GenerationStatus, Story, UserInput } from './types';
import { generateStoryStructure, generatePageImage } from './services/geminiService';
import InputForm from './components/InputForm';
import StoryBook from './components/StoryBook';
import LoadingView from './components/LoadingView';
import { BookOpen, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (input: UserInput) => {
    setStatus(GenerationStatus.GENERATING_STORY);
    setError(null);
    setStory(null);

    try {
      // Step 1: Generate Story Structure
      const generatedStory = await generateStoryStructure(
        input.childName,
        input.childGender,
        input.activityDescription,
        input.stylePreference,
        input.pageCount
      );

      setStory(generatedStory);
      setStatus(GenerationStatus.GENERATING_IMAGES);

      // Step 2: Generate Images (Parallel but tracked)
      // We update the story state as images arrive
      const imagePromises = generatedStory.pages.map(async (page, index) => {
        try {
          const imageUrl = await generatePageImage(page.imagePrompt);
          
          setStory(currentStory => {
            if (!currentStory) return null;
            const newPages = [...currentStory.pages];
            newPages[index] = {
              ...newPages[index],
              imageUrl: imageUrl,
              isLoadingImage: false
            };
            return { ...currentStory, pages: newPages };
          });
        } catch (imgErr) {
          console.error(`Failed to generate image for page ${index + 1}`, imgErr);
          // We can optionally set a placeholder here if needed
          setStory(currentStory => {
             if (!currentStory) return null;
             const newPages = [...currentStory.pages];
             newPages[index] = {
               ...newPages[index],
               // Fallback placeholder image
               imageUrl: `https://picsum.photos/800/600?random=${index}`,
               isLoadingImage: false
             };
             return { ...currentStory, pages: newPages };
          });
        }
      });

      // Wait for all images (or timeouts)
      await Promise.all(imagePromises);
      setStatus(GenerationStatus.COMPLETED);

    } catch (err: any) {
      console.error(err);
      setError("Something went wrong while weaving the magic. Please try again.");
      setStatus(GenerationStatus.ERROR);
    }
  }, []);

  const resetApp = () => {
    setStatus(GenerationStatus.IDLE);
    setStory(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
      
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
          <div className="bg-purple-600 p-2 rounded-lg text-white">
            <BookOpen size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight text-purple-900">DreamWeaver<span className="text-pink-600">Kids</span></span>
        </div>
        
        {/* Simple Github/About link placeholder */}
        <a href="#" className="text-sm font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1">
          <Sparkles size={16} />
          AI Powered
        </a>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20">
        
        {error && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-red-100 text-red-700 border border-red-200 rounded-xl text-center">
            {error}
          </div>
        )}

        {(status === GenerationStatus.IDLE || status === GenerationStatus.ERROR) && (
          <div className="animate-fade-in-up">
             <div className="text-center mb-12">
               <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-800">
                 Turn Today's Moments into <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Bedtime Magic</span>
               </h1>
               <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                 Just describe what your child did today, and we'll instantly generate a beautifully illustrated storybook starring them.
               </p>
             </div>
             <InputForm onSubmit={handleGenerate} status={status} />
          </div>
        )}

        {(status === GenerationStatus.GENERATING_STORY || status === GenerationStatus.GENERATING_IMAGES) && (
           <LoadingView status={status} />
        )}

        {(status === GenerationStatus.COMPLETED || (status === GenerationStatus.GENERATING_IMAGES && story)) && story && (
          <div className="animate-fade-in">
             <StoryBook story={story} onReset={resetApp} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>Built with Gemini 2.5 & 3.0 Models</p>
      </footer>
    </div>
  );
};

export default App;
