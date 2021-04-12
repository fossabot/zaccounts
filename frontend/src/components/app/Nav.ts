import Vue from 'vue'
import { mdiHome, mdiAccountMultiple, mdiFormatListText } from '@mdi/js'
import { sync } from 'vuex-pathify'

export default Vue.extend({
  name: 'AppNav',
  data() {
    return {
      links: [
        { to: '/', icon: mdiHome, text: 'Home' },
        { to: '/member', icon: mdiAccountMultiple, text: 'Members' },
        { to: '/blog', icon: mdiFormatListText, text: 'Blog' }
      ]
    }
  },
  computed: {
    drawers: sync('drawers')
  }
})
