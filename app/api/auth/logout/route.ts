import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession(await cookies(), sessionOptions);
    session.destroy();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in logout route:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
