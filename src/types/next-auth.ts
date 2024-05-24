// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  // eslint-disable-next-line lines-around-comment
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      // eslint-disable-next-line lines-around-comment
      /** The user's postal address. */
      name: string
      id: string
      email: string
      role: string
      org: string
      unitId: string
      trackingStatus: string
      jwtToken: string
    }
  }
}
