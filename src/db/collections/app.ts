export interface AppPermission {
  name: string
  desc: string
}

export interface AppDocument {
  _id: string // AppID must be string!
  name: string
  desc: string
  perms: AppPermission[]
}
