<template>
  <!-- <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
      dense
    >
      <div class="d-flex align-center">
        <v-img
          alt="Edt-Logo"
          class="shrink mr-2 can-click"
          contain
          :src="`${require(`@/assets/img/icon-egt-${$route.params.token}.png`)}`"
          transition="scale-transition"
          width="40"
          height="40"
          @click="()=>{if ($route.name!=='Index'){ $router.push({name: 'Index', params: {lang: $store.state.locale}})}}"
        />
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex">
        <v-btn
          class="d-md-flex d-none"
          v-for="(item, i) in navbar.filter(item=>!item.isPhone)"
          :key="i"
          depressed
          exact
          :color="'rgba(0, 0, 0, 0)'"
          :to="`/${$route.params.lang}/${$route.params.token}${item.link}`"
          @click="clickNavBtn"
        >
          {{ $t(item.text) }}
        </v-btn>
        <btn class="ml-3" :buttonText="$store.state.account? `${shortAddress} ${$t('logout')}` : `${$t('login')}`" :color="`primary_${$route.params.token}`" @clickBtn="log()"></btn>
        <v-menu
          open-on-hover
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ml-3"
              :color="`primary_${$route.params.token}`"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>
                mdi-translate
              </v-icon>
            </v-btn>
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
        
        <v-icon
          class="d-md-none d-flex ml-2"
          dark
          @click.stop="phoneNavShow = !phoneNavShow"
        >
          mdi-menu
        </v-icon>
      </div>
    </v-app-bar> -->

  <!-- <v-main id="main"> -->
  <!-- <div class="d-flex aligns-center justify-space-between" style="padding: 0 16px">
        <strong class="rem-14" style="letter-spacing: 5px; color: white">我要投資</strong>
        <DefiNav :items="headerNav" :active="'orderList'"></DefiNav>
      </div> -->
  <router-view />
  <!-- </v-main> -->

  <!-- <v-navigation-drawer
      v-model="phoneNavShow"
      fixed
      temporary
      right
      light
      hide-overlay
      style="top: 48px;"
    >
      <v-list dense>
        <v-list-item
          v-for="item in [...footer, ...navbar, { text: `registry`, link: '/registry', icon: `/icon-registry`}]"
          :key="item.text"
          :to="`/${$route.params.lang}/${$route.params.token}${item.link}`"
          exact
          @click="clickNavBtn"
        >
          <v-list-item-icon>
            <v-icon v-if="item.icon.includes('mdi')">{{ item.icon }}</v-icon>
            <img v-else :src="`${require(`@/assets/img${item.icon}-${$route.params.token}.png`)}`" width="20px" height="20px">
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ $t(item.text) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

  <!-- <v-footer
      app
      fixed
      color="white"
      :class="`primary_${$route.params.token}--text`"
      style="z-index: 10;"
    >
      <v-row>
        <v-col cols="3" class="d-none d-sm-block"></v-col>
        <v-col cols="6" sm="3" justify="center" align="center" class="can-click" :class="{'secondary':$route.path===item.link}" v-for="(item, i) in footer" :key="i">
          <router-link :to="`/${$route.params.lang}/${$route.params.token}${item.link}`" class="text-decoration-none" :class="`primary_${$route.params.token}--text`">
            <div class="w-100 h-100">
              <img :src="`${require(`@/assets/img${item.icon}-${$route.params.token}.png`)}`" width="30px">
              <div>{{ $t(item.text) }}</div>
            </div>
          </router-link>
        </v-col>
        <v-col cols="3" class="d-none d-sm-block"></v-col>
      </v-row>
    </v-footer> -->
  <!-- </v-app> -->
</template>

