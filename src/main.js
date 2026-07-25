import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Inter font (loaded via Fontsource)
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

// Vuetify — only the <v-app> / <v-main> shell is used from Vuetify; all UI
// primitives are custom Base* components styled with our own design tokens.
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// Design tokens must load before any component styles so component CSS
// can reference the CSS custom properties defined here.
import './styles/tokens.css'
import './styles/global.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'audit',
    themes: {
      audit: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#8B5CF6',   // accent-end (violet)
          secondary: '#F43F5E', // accent-start (rose)
          'on-surface': '#0F172A',
          'on-background': '#0F172A',
        },
      },
    },
  },
})

createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')
