import Vue from 'vue'
import { sync } from 'vuex-pathify'
import { mdiGithub, mdiCog } from '@mdi/js'

export default Vue.extend({
  name: 'AppBar',
  data: () => ({
    mdiGithub,
    mdiCog
  }),
  computed: {
    drawers: sync('drawers')
  }
})
