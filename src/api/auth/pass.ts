import { Type } from '@sinclair/typebox'
import { pbkdf2Async, randomBytesAsync } from '@/utils/crypto'
import { defineAuthProvider } from '@/api/auth/base'

export const PassAuth = defineAuthProvider({
  TSys: Type.Object({}),
  TLocal: Type.Object({
    hash: Type.String(),
    salt: Type.String()
  }),
  TVerify: Type.Object({
    pass: Type.String()
  }),
  TUpdate: Type.Object({
    pass: Type.String()
  }),
  TDetails: Type.Object({}),
  async verify(s, l, r) {
    const hash = Buffer.from(l.hash, 'base64')
    const salt = Buffer.from(l.salt, 'base64')
    const test = await pbkdf2Async(r.pass, salt, 1000, 16, 'sha512')
    return test.equals(hash)
  },
  async update(s, l, r) {
    const salt = await randomBytesAsync(16)
    const hash = await pbkdf2Async(r.pass, salt, 1000, 16, 'sha512')
    return {
      hash: hash.toString('base64'),
      salt: salt.toString('base64')
    }
  },
  details() {
    return {}
  }
})
