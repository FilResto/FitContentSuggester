import axios from 'axios';
import { InstagramProfile, InstagramMediaResponse, InstagramTokenResponse } from './types';

const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com';
const INSTAGRAM_API = 'https://api.instagram.com';
const FACEBOOK_OAUTH = 'https://www.facebook.com/v18.0/dialog/oauth';

export class InstagramClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Fetch user profile data
   */
  async getUserProfile(userId: string): Promise<InstagramProfile> {
    try {
      const response = await axios.get(`${INSTAGRAM_GRAPH_API}/${userId}`, {
        params: {
          fields: 'id,username,profile_picture_url,followers_count,media_count',
          access_token: this.accessToken,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching Instagram profile:', error.response?.data || error.message);
      throw new Error('Failed to fetch Instagram profile');
    }
  }

  /**
   * Fetch user media (posts)
   */
  async getUserMedia(userId: string, limit: number = 12): Promise<InstagramMediaResponse> {
    try {
      const response = await axios.get(`${INSTAGRAM_GRAPH_API}/${userId}/media`, {
        params: {
          fields: 'id,caption,media_type,like_count,comments_count,timestamp,media_url,permalink',
          limit,
          access_token: this.accessToken,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching Instagram media:', error.response?.data || error.message);
      throw new Error('Failed to fetch Instagram media');
    }
  }

  /**
   * Generate Facebook OAuth authorization URL for Instagram Graph API
   * Instagram Graph API requires Facebook Login, not Instagram Basic Display
   */
  static getAuthUrl(appId: string, redirectUri: string, scope: string): string {
    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      scope: scope,
      response_type: 'code',
      state: 'instagram_auth', // Optional state parameter for security
    });

    return `${FACEBOOK_OAUTH}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token using Facebook Graph API
   */
  static async exchangeCodeForToken(
    code: string,
    appId: string,
    appSecret: string,
    redirectUri: string
  ): Promise<InstagramTokenResponse> {
    try {
      // Use Facebook Graph API to exchange code for token
      const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code: code,
        },
      });

      // Return in the expected format (user_id will be fetched separately)
      return {
        access_token: response.data.access_token,
        user_id: 0, // Placeholder - will get Instagram Business Account ID separately
      };
    } catch (error: any) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw new Error('Failed to exchange code for access token');
    }
  }

  /**
   * Get Instagram Business Account ID from Facebook Page
   * This is a multi-step process for Instagram Graph API
   */
  static async getUserId(accessToken: string): Promise<string> {
    try {
      // Step 1: Get Facebook Pages
      const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
        params: {
          access_token: accessToken,
        },
      });

      if (!pagesResponse.data.data || pagesResponse.data.data.length === 0) {
        throw new Error('No Facebook Pages found. You need a Facebook Page connected to an Instagram Business Account.');
      }

      // Use the first page (you can modify this logic if needed)
      const pageId = pagesResponse.data.data[0].id;
      const pageAccessToken = pagesResponse.data.data[0].access_token;

      // Step 2: Get Instagram Business Account connected to the Page
      const igResponse = await axios.get(`https://graph.facebook.com/v18.0/${pageId}`, {
        params: {
          fields: 'instagram_business_account',
          access_token: pageAccessToken,
        },
      });

      if (!igResponse.data.instagram_business_account) {
        throw new Error('No Instagram Business Account connected to this Facebook Page.');
      }

      return igResponse.data.instagram_business_account.id;
    } catch (error: any) {
      console.error('Error getting Instagram Business Account ID:', error.response?.data || error.message);
      throw new Error('Failed to get Instagram Business Account ID. Make sure your Facebook Page is connected to an Instagram Business Account.');
    }
  }
}
