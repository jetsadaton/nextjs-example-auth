import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')

    const res = await fetch(`${process.env.API_AUTH_URL}/api/user/verify`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    })

    return new Response(res.body)
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 401
    })
  }
}
