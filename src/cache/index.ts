import Redis from 'ioredis'

export let RedisClient: Redis.Redis

export async function setupRedis(redisUrl: string) {
  const redis = new Redis(redisUrl)
  RedisClient = redis
}
