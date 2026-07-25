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

// Design tokens must load before any component styles so component CSS
// can reference the CSS custom properties defined here.
import './styles/tokens.css'
import './styles/global.css'

import App from './App.vue'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'audit',
    themes: {
      audit: {
        dark: false,
        colors: {
          // Vuetify semantic slots
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#8B5CF6',   // accent-end (violet)
          secondary: '#F43F5E', // accent-start (rose)
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',

          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-surface': '#0F172A',
          'on-background': '#0F172A',

          // Project-specific tokens exposed to Vuetify as named colors
          // so components can use `color="text-primary"` etc. when useful.
          'text-primary':   '#0F172A',
          'text-secondary': '#64748B',
          'text-tertiary':  '#94A3B8',
          'border-subtle':  '#F1F5F9',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'pill',
      class: 'text-none',
      variant: 'flat',
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      rounded: 'md',
      color: 'primary',
    },
  },
})

createApp(App).use(vuetify).mount('#app')
