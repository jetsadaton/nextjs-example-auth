import { NextResponse } from 'next/server'

import { useGetUsers } from '@/data/useGetUsers'

export async function GET() {
  const { createTest } = useGetUsers()

  try {
    const users = await createTest()

    return NextResponse.json({ users })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error })
  }
}
