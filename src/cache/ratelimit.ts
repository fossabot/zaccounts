import { Redis } from 'ioredis'

export async function ratelimit(
  redis: Redis,
  token: string,
  limit: number,
  expire: number
) {
  const current = Math.floor(Date.now() / expire / 1000)
  const key = `rl:${token}:${current}`
  const cur = await redis.get(key)
  if (cur && parseInt(cur) >= limit) throw new Error('Ratelimit hit')
  await redis.multi().incr(key).expire(key, expire).exec()
}
