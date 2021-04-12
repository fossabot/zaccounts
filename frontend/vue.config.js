/* eslint-disable @typescript-eslint/no-var-requires */
const cp = require('child_process')
const os = require('os')
const { DefinePlugin } = require('webpack')

function run(cmd) {
  return cp.execSync(cmd).toString().trim()
}

function getGitInfo() {
  return {
    branch: run('git rev-parse --abbrev-ref HEAD'),
    hash: run('git rev-parse HEAD')
  }
}

module.exports = {
  pages: {
    index: {
      entry: 'src/index/main.ts',
      title: 'ZAccounts'
    },
    embed: {
      entry: 'src/embed/main.ts',
      title: 'ZAccounts Embedded Page'
    }
  },
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        BUILD: JSON.stringify({
          git: getGitInfo(),
          hostname: os.hostname(),
          ts: Date.now()
        })
      })
    ]
  }
}
