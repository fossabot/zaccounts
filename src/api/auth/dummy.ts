import { Type } from '@sinclair/typebox'
import { defineAuthProvider } from '@/api/auth/base'

export const DummyAuth = defineAuthProvider({
  TSys: Type.Object({}),
  TLocal: Type.Object({}),
  TVerify: Type.Object({}),
  TUpdate: Type.Object({}),
  TDetails: Type.Object({}),
  async verify() {
    return false
  },
  async update() {
    return {}
  },
  details() {
    return {}
  }
})
