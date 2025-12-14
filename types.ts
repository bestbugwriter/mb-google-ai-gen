export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING_STORY = 'GENERATING_STORY',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string; // Populated after image generation
  isLoadingImage?: boolean;
}

export interface Story {
  title: string;
  theme: string;
  moral: string;
  pages: StoryPage[];
}

export interface UserInput {
  childName: string;
  childGender: 'boy' | 'girl' | 'other';
  activityDescription: string;
  stylePreference: string;
  pageCount: number;
}
