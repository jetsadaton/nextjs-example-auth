import { NextResponse } from 'next/server'

import Tracker from '@/libs/tracker'

export async function GET() {
  try {
    const tracker = new Tracker()

    await tracker.sendMessages('sysadm', {
      Headers: 'Headers',
      Body: 'Body',
      Footer: 'Footer',
      TimeStamp: new Date().toISOString()
    })

    return new Response('OK')
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 401
    })
  }
}
