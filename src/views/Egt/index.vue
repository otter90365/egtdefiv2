<script>
import EGT from '@/components/swap/egt.vue'
export default {
  data() {
    return {
      selectedToken: '',
    }
  },
  components: {
    EGT,
  },
  computed: {
    supportedTokenList() {
      const tokenList = []

      if (this.$store.state.EGTAddress) {
        tokenList.push({
          name: 'EGT',
          protocol: 'BEP-20',
          targetToken: 'ETH',
          address: this.$store.state.EGTAddress,
        })
      }

      return tokenList
    },
    title() {
      if (this.selectedToken) {
        const token = this.supportedTokenList.find(
          (t) => t.name === this.selectedToken
        )
        return this.$t('transferToken', {
          fromToken: token.name,
          targetToken: token.targetToken,
        })
      }

      return this.$t('tokenSwap')
    },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center" class="my-4 align-start">
      <v-col cols="11" sm="9">
        <v-card
          light
          class="defi-create-card card-wrap d-flex flex-column justify-start align-center"
        >
          <div></div>
          <h2 class="mb-3 swap-title">
            <img
              v-if="selectedToken"
              :src="
                require(`@/assets/img/borrow/${selectedToken.toLowerCase()}.svg`)
              "
              alt=""
            />
            {{ title }}
          </h2>
          <div class="deposit-subtitle" v-t="'depositNotify'"></div>
          <fragment v-if="selectedToken === ''">
            <a
              target="_blank"
              rel="noopener,noreferrer"
              :href="`https://tbtswap.com/${$store.state.locale}`"
              class="icon-block d-flex flex-row align-center mb-5"
            >
              <div class="icon-text text-center">
                {{ $t('otherTokenSwap') }}
              </div>
              <img
                src="@/assets/img/icon-arrow-right.svg"
                class="icon-right"
                alt=""
              />
            </a>
            <div
              class="icon-block d-flex flex-row align-center can-click mb-5"
              v-for="token in supportedTokenList"
              :key="token.address"
              @click="selectedToken = token.name"
            >
              <img
                class="rounded-circle token-icon"
                :src="`${require(`@/assets/img/borrow/${token.name.toLowerCase()}.svg`)}`"
                alt=""
              />
              <div class="icon-text text-center">
                <span class="d-md-none d-flex">
                  {{
                    $store.state.locale === 'en' ? 
                    $t('transferToken_mbl', {
                      fromToken: token.name,
                      targetToken: token.targetToken,
                    }) : 
                    $t('transferToken', {
                      fromToken: token.name,
                      targetToken: token.targetToken,
                    })
                  }}
                </span>
                <span class="d-none d-md-flex">
                  {{ $t('transferToken', {
                      fromToken: token.name,
                      targetToken: token.targetToken,
                    }) }}
                </span>
              </div>
              <img
                src="@/assets/img/icon-arrow-right.svg"
                alt=""
                class="icon-right"
              />
            </div>
            <div></div>
          </fragment>
          <component v-else :is="selectedToken" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
.swap-title {
  width: 358px;
  height: 62px;
  justify-content: center;
  align-items: center;
  position: relative;
  display: flex;
  color: white;
  background-color: #00126f;
  border-radius: 62px;
  font-size: 30px;
  img {
    width: 35px;
    filter: drop-shadow(0px 0px 5.27627px #ffffff);
    position: absolute;
    left: 21px;
  }
  @include dai_vuetify_md {
    width: 207px;
    border-radius: 37px;
    height: 37px;
    font-size: 17px;
    img {
      width: 20px;
      left: 12px;
    }
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
  min-height: 634px;
  @include dai_vuetify_md {
    min-height: 366px;
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
    &:not(.inactive):hover,
    :not(.inactive):active {
      background-color: white;
      border-color: #e0bb2a;
      .icon-right {
        filter: grayscale(0)
      }
    }
    img {
      object-fit: contain;
    }
    .token-icon {
      width: 60px;
    }
    .icon-text {
      min-width: 256px;
      font-size: 39px;
      font-weight: bold;
      color: #959494;
    }
    .icon-right {
      margin-left: auto;
      filter: grayscale(1);
      transition: filter 0.1s;
    }
    transition: background-color 0.3s;

    @include dai_vuetify_md {
      padding: 5px 20px;
      max-width: 243px;
      .icon-text {
        font-size: 22px;
        width: 147px;
        min-width: unset;
        white-space: nowrap;
      }
      .protocol-text {
        font-size: 17px;
      }
      .token-icon {
        width: 31px;
      }
    }
  }
}

.inactive .icon-right:not(.inactive) {
  display: none;
}
.icon-right.inactive {
  display: none;
}

.inactive .icon-right.inactive {
  display: block;
}

a {
  text-decoration: none;
}
</style>
