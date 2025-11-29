import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';
import { SessionData } from '@/lib/types';

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    // Use the manual access token from environment
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('No INSTAGRAM_ACCESS_TOKEN found in .env.local');
      return NextResponse.redirect(new URL('/error', process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000'));
    }

    // For manual token, we'll fetch the user ID from Instagram API
    const response = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    const data = await response.json();

    if (data.error) {
      console.error('Error fetching Instagram user:', data.error);
      return NextResponse.redirect(new URL('/error', process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000'));
    }

    // Save session
    session.accessToken = accessToken;
    session.userId = data.id;
    session.isLoggedIn = true;
    await session.save();

    console.log('Manual login successful for user:', data.username);

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000'));
  } catch (error) {
    console.error('Error in manual login route:', error);
    return NextResponse.redirect(new URL('/error', process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000'));
  }
}
