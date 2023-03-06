import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#0abbb5',
        primary_usdt: '#0abbb5',
        primary_tbt: '#991594',
        secondary: '#262626',
        purple: '#991594',
        darkPurple: '#4F138A',
        lightGrey: '#D8D8D8',
        pink: 'FF008A',
        darkGreen: '#0C5951',
        green: '#2FA38E',
      },
    },
  },
});
