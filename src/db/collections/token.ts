export interface UserTokenDocument {
  _id: string
  user: string
  type: 'user'
  admin?: boolean
}

export interface AppTokenDocument {
  _id: string
  user: string
  app: string
  type: 'app'
}

export type TokenDocument = UserTokenDocument | AppTokenDocument
