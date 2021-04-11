import { buildScopeTree } from '@/api/core'
import { Session } from '@/api/core/context'
import { RedisClient } from '@/cache'
import { Collections } from '@/db'
import { SysError, SysErrors } from '@/errors'
import { MAGICS } from '@/magics'

async function generateScopeTree(user: string, app: string) {
  const key = `apps.${app}.perms.${MAGICS.appId}`
  const result = await Collections.users.findOne(
    { _id: user },
    { projection: { [key]: 1 } }
  )
  if (!result) throw new SysError(SysErrors.NotFound)
  const scopes = result.apps[app].perms[MAGICS.appId]
  return buildScopeTree(scopes)
}

export async function generateSession(token: string): Promise<Session> {
  const { value } = await Collections.tokens.findOneAndUpdate(
    { _id: token },
    { $set: { atime: Date.now() } }
  )
  if (!value) throw new SysError(SysErrors.InvalidToken)
  if (value.type === 'user') {
    return {
      type: 'user',
      user: value.user,
      admin: value.admin,
      scopes: true,
      token
    }
  } else if (value.type === 'app') {
    return {
      type: 'app',
      user: value.user,
      app: value.app,
      scopes: await generateScopeTree(value.user, value.app),
      token
    }
  }
  throw new SysError(SysErrors.InvalidToken)
}

export async function getSessionByToken(token: string): Promise<Session> {
  const cacheKey = `tk:${token}`
  const result = await RedisClient.get(cacheKey)
  if (result) {
    const cached = JSON.parse(result)
    return cached
  } else {
    const session = await generateSession(token)
    await RedisClient.multi()
      .set(cacheKey, JSON.stringify(session))
      .expire(cacheKey, 1000)
      .exec()
    return session
  }
}
