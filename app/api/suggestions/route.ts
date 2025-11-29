import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { InstagramClient } from '@/lib/instagram';
import { calculateAnalytics } from '@/lib/analytics';
import { generateContentSuggestions } from '@/lib/openai';
import { sessionOptions } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession(await cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.accessToken || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch profile and media
    const client = new InstagramClient(session.accessToken);
    const profile = await client.getUserProfile(session.userId);
    const mediaResponse = await client.getUserMedia(session.userId, 12);

    // Calculate analytics
    const analytics = calculateAnalytics(mediaResponse.data, profile.followers_count);

    // Generate AI suggestions
    const suggestions = await generateContentSuggestions(
      profile,
      analytics,
      mediaResponse.data
    );

    return NextResponse.json(suggestions);
  } catch (error: any) {
    console.error('Error generating suggestions:', error.message);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
