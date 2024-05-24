'use client'
import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { signIn } from 'next-auth/react'

import Loading from '@/app/(dashboard)/loading'

export type AuthPageProps = {}

const AuthPage = ({}: AuthPageProps) => {
  // Hooks
  const searchParams = useSearchParams()
  const router = useRouter()

  // Vars
  const token = searchParams.get('jwttoken')

  useEffect(() => {
    const login = async () => {
      await signIn('jwttoken', { token })
    }

    if (token !== null) {
      login().catch(e => {
        throw new Error(e)
      })
    } else {
      router.push('/login')
    }
  }, [])

  return (
    <>
      <Loading />
    </>
  )
}

export default AuthPage
