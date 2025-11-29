import { SessionOptions } from 'iron-session';
import { SessionData } from './types';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'fitcontent_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};

// Declare module to extend iron-session types
declare module 'iron-session' {
  interface IronSessionData extends SessionData {}
}
