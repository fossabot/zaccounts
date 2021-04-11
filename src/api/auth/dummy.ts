import { Type } from '@sinclair/typebox'
import { defineAuthProvider } from '@/api/auth/base'

export const DummyAuth = defineAuthProvider({
  TSys: Type.Object({}),
  TLocal: Type.Object({}),
  TVerify: Type.Object({}),
  TUpdate: Type.Object({}),
  TDetails: Type.Object({}),
  verify() {
    return false
  },
  update() {
    return {}
  },
  details() {
    return {}
  }
})
