import { Hub } from '@/api/core'
import { SysError, SysErrors } from '@/errors'

export const AppRoot = new Hub()

AppRoot.scope('.')
  .path('/app')
  .middleware(async (ctx) => {
    if (ctx.session?.type !== 'app')
      throw new SysError(SysErrors.ShouldBeAppSession)
  })
