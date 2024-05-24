import { NextResponse } from 'next/server'

import { useGetUsers } from '@/data/useGetUsers'

export async function GET() {
  const { getAllUsers } = useGetUsers()
  const users = await getAllUsers()

  return NextResponse.json({ users })
}
