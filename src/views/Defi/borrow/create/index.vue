<template>
  <v-container class="defi-create-page">
    <v-row justify="center" class="my-4 mb-md-4 mb-15">
      <v-col cols="11" sm="8">
        <v-card
          light
          class="defi-create-card card-wrap d-flex flex-column justify-center align-center"
        >
          <div></div>
          <h2 class="mb-3 loan-title">
            {{ $t('selectDepositTokenType') }}
          </h2>
          <div class="deposit-subtitle" v-t="'depositNotify'"></div>
          <div class="d-flex flex-column justify-center align-center">
            <div
              class="icon-block d-flex flex-row align-center can-click mb-5"
              :data-type="$route.params.token"
              v-for="item in icons.filter((item) => ourToken.includes(item.name))"
              :style="{order: tokenListOrder[item.name]}"
              :key="item.name"
              @click="
                $router.push(
                  `/${$route.params.lang}/${$route.params.token}${item.link}`
                )
              "
            >
              <img
                :src="`${require(`@/assets/img/${item.img}`)}`"
                class="rounded-circle token-icon"
              />
              <div class="icon-text text-center">{{ item.text }}</div>
              <img
                src="@/assets/img/icon-arrow-right.svg"
                alt=""
                class="icon-right"
              />
            </div>
            <div
              class="icon-block d-flex flex-row align-center can-click mb-5"
              v-for="item in icons.filter(
                (item) => !ourToken.includes(item.name)
              )"
              :key="item.name"
              :style="{order: tokenListOrder[item.name]}"
              @click="
                $router.push(
                  `/${$route.params.lang}/${$route.params.token}${item.link}`
                )
              "
            >
              <img
                :src="`${require(`@/assets/img/${item.img}`)}`"
                class="rounded-circle token-icon"
              />
              <div class="icon-text text-center">{{ item.text }}</div>
              <img
                src="@/assets/img/icon-arrow-right.svg"
                alt=""
                class="icon-right"
              />
            </div>
          </div>
          <div></div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitGetData'"></loading>
  </v-container>
</template>
<script>
import loading from '@/components/loading.vue'
export default {
  name: 'Defi-borrow-create',
  data() {
    return {
      defiContract: null,
      icons: [],
      loadingShow: false,
      tokenListOrder: {
        egt: 1,
        eth: 2,
        ebt: 3,
        btc: 4,
        eos: 5,
      }
    }
  },
  components: {
    loading,
  },
  computed: {
    ourToken() {
      return ['egt', 'ebt']
    },
  },
  methods: {
    setToken() {
      let tokenNames = this.$store.state.tokenListV2.names
      this.icons = tokenNames.map((name) => ({
        name: name,
        img: `borrow/${name}.svg`,
        text: `${name.toUpperCase()} / ${this.$route.params.token.toUpperCase()}`,
        link: `/borrow/create/${name}`,
      }))
    },
  },
  async mounted() {
    this.setToken()
  },
}
</script>

<style lang="scss" scoped>
.defi-create-page {
  .loan-title {
    width: 346px;
    height: 62px;
    justify-content: center;
    align-items: center;
    display: flex;
    color: white;
    background-color: #00126f;
    border-radius: 62px;
    font-size: 30px;
    @include dai_vuetify_md {
      width: 207px;
      border-radius: 37px;
      height: 37px;
      font-size: 17px;
    }
  }
  .deposit-subtitle {
    color: #ababab;
    font-size: 20px;
    margin-bottom: 18px;
    @include dai_vuetify_md {
      font-size: 13px;
    }
  }
  .loan-subtitle {
    color: #ababab;
    font-size: 20px;
    @include dai_vuetify_md {
      font-size: 13px;
    }
  }
  .defi-create-card {
    border-radius: 25px;
    @include dai_vuetify_md {
      border-radius: 14px;
    }
    .icon-block {
      border-radius: 18px;
      background-color: #f3f3f3;
      width: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 9px 35px;
      box-sizing: border-box;
      border: solid 2px #f3f3f3;
      &:hover,
      :active {
        background-color: white;
        border-color: #e0bb2a;
        .icon-right {
          opacity: 1;
        }
      }
      img {
        object-fit: contain;
      }
      .token-icon {
        width: 60px;
      }
      .icon-text {
        width: 256px;
        font-size: 39px;
        font-weight: bold;
        color: #959494;
      }
      .icon-right {
        margin-left: auto;
        opacity: 0;
        transition: opacity 0.1s;
      }
      transition: background-color 0.3s;

      @include dai_vuetify_md {
        padding: 5px 20px;
        max-width: 243px;
        .icon-text {
          font-size: 22px;
          width: 147px;
        }
        .token-icon {
          width: 31px;
        }
      }
    }
  }
}
</style>
