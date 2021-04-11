import { AuthUserCred } from '@/api/auth'

export interface UserAppInfo {
  storage: Record<string, any>
  perms: Record<string, string[]>
}

export interface UserDocument {
  _id: string
  name: string // username
  disp: string // nickname
  emails: string
  cred: AuthUserCred
  require2FA: boolean

  apps: Record<string, UserAppInfo>
}
