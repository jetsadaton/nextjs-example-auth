'use client'

import { Card, CardHeader } from '@mui/material'
import { useSession } from 'next-auth/react'

export type ProfileProps = {}

const Profile = ({}: ProfileProps) => {
  const { data: session } = useSession()

  return (
    <div>
      <Card>
        <CardHeader title='Session in client side' className='pbe-4' />
      </Card>
      <h5>{JSON.stringify(session?.user)}</h5>
    </div>
  )
}

export default Profile
