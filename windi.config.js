/* eslint-disable import/no-default-export */
/* eslint-disable global-require */
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['**/*.{html,jsx}'],
    exclude: ['node_modules', '.git', 'dist'],
  },
  plugins: [
    require('@windicss/plugin-animations')({
      settings: {
        animatedSpeed: 1000,
        heartBeatSpeed: 1000,
        hingeSpeed: 2000,
        bounceInSpeed: 750,
        bounceOutSpeed: 750,
        animationDelaySpeed: 1000,
      },
    }),
  ]
})
