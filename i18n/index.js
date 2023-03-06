import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '../src/store/index.js';
import tw from './tw.js';
// import jp from './jp.js';
import chs from './chs.js'
import en from './en.js';

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: store.state.locale,
  fallbackLocale: "chs",
  messages: {
    tw,
    // jp,
    chs,
    en,
  },
  //關閉黃色警告
  silentTranslationWarn: true
});

export default i18n