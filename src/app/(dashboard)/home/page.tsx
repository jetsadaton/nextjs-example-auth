import { CardHeader } from '@mui/material'
import Card from '@mui/material/Card'

import Profile from './profile'
import { getSessionUser } from '@/data/getSessionUser'

export default async function Page() {
  const delay = (func: any, ms: number) => new Promise(resolve => setTimeout(() => resolve(func), ms))
  const user = (await delay(await getSessionUser(), 3000)) as any

  return (
    <>
      <h1 className='my-2'>Home page!</h1>
      <Card>
        <CardHeader title='Session in server side' className='pbe-4' />
      </Card>
      <h5> {JSON.stringify(user)}</h5>
      <Profile />
    </>
  )
}
