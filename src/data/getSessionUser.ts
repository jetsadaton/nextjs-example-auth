import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'

export const getSessionUser = async () => {
  const session = await getServerSession(authOptions)

  return session?.user
}
