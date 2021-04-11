export interface BaseTokenDocument {
  _id: string
  user: string
  type: string
  atime?: number
}

export interface UserTokenDocument extends BaseTokenDocument {
  type: 'user'
  admin?: boolean
}

export interface AppTokenDocument extends BaseTokenDocument {
  type: 'app'
  app: string
}

export interface PersonalAccessTokenDocument extends BaseTokenDocument {
  type: 'pat'
  scopes: string[]
}

export type TokenDocument =
  | UserTokenDocument
  | AppTokenDocument
  | PersonalAccessTokenDocument
