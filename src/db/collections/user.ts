import { AuthUserCred } from '@/api/auth'

export interface UserEmail {
  email: string
  verified: boolean
}

export interface UserAppInfo {
  storage: Record<string, any>
  perms: Record<string, string[]>
}

export interface UserDocument {
  _id: string
  name: string // username
  disp: string // nickname
  emails: UserEmail[]
  cred: AuthUserCred
  require2FA: boolean

  apps: Record<string, UserAppInfo>
}
