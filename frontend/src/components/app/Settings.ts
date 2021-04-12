import Vue from 'vue'
import { mdiClose } from '@mdi/js'
import { sync } from 'vuex-pathify'
import AppSettingsTheme from '@/components/app/settings/Theme.vue'

export default Vue.extend({
  name: 'AppSettings',
  components: { AppSettingsTheme },
  data() {
    return {
      mdiClose
    }
  },
  computed: {
    drawers: sync('drawers')
  }
})
