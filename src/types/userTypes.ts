import type { ThemeColor } from '@/@core/types'

export type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
  billing: string
}

// id: number
// name: string
// username: string
// password: string
// age: string
// tel: string
// role_id: string
// is_active: string
// image_id: string
// createdAt: string
// updatedAt: string

export type UserDetailResponse = {
  token: string
  username: string
  userId: string
  org: string
  unitId: string
  unitDesc: string
  userType: string
  image: string
  userNameEng: string
  email: null
}

export type UserJwtType = {
  nameid: string
  UserName: string
  UnitId: string
  ORG: string
  UserType: string
  TrackingStatus: string
  nbf: number
  exp: number
  iat: number
}
