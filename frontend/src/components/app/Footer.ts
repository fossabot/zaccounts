import Vue from 'vue'
import { mdiGit, mdiClockOutline } from '@mdi/js'
const COMMIT_URL = `https://github.com/zzs-web/zaccounts/commit/${BUILD.git.hash}`
const BUILD_TEXT =
  BUILD.git.hash.substr(0, 7) + `:` + BUILD.git.branch + '@' + BUILD.hostname
export default Vue.extend({
  name: 'AppFooter',
  data: () => ({
    COMMIT_URL,
    BUILD_TEXT,
    buildTime: BUILD.ts.toString(),
    mdiGit,
    mdiClockOutline
  }),
  mounted() {
    this.buildTime = new Date(BUILD.ts).toLocaleString()
  }
})
