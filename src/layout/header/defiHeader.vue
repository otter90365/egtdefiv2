<script>
import btn from '../../components/btn.vue'
import accountActionMixin from '../../mixin/accountActionMixin'
import base from '../../mixin/base'
import DefiNav from '../../components/defiNav.vue'
import { borrowRouteHeader, depositRouteHeader } from '../../constant/header'
import RegistryDialog from '@/components/registryDialog.vue'
import DefiV2 from '@/plugins/defiV2'

const nameDir = [
  ...borrowRouteHeader,
  ...depositRouteHeader,
  { text: 'tokenSwap', navText: 'tokenSwapNav', routeName: 'Egt-swap' },
].reduce((prev, curr) => {
  prev[curr.routeName] = curr.text
  return prev
}, {})

export default {
  components: { btn, DefiNav, RegistryDialog },
  mixins: [base, accountActionMixin],
  mounted() {
    this.memberValidate()
    this.routeValidate()
  },
  computed: {
    token() {
      return this.$route.params.token
    },
  },
  data() {
    return {
      items: [
        {
          text: 'orderList',
          navText: 'orderListNav',
          routeName: 'Defi-deposit-list',
          link: { name: 'Defi-deposit-list' },
        },
        {
          text: 'myDeposit',
          navText: 'myDepositNav',
          routeName: 'Defi-deposit-orders',
          link: { name: 'Defi-deposit-orders' },
        },
        {
          text: 'depositRule',
          navText: 'depositRuleNav',
          routeName: 'Defi-deposit-rules',
          link: { name: 'Defi-deposit-rules' },
        },
        {
          text: 'tokenSwap',
          navText: 'tokenSwapNav',
          routeName: 'Egt-swap',
          link: {
            name: 'Egt-swap',
            params: {
              lang: this.$store.state.locale,
              token: this.$route.params.token,
            },
          },
        },
      ],
      nameDir: {
        'Defi-registry': 'registry',
        ...nameDir,
      },
      isMember: false,
      lastRoute: 'Defi-deposit-list',
      registryDialogIsOpen: false,
    }
  },
  watch: {
    '$route.name'() {
      this.routeValidate()
    },
  },
  methods: {
    changeLang(lang) {
      this.$store.commit('updateLang', lang)
      this.$i18n.locale = lang
      this.$router.push({
        name: this.$route.name,
        params: { lang: lang, token: this.$route.params.token },
      })
    },
    async memberValidate() {
      this.defiContract = await new DefiV2()
      this.isMember = await this.defiContract.isMember(
        this.$store.state.account
      )
    },
    toMain() {
      this.$router.push({
        name: 'Index',
        params: { lang: this.$store.state.locale },
      })
    },
    toSwap() {
      if (this.$store.state.account) {
        this.$router.push({
          name: 'Egt-swap',
          params: {
            lang: this.$store.state.locale,
            token: this.$route.params.token,
          },
        })
      }
    },
    openRegistry() {
      if (!this.isMember || process.env.NODE_ENV === 'development') {
        this.$store.commit('updateRegistryOpen', true)
      }
    },
    onCancel() {
      this.$store.commit('updateRegistryOpen', false)
      this.$router.push({ name: 'Index' })
    },
    routeValidate() {
      const routeName = this.$route.name
      if (routeName.startsWith('Defi-borrow')) {
        this.items = [
          ...borrowRouteHeader,
          {
            text: 'tokenSwap',
            navText: 'tokenSwapNav',
            routeName: 'Egt-swap',
            link: {
              name: 'Egt-swap',
              params: {
                lang: this.$store.state.locale,
                token: this.$route.params.token,
              },
            },
          },
        ]
      } else if (routeName.startsWith('Defi-deposit')) {
        this.items = [
          ...depositRouteHeader,
          {
            text: 'tokenSwap',
            navText: 'tokenSwapNav',
            routeName: 'Egt-swap',
            link: {
              name: 'Egt-swap',
              params: {
                lang: this.$store.state.locale,
                token: this.$route.params.token,
              },
            },
          },
        ]
      }

      if (routeName in nameDir) {
        this.lastRoute = routeName
      }
    },
    changeHeaderType() {
      if (this.lastRoute.includes('deposit')) {
        this.$router.push({name: 'Defi-borrow-create'})
      } else {
        this.$router.push({name: 'Defi-deposit-list'})
      }
    }
  },
}
</script>
<template>
  <v-app-bar class="app-bar"
    app
    :src="require('@/assets/img/background2.png')"
    dark
    :height="$store.state.nowWidth <= 960 ? 160 : 179"
    dense>
    <RegistryDialog @cancel="onCancel"
      @success="memberValidate" />
    <div class="app-bar-content">
      <img :src="require(`@/assets/img/borrow/${token}.svg`)"
        :alt="`${token}.svg`"
        class="token-display" />
      <div class="enabled-status"
        :style="{
          color: isMember ? '#5AB95B' : '#a70000'
        }"
        @click="openRegistry()">
        {{ isMember? $t('enabled'): $t('disabled') }}
      </div>
      <div class="d-flex logo-wrap d-md-none align-center">
        <div class="d-flex align-center can-click ml-2" @click="toMain()">
          <v-img
            alt="Edt-Logo"
            class="shrink mr-0 mr-md-2"
            contain
            src="@/assets/img/logo-egtdefi.png"
            transition="scale-transition"
            :height="$store.state.nowWidth > 960 ? 60 : 30"
          />
          <span class="d-flex flex-column font-weight-regular">
            <span class="rem-2 font-weight-black">DEFI<span class="font-weight-regular ml-1" style="font-size: 10px;">Smart Contract</span></span>
            <span style="font-size: 10px;">{{ $t('cryptoLendingPlatform') }}</span></span
          >
        </div>
        <v-spacer />
        <div class="d-flex d-md-none"
          style="margin-left: auto">
          <btn class="no-padding-btn"
            isText
            :buttonText="
              $store.state.account
                ? `${shortAddress} ${$t('logout')}`
                : `${$t('login')}`
            "
            :color="'white'"
            @clickBtn="connectToggle()"></btn>
        </div>
      </div>
      <div class="header-wrapper">
        <div class="d-flex d-md-none align-center route-name can-click" @click="changeHeaderType()">
          <strong class="mr-1">{{
            $t(nameDir[lastRoute])
          }}</strong>
          <div class="white black--text rem-0 rounded font-weight-bold" style="padding: 2px 4px 0px;">{{ $t('switch') }}</div>
        </div>
        <DefiNav :items="items"
          :active="lastRoute" />
        <div class="d-none d-md-flex">
          <btn class="no-padding-btn"
            isText
            :buttonText="
              $store.state.account
                ? `${shortAddress} ${$t('logout')}`
                : `${$t('login')}`
            "
            :color="'white'"
            @clickBtn="connectToggle()"></btn>
        </div>
      </div>
    </div>
  </v-app-bar>
</template>
<style scoped lang="scss">
.header-wrapper {
  padding: 0 48px 0 99px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  @include dai_vuetify_md {
    height: auto;
    padding: 18px 20px 0;
  }

  .route-name {
    flex-wrap: wrap;
    font-size: 23px;
  }
}

.logo-wrap {
  padding: 10px;
  border-bottom: 1px #e8e8e8 solid;

  @include dai_vuetify_md {
    width: 100%;
    box-sizing: border-box;
  }
}

.enabled-status {
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
  transform: translateY(50%);
  background-color: #fff;
  width: 153px;
  padding-left: 28px;
  color: #a70000;
  height: 51px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 26px;
  border-radius: 27px 0 0 27px;
  font-weight: bold;

  @include dai_vuetify_md {
    height: 24px;
    width: 71px;
    font-size: 13px;
    padding-left: 13px;
  }
}

.app-bar-content {
  height: 100%;
  width: 100%;

  @include dai_vuetify_md {
    width: 100vw;
  }
}

.token-display {
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateX(-50%) translateY(50%);
  z-index: 20;

  @include dai_vuetify_md {
    transform: translateY(50%) translateX(20px);
    width: 34px;
  }
}
</style>
