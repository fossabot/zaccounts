import { Type } from '@sinclair/typebox'
import { randomBytesAsync } from '@/utils/crypto'
import { defineAuthProvider } from '@/api/auth/base'
import { createHmac } from 'crypto'

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
    const hmac = createHmac('sha256', salt)
    hmac.update(r.pass)
    const test = hmac.digest()
    return test.equals(hash)
  },
  async update(s, l, r) {
    const salt = await randomBytesAsync(16)
    const hmac = createHmac('sha256', salt)
    hmac.update(r.pass)
    const hash = hmac.digest()
    return {
      hash: hash.toString('base64'),
      salt: salt.toString('base64')
    }
  },
  details() {
    return {}
  }
})
