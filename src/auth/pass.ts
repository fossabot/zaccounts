import { Type } from '@sinclair/typebox'
import { addAuthProvider } from '@/auth/base'
import { pbkdf2Async, randomBytesAsync } from '@/utils/crypto'

const TVerifyParams = Type.Object({
  pass: Type.String()
})

const TLocal = Type.Object({
  hash: Type.String(),
  salt: Type.String()
})

addAuthProvider({
  name: 'pass',
  TVerifyParams,
  TUpdateParams: TVerifyParams,
  TDetails: Type.Object({}),
  TLocal,
  async verify(r, l) {
    const hash = Buffer.from(l.hash, 'base64')
    const salt = Buffer.from(l.salt, 'base64')
    const test = await pbkdf2Async(r.pass, salt, 1000, 16, 'sha512')
    return test.equals(hash)
  },
  async update(r) {
    const salt = await randomBytesAsync(16)
    const hash = await pbkdf2Async(r.pass, salt, 1000, 16, 'sha512')
    return {
      hash: hash.toString('base64'),
      salt: salt.toString('base64')
    }
  },
  async details() {
    return {}
  }
})
