import { promisify } from 'util'
import crypto from 'crypto'

export const randomBytesAsync = promisify(crypto.randomBytes)
export const pbkdf2Async = promisify(crypto.pbkdf2)
