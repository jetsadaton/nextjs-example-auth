import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
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
