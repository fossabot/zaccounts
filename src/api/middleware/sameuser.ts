import { Context } from '@/api/core/context'

export function SameUser(ctx: Context<{ user: string }>) {
  if (ctx.session?.type === 'user' && ctx.session.admin) return
  if (ctx.session?.user !== ctx.payload.user) throw new Error('Access denied')
}
