import { Collections } from '@/db'
import crc from 'crc'

const base62charset = String.fromCharCode(
  ...[...new Array(10)].map((x, i) => '0'.charCodeAt(0) + i),
  ...[...new Array(26)].map((x, i) => 'A'.charCodeAt(0) + i),
  ...[...new Array(26)].map((x, i) => 'a'.charCodeAt(0) + i)
)

const base62table: Record<string, number> = {}

for (let i = 0; i < base62charset.length; i++) {
  base62table[base62charset[i]] = i
}

function int32tobase62(i: number) {
  const digits = []
  for (; i; i = Math.floor(i / 62)) digits.push(i % 62)
  while (digits.length < 6) digits.push(0)
  return digits
    .reverse()
    .map((x) => base62charset[x])
    .join('')
}

function base62toint32(s: string) {
  let a = 0
  for (let i = 0; i < 6; i++) a = a * 62 + base62table[s[i]]
  return a
}

const TokenTypes = {
  u: 'User Token',
  a: 'App Token'
}

type TokenType = keyof typeof TokenTypes

export function generateToken(type: TokenType) {
  const body = [...new Array(30)]
    .map(() => base62charset[Math.floor(Math.random() * 62)])
    .join('')
  const footer = int32tobase62(crc.crc32(body))
  return `za${type}_${body}${footer}`
}

export function verifyToken(token: string) {
  if (token.length !== 40 || token[3] !== '_' || !token.startsWith('za'))
    return false
  const type = token[2]
  if (!(type in TokenTypes)) return false
  const body = token.substring(4, 34)
  const footer = token.substring(34)
  if (crc.crc32(body) !== base62toint32(footer)) return false
  return true
}

export async function generateUserToken(user: string) {
  const token = generateToken('u')
  await Collections.tokens.insertOne({
    _id: token,
    user,
    type: 'user',
    admin: false
  })
  return token
}

export async function generateAppToken(user: string, app: string) {
  const token = generateToken('a')
  await Collections.tokens.insertOne({
    _id: token,
    user,
    app,
    type: 'app'
  })
  return token
}
