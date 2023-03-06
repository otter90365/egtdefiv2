<script>
import btn from '../../components/btn.vue';
import accountActionMixin from '../../mixin/accountActionMixin';
import base from '../../mixin/base';
export default {
  components: { btn },
  mixins: [base, accountActionMixin],
  methods: {
    changeLang(lang) {
      this.$store.commit('updateLang', lang);
      this.$i18n.locale = lang;
      this.$router.push({
        name: this.$route.name,
        params: { lang: lang, token: this.$route.params.token },
      });
    },
  },
};
</script>
<template>
  <v-app-bar
    v-if="$store.state.nowWidth <= 960"
    class="app-bar"
    app
    dark
    :height="87"
    dense
  >
    <div class="d-flex align-center">
      <v-img
        alt="Edt-Logo"
        class="shrink mr-0 mr-md-2"
        contain
        src="@/assets/img/logo-egtdefi.png"
        transition="scale-transition"
        :height="$store.state.nowWidth > 960 ? 60 : 30"
      />
      <span class="d-flex flex-column">
        <span class="rem-2">Absolute DEFI</span>
        <span class="rem-7">{{$t('cryptoLendingPlatform')}}</span>
      </span>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex">
      <btn
        class="no-padding-btn"
        isText
        :buttonText="
          $store.state.account ? `${shortAddress}` : `${$t('login')}`
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
    </div>
  </v-app-bar>
</template>
