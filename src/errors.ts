import { TError } from '@/api/core/schemas'

export enum SysErrors {
  OtherError,
  NotImplemented,
  AccessDenied,
  NotFound,
  RateLimitHit,
  AuthProviderNotEnabled,
  AlreadyLoggedIn,
  Require2FA,
  InvalidToken,
  ShouldBeAppSession
}

export class SysError extends Error {
  errno

  constructor(errno: SysErrors, message = SysErrors[errno]) {
    super()
    this.errno = errno
    this.message = message
  }
}

export function normalizeError(e: Error): TError {
  if (e instanceof SysError) {
    return { n: e.errno, m: e.message }
  }
  return { n: SysErrors.OtherError, m: e.message }
}
