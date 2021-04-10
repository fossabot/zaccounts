import { Container } from '@/di'
import { SYM } from '@/symbols'
import Redis from 'ioredis'

export async function setupRedis(redisUrl: string) {
  const redis = new Redis(redisUrl)
  Container.provide(SYM.REDIS_CLIENT, redis)
}
