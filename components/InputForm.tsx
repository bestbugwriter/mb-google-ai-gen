import React, { useState } from 'react';
import { UserInput, GenerationStatus } from '../types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  status: GenerationStatus;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, status }) => {
  const [formData, setFormData] = useState<UserInput>({
    childName: '',
    childGender: 'boy',
    activityDescription: '',
    stylePreference: 'Storybook Illustration (Watercolor & Ink)',
    pageCount: 5
  });

  const isGenerating = status !== GenerationStatus.IDLE && status !== GenerationStatus.ERROR && status !== GenerationStatus.COMPLETED;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.childName || !formData.activityDescription) return;
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-purple-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-center text-purple-900 mb-6">Create a Magic Story</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Child's Name</label>
              <input
                type="text"
                value={formData.childName}
                onChange={(e) => setFormData({...formData, childName: e.target.value})}
                placeholder="e.g. Xiaoming"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                disabled={isGenerating}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                {['boy', 'girl', 'other'].map((g) => (
                  <label key={g} className={`flex-1 cursor-pointer border rounded-xl p-3 flex items-center justify-center transition-all ${formData.childGender === g ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold' : 'border-gray-200 hover:border-purple-300'}`}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.childGender === g}
                      onChange={(e) => setFormData({...formData, childGender: e.target.value as any})}
                      className="hidden"
                      disabled={isGenerating}
                    />
                    <span className="capitalize">{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">What happened today?</label>
            <textarea
              value={formData.activityDescription}
              onChange={(e) => setFormData({...formData, activityDescription: e.target.value})}
              placeholder="e.g. Today Xiaoming went to get a vaccine and he was very brave, he didn't cry at all."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none h-32"
              disabled={isGenerating}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Art Style</label>
               <select 
                 value={formData.stylePreference}
                 onChange={(e) => setFormData({...formData, stylePreference: e.target.value})}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                 disabled={isGenerating}
               >
                 <option value="Storybook Illustration (Watercolor & Ink)">Watercolor & Ink</option>
                 <option value="3D Pixar Style">3D Cartoon (Pixar style)</option>
                 <option value="Crayon Drawing">Child's Crayon Drawing</option>
                 <option value="Japanese Anime for Kids (Ghibli style)">Anime (Ghibli style)</option>
                 <option value="Paper Cutout Art">Paper Cutout Art</option>
               </select>
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Story Length: {formData.pageCount} Pages</label>
               <div className="flex items-center gap-4 h-[46px]"> {/* height matches select roughly */}
                 <span className="text-xs text-gray-400 font-semibold">Short</span>
                 <input 
                   type="range" 
                   min="3" 
                   max="10" 
                   step="1"
                   value={formData.pageCount}
                   onChange={(e) => setFormData({...formData, pageCount: parseInt(e.target.value)})}
                   className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200"
                   disabled={isGenerating}
                 />
                 <span className="text-xs text-gray-400 font-semibold">Long</span>
               </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isGenerating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'
            }`}
          >
            {isGenerating ? 'Weaving Magic...' : 'Generate Storybook ✨'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