<script>
// import btn from '@/components/btn.vue';
import base from '@/mixin/base';
// import DefiNav from './components/defiNav.vue';
export default {
  name: 'App',
  mixins: [base],
  data: () => ({
    phoneNavShow: false,
    footer: [
      {
        text: `toDeposit`,
        link: '/deposit',
        icon: '/icon-deposit',
      },
      {
        text: `toBorrow`,
        link: '/borrow',
        icon: '/icon-borrow',
      },
    ],
    headerNav: [
      { text: 'orderList', link: '' },
      { text: 'myDeposit', link: '' },
      { text: 'depositRule', link: '' },
      { text: 'tokenSwap', link: '' },
    ],
    navbar: [
      // {
      //   text: `buyEGT`,
      //   link: '/egt',
      //   icon: '/icon-buy'
      // },
      // {
      //   text: `sellEGT`,
      //   link: '/egt/sell',
      //   icon: '/icon-sell'
      // },
      {
        text: `swapEGT`,
        link: '/egt/swap',
        icon: '/icon-bscegt',
        isPhone: true,
      },
    ],
    defiContract: null,
  }),
  components: {
    // btn,
    // DefiNav
  },
  computed: {
    shortAddress() {
      return `${this.$store.state.account.slice(
        0,
        6
      )}...${this.$store.state.account.slice(38)}`;
    },
  },
  methods: {
    async log() {
      if (this.$store.state.account) {
        this.$store.commit('clearInfo');
        this.$cookies.remove('address');
        this.$router.push({ name: 'Home' }).catch((err) => {
          err;
        });
      } else {
        if (window.ethereum) {
          await this.connectMetamask();
        } else {
          window.addEventListener(
            'ethereum#initialized',
            this.connectMetamask,
            {
              once: true,
            }
          );

          // If the event is not dispatched by the end of the timeout,
          // the user probably doesn't have MetaMask installed.
          setTimeout(this.connectMetamask, 2000); // 3 seconds
        }
        this.$forceUpdate();
      }
    },
    clickNavBtn(e) {
      if (!this.$store.state.account && this.$route.path !== '/calculator') {
        e.preventDefault();
        this.$toasted.error(this.$t('loginFirst'));
      }
    },
    changeLang(lang) {
      this.$store.commit('updateLang', lang);
      this.$i18n.locale = lang;
      this.$router
        .push({
          name: this.$route.name,
          params: { lang: lang, token: this.$route.params.token },
        })
        .catch((err) => err);
    },
    // async connectMetamask() {
    //   let _this = this
    //   if (window.ethereum){
    //     window.ethereum
    //       .request({ method: 'eth_requestAccounts' })
    //       .then(_this.handleAccountsChanged)
    //       .catch((err) => {
    //         if (err.code === 4001) {
    //           // EIP-1193 userRejectedRequest error
    //           // If this happens, the user rejected the connection request.
    //           this.$toasted.error('Please connect to MetaMask.');
    //         } else {
    //           console.error(err);
    //         }
    //       });
    //   }else{
    //     this.$toasted.error(this.$t('installMetamask'))
    //   }
    // },
    // async handleAccountsChanged(accounts){
    //   if (accounts.length === 0) {
    //     // MetaMask is locked or the user has not connected any accounts
    //     this.$toasted.error('Please connect to MetaMask.');
    //   } else if (accounts[0] !== this.$store.state.account) {
    //     this.$store.commit('updateAccount', accounts[0]);
    //     this.$cookies.set('address', accounts[0]);
    //     window.location.reload()
    //   }
    // },
    // checkChainId(chainId){
    //   let isEthereum = chainId === '0x1' || chainId === 1
    //   // let isEthereum = chainId === '0x4' || chainId === 4

    //   let isBsc = chainId === '0x38' || chainId === 56
    //   // let isBsc = chainId === '0x61' || chainId === 97
    //   this.$store.commit('updateChainId', isBsc);
    //   this.$store.commit('updateIsEth', isEthereum);
    //   if (!isBsc){
    //     if (this.$route.name !== 'Ethegt-send'){
    //       this.$toasted.error(this.$t('changeMainnet'));
    //     }
    //   }
    // }
  },
  unmounted() {},
};
</script>

<style lang="scss">
// layout
#main {
  background: radial-gradient(
    66.63% 124.83% at 66.63% 35.36%,
    #09209b 0%,
    #000000 100%
  );
  background-size: cover;
}
.card-wrap {
  padding: 40px 60px;
  box-shadow: 0 4px 16px 4px rgb(0 0 0 / 20%) !important;
  @media (max-width: 600px) {
    padding: 40px 20px;
  }
}
// common style
.text-shadow {
  text-shadow: 0 2px 5px #333;
}
.gas-text {
  font-size: 24px;
}
.can-click {
  cursor: pointer;
}
.toasted.toasted-primary.error {
  background-color: #e53935 !important;
}
.toasted.toasted-primary.default {
  background-color: #0abbb5 !important;
}
</style>
