import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google'; 
 
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      // clientId: process.env.GOOGLE_CLIENT_ID || (() => { throw new Error('GOOGLE_CLIENT_ID is not defined') })(),
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET || (() => { throw new Error('GOOGLE_CLIENT_SECRET is not defined') })(),
    }),
    // Add any other authentication providers like email, GitHub, etc.
  ],
  pages: {
    signIn: '/login', // Redirect to a custom sign-in page
  },
  session: {
    strategy: 'jwt' as SessionStrategy, // Use JWT tokens for session management
  },
};
 
export default NextAuth(authOptions);