export async function verifyToken(token: string) {
  try {
    const res = await fetch(`${process.env.API_AUTH_URL}/api/user/verify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })

    const data = await res.text()

    return data === 'OK'
  } catch (error) {
    console.error('verifyToken', error)

    return false
  }
}
