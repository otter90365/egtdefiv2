<template>
  <div class="egt-index">
    <div class="bg"></div>
    <v-container v-if="!disclaimerIsShow">
      <v-row>
        <v-col cols="12" class="d-md-none ">
          <div class="white--text" style="font-size: 10px">
            {{ $t('sideNavSubTitle').join(' ') }}
          </div>
          <div style="color: #4098FF; font-weight: bold;" class="rem-6" v-html="$t('sideNavSlogan')">
          </div>
        </v-col>
        <v-col cols="12" class="d-none d-md-flex justify-end mb-12">
          <btn
            class="no-padding-btn"
            isText
            :buttonText="
              $store.state.account
                ? `${shortAddress} ${$t('logout')}`
                : `${$t('login')}`
            "
            :color="'white'"
            @clickBtn="connectToggle()"
          ></btn>
          <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
          <span class="no-padding-btn">
            <v-btn color="white" v-bind="attrs" v-on="on" text>
              <v-icon dark>
                mdi-translate
              </v-icon>
            </v-btn>
          </span>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in $store.state.langs"
            :key="index"
            class="can-click"
            @click="changeLang(item)"
          >
            <v-list-item-title>{{ $t(item) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-card
          class="d-flex flex-column align-start py-3 py-md-10 mb-6 pl-md-9 pl-4 card-wrapper"
          :img="`${require(`@/assets/img/img-${card.token}-market.png`)}`"
          v-for="card in cardData"
          :key="card.token"
          @click="toLink(card.token)"
        >
          <logo
            class="mb-md-5 mb-4"
            :name="card.token"
            :background="card.logoBg"
            :img="`icon-${card.token}-text.png`"
          ></logo>
          <strong class="rem-md-18 rem-9 white--text">
            {{ $t('investAmount') }}
          </strong>
          <strong class="rem-md-18 rem-9 text-start" :class="`white--text`">
            {{ totalAmount[card.token].toLocaleString() }}
            {{ card.token.toUpperCase() }}
          </strong>
          <div class="token-water-mark">
            {{ card.token.toUpperCase() }}
          </div>
          <!-- <btn
            :gradientColor="
              `linear-gradient(to right, ${card.gradient[0]}, ${card.gradient[1]})`
            "
            :buttonText="`${card.token.toUpperCase()} 借貸市場`"
            isRounded
            :height="$store.state.nowWidth > 960 ? 60 : 40"
            @clickBtn="toLink(card.token)"
          ></btn> -->
        </v-card>
      </v-row>
      <v-row style="position: relative">
        <v-col class="justify-center d-flex" cols="12">
          <span
            class="white--text disclaimer-link"
            @click="updateDisclaimerIsShow"
          >
            {{ $t('disclaimer') }}
          </span>
        </v-col>
      </v-row>
    </v-container>
    <disclaimer v-else @close="updateDisclaimerIsShow" />
  </div>
</template>
<script>
import logo from '@/components/logo.vue';
// optional style for arrows & dots
import btn from '@/components/btn.vue';
import disclaimer from './Disclaimer.vue'
import base from '@/mixin/base';
import accountActionMixin from '@/mixin/accountActionMixin';
import Defi from '@/plugins/defi.js';
import DefiV2 from '@/plugins/defiV2';
import { mapGetters, mapMutations } from 'vuex'
export default {
  mixins: [base, accountActionMixin],
  data() {
    return {
      defiContract: null,
      defiContract2: null,
      slides: [
        {
          image: 'banner1.png',
        },
        {
          image: 'banner1.png',
        },
        {
          image: 'banner1.png',
        },
        {
          image: 'banner1.png',
        },
      ],
      cardData: [
        {
          token: 'tbt',
          color: 'Purple',
          gradient: ['#27ABC8', '#020C4F'],
          logoBg:
            'radial-gradient(66% 66% at 70% 34%, #27ABC8 0%, #020C4F 100%)',
        },
        {
          token: 'usdt',
          color: 'Green',
          gradient: ['#4c847c', '#0C5951'],
          logoBg:
            'radial-gradient(66% 66% at 70% 34%, #00A77B 0%, #007959 100%)',
        },
      ],
      totalAmount: {
        usdt: 0,
        tbt: 0,
      },
    };
  },
  components: {
    logo,
    btn,
    disclaimer,
  },
  computed: {
    ...mapGetters(['disclaimerIsShow'])
  },
  methods: {
    ...mapMutations(['updateDisclaimerIsShow']),
    changeLang(lang) {
      this.$store.commit('updateLang', lang);
      this.$i18n.locale = lang;
      this.$router.push({
        name: this.$route.name,
        params: { lang: lang, token: this.$route.params.token },
      });
    },
    toLink(token) {
      this.$router
        .push({
          name: 'lang-token',
          params: { lang: this.$store.state.locale, token: token },
        })
        .catch(() => {});
    },
    toSwapWeb() {
      window.open(`https://tbtswap.com/${this.$store.state.locale}`);
    },
    async getTotalAmount() {
      try {
        await this.$store.commit('updateCurrToken', 'usdt');
        await this.$store.dispatch('getDefiContract');
        this.defiContract = new Defi();
        this.defiContract2 = new DefiV2()

        const v1Usdt = await this.defiContract.getTotalAmount()
        const v2Usdt = await this.defiContract2.getTotalAmount()
        this.totalAmount.usdt = +v1Usdt + +v2Usdt;
      } catch (error) {
        this.totalAmount.usdt = 0;
        console.log('error', error);
      }
      try {
        await this.$store.commit('updateCurrToken', 'tbt');
        await this.$store.dispatch('getDefiContract');

        this.defiContract = new Defi();
        this.defiContract2 = new DefiV2()
        const v1tbt = await this.defiContract.getTotalAmount()
        const v2tbt = await this.defiContract2.getTotalAmount()
        this.totalAmount.tbt = +v1tbt + +v2tbt;
      } catch (error) {
        this.totalAmount.tbt = 0;
        console.log('error', error);
      }
    },
  },
  async mounted() {
    await this.getTotalAmount();
  },
};
</script>
<style lang="scss" scoped>
.egt-index {
  min-height: 100vh;
  padding: 70px 10%;
  @include dai_vuetify_md {
    padding: 0 27px;
  }
  position: relative;
  background: radial-gradient(
    66.63% 124.83% at 66.63% 35.36%,
    #09209b 0%,
    #000000 100%
  );
  @include dai_vuetify_md {
    background: radial-gradient(
      150.67% 77.46% at 49.88% 22.54%,
      #09209b 0%,
      #000000 100%
    );
  }
  .bg {
    background: url('../assets/img/background.svg') no-repeat right;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    mix-blend-mode: overlay;
    @include dai_vuetify_md {
      display: none;
    }
  }
}

.card-wrapper {
  background-position: bottom !important;
  cursor: pointer;
  width: 605px;
  margin: 0 auto;
  strong {
    text-shadow: 0px 3.33773px 3.33773px rgba(0, 0, 0, 0.25);
  }
  box-shadow: 8px 11 9px rgba(0, 0, 0, 0.3),
    inset 0px 6px 6px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
}

.token-water-mark {
  position: absolute;
  right: 31px;
  top: 0;
  line-height: 70px;
  font-size: 106px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  @include dai_vuetify_md {
    font-size: 69px;
    right: 10px;
  }
}
.disclaimer-link {
  cursor: pointer;
  text-decoration: underline;
}
</style>
