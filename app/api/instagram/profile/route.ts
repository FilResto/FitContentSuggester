import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { InstagramClient } from '@/lib/instagram';
import { sessionOptions } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession(await cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.accessToken || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = new InstagramClient(session.accessToken);
    const profile = await client.getUserProfile(session.userId);

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
