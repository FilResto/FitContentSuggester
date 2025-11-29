import { NextRequest, NextResponse } from 'next/server';
import { InstagramClient } from '@/lib/instagram';

export async function GET(request: NextRequest) {
  try {
    const appId = process.env.INSTAGRAM_APP_ID!;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI!;
    // For Instagram Graph API via Facebook Login, use these scopes
    // Removed instagram_content_publish as it requires app review
    const scope = 'instagram_basic,pages_show_list,pages_read_engagement,instagram_manage_insights';

    const authUrl = InstagramClient.getAuthUrl(appId, redirectUri, scope);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
