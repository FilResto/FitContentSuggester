// Instagram API Types
export interface InstagramProfile {
  id: string;
  username: string;
  profile_picture_url?: string;
  followers_count: number;
  media_count: number;
}

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  like_count: number;
  comments_count: number;
  timestamp: string;
  media_url?: string;
  permalink: string;
}

export interface InstagramMediaResponse {
  data: InstagramMedia[];
  paging?: {
    cursors?: {
      before?: string;
      after?: string;
    };
    next?: string;
  };
}

// Analytics Types
export interface AnalyticsData {
  avgEngagementRate: number;
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  bestPerformingType: string;
  bestPerformingPost: InstagramMedia | null;
}

// Session Types
export interface SessionData {
  accessToken?: string;
  userId?: string;
  isLoggedIn: boolean;
}

// AI Suggestion Types
export interface AISuggestion {
  category: string;
  suggestions: string[];
}

// Instagram OAuth Types
export interface InstagramTokenResponse {
  access_token: string;
  user_id: number;
}
