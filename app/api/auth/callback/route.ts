import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { InstagramClient } from '@/lib/instagram';
import { sessionOptions } from '@/lib/session';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors
  if (error || !code) {
    console.error('OAuth error:', { error, errorReason, errorDescription });
    return NextResponse.redirect(new URL('/error', request.url));
  }

  try {
    const appId = process.env.INSTAGRAM_APP_ID!;
    const appSecret = process.env.INSTAGRAM_APP_SECRET!;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI!;

    // Exchange authorization code for access token
    console.log('Exchanging code for token...');
    const tokenData = await InstagramClient.exchangeCodeForToken(
      code,
      appId,
      appSecret,
      redirectUri
    );

    console.log('Token exchange successful');

    // Get Instagram Business Account ID from Facebook Pages
    const instagramUserId = await InstagramClient.getUserId(tokenData.access_token);
    console.log('Instagram Business Account ID:', instagramUserId);

    // Get the session
    const session = await getIronSession(await cookies(), sessionOptions);

    // Store access token and Instagram user ID in session
    session.accessToken = tokenData.access_token;
    session.userId = instagramUserId;
    session.isLoggedIn = true;

    // Save the session
    await session.save();

    console.log('Session saved successfully');

    // Return success JSON for client-side redirect
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in callback route:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
