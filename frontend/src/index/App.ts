import Vue from 'vue'
import AppBar from '@/components/app/Bar.vue'
import AppNav from '@/components/app/Nav.vue'
import AppSettings from '@/components/app/Settings.vue'
import AppFooter from '@/components/app/Footer.vue'

export default Vue.extend({
  name: 'App',
  components: { AppBar, AppNav, AppSettings, AppFooter }
})
