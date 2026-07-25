import { createApp } from 'vue'

// Inter font (loaded via Fontsource)
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// Material Design Icons (default Vuetify icon set — will be swapped/augmented
// with Phosphor Icons in later phases where custom icons are needed).
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'

const vuetify = createVuetify()

createApp(App).use(vuetify).mount('#app')
