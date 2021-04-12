interface IBuildInfo {
  git: {
    branch: string
    hash: string
  }
  hostname: string
  ts: number
}

declare const BUILD: IBuildInfo
