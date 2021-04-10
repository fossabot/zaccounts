import { RedisClient } from '@/cache'

export async function ratelimit(token: string, limit: number, expire: number) {
  const current = Math.floor(Date.now() / expire / 1000)
  const key = `rl:${token}:${current}`
  const cur = parseInt(<any>await RedisClient.get(key)) || 0
  if (cur >= limit) throw new Error('Ratelimit hit')
  await RedisClient.multi().incr(key).expire(key, expire).exec()
  return limit - cur
}
