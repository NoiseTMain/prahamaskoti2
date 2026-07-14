import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Bez nakonfigurovaného Redis se rate limiting přeskočí (např. lokální vývoj)
    return null
  }
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '10 m'), // max 5 poptávek / 10 minut / IP
      analytics: true,
      prefix: 'maskoti-praha:inquiry',
    })
  }
  return ratelimit
}

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; remaining?: number }> {
  const limiter = getRatelimit()
  if (!limiter) return { success: true }
  const { success, remaining } = await limiter.limit(identifier)
  return { success, remaining }
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]!.trim()
  return headers.get('x-real-ip') ?? '127.0.0.1'
}
