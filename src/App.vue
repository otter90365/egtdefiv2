<template>
  <v-app class="app" :class="$store.state.locale">
    <router-view name="header"></router-view>

    <v-navigation-drawer
      v-model="drawer"
      app
      mobile-breakpoint="960"
      width="531"
      class="pl-12 pt-12"
    >
      <div class="d-flex flex-column" style="height: 100%">
        <div class="d-flex align-center">
          <v-img
            alt="Edt-Logo"
            class="shrink mr-0 mr-md-2 can-click"
            contain
            src="@/assets/img/logo-egtdefi.png"
            transition="scale-transition"
            :height="60"
            @click="toMain()"
          />
          <span
            style="color: #4D4D4D"
            class="d-flex flex-column font-weight-regular"
            ><span class="rem-2">Absolute DEFI</span
            ><span class="rem-7">{{ $t('cryptoLendingPlatform') }}</span></span
          >
        </div>
        <router-view name="sidenav" />
      </div>
    </v-navigation-drawer>

    <v-main id="main">
      <router-view />
    </v-main>
    <div
      v-if="$store.state.nowWidth <= 960"
      class="d-md-none d-flex justify-center"
      style="position: fixed;bottom: 20px; width: 100vw;"
    >
      <router-view name="toolbar" />
    </div>
  </v-app>
</template>

<script>
import base from '@/mixin/base';
import accountActionMixin from '@/mixin/accountActionMixin';
export default {
  name: 'App',
  mixins: [base, accountActionMixin],
  data: () => ({
    drawer: null,
  }),
  async mounted() {
    // console.log('==========default==========')
    let _this = this;

    this.$store.commit('updateNowWidth', document.body.clientWidth);
    window.onresize = () => {
      this.$store.commit('updateNowWidth', document.body.clientWidth);
    };

    if (window.ethereum) {
      // metamask disconnect
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.$cookies.remove('address');
          this.$store.commit('clearInfo');
          this.$toasted.error(_this.$t('connectionBreak'));
        } else {
          this.$store.commit('updateAccount', accounts[0]);
          this.$cookies.set('address', accounts[0]);
          this.$toasted.show(_this.$t('changeWallet'));
          window.location.reload();
        }
      });

      // get chain id
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.checkChainId(chainId);
      window.ethereum.on('chainChanged', _this.checkChainId);

      if (!window.ethereum.selectedAddress) {
        let address = this.$cookies.get('address');
        if (address) {
          this.$cookies.remove('address');
        }
      }
    }
  },
  methods: {
    async toMain() {
      await this.$router.push({
        name: 'Index',
        params: { lang: this.$store.state.locale },
      });
    },
  },
};
</script>

<style scoped>
.sidebar-sub-title {
  color: #7d7d7d;
}
</style>

<style lang="scss">
// layout
.app {
  font-family: Roboto;
}
html {
  overflow-y: auto;
}
#main {
  background: radial-gradient(
    66.63% 124.83% at 66.63% 35.36%,
    #09209b 0%,
    #000000 100%
  );
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.app-bar {
  background: linear-gradient(to right, #d784b7, #423787) !important;
  .v-toolbar__content {
    @include dai_vuetify_sm {
      padding-left: 0;
      padding-right: 0;
    }
  }
  .no-padding-btn {
    .v-btn:not(.v-btn--round).v-size--default {
      @include dai_vuetify_sm {
        min-width: 40px;
        padding: 0 10px;
      }
    }
  }
}
.card-wrap {
  padding: 40px 60px;
  box-shadow: 0 4px 16px 4px rgb(0 0 0 / 20%) !important;
  @media (max-width: 600px) {
    padding: 40px 20px;
  }
}

.v-sheet.v-card.card-wrapper {
  border-radius: 20px;
  @include dai_vuetify_md {
    border-radius: 16px;
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
