<script>
import base from '@/mixin/base.js'
import accountActionMixin from '@/mixin/accountActionMixin'
import loading from '@/components/loading.vue'
import { mapState } from 'vuex'
import DefiV2 from '@/plugins/defiV2';
import Defi from '@/plugins/defi';
export default {
  name: 'Defi-registry',
  props: ['value'],
  mixins: [base, accountActionMixin],
  computed: {
    ...mapState(['registryOpen']),
  },
  data() {
    return {
      referer: '',
      isMember: false,
      timer: null,
      loadingShow: false,
      defiContract2: null,
    }
  },
  components: {
    loading,
  },
  methods: {
    onInput(v) {
      this.$emit('input', v)
    },
    async register() {
      console.log('start register')
      if (this.$store.state.chainId) {
        if (this.$refs.form.validate()) {
          let result = await this.defiContract2.register(this.referer)
          if (result.txHash) {
            this.loadingShow = true
            this.timer = window.setInterval(async () => {
              this.isMember = await this.defiContract2.isMember(
                this.$store.state.account
              )
              if (this.isMember) {
                window.clearInterval(this.timer)
                this.loadingShow = false
                this.$store.commit('updateRegistryOpen', false)
                this.$emit('success')
              }
            }, 1000)
          } else if (result.code === 4001) {
            this.$toasted.error(this.$t('userRefuse'))
          }
        }
      } else {
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async registerV1() {
      console.log('start register')
      const contract = new Defi()
      if (this.$store.state.chainId) {
        if (this.$refs.form.validate()) {
          let result = await contract.register(this.referer)
          if (result.txHash) {
            this.loadingShow = true
            this.timer = window.setInterval(async () => {
              this.isMember = await contract.isMember(
                this.$store.state.account
              )
              if (this.isMember) {
                window.clearInterval(this.timer)
                this.loadingShow = false
                this.$store.commit('updateRegistryOpen', false)
                this.$emit('success')
              }
            }, 1000)
          } else if (result.code === 4001) {
            this.$toasted.error(this.$t('userRefuse'))
          }
        }
      } else {
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
  },
  async mounted() {
    this.defiContract2 = await new DefiV2()
  },
}
</script>
<template>
  <v-dialog
    class="registry-dialog"
    persistent
    :value="registryOpen"
    max-width="446"
  >
    <v-card class="register-card-wrap">
      <v-card-title class="d-flex justify-center pt-8">
        <span class="font-weight-bold rem-nd-18 rem-8 registry-dialog-title">
          {{ $t('serviceRegistry') }}
        </span>
      </v-card-title>
      <v-card-text class="pb-0">
        <div
          v-t="'enterReferer'"
          class="d-flex rem-6 mt-sm-8 mt-5 mb-2"
          style="color: #A8A8A8"
        ></div>
        <v-form ref="form" lazy-validation style="width: 100%;">
          <v-text-field
            outlined
            class="mb-2"
            v-model="referer"
            :color="`primary_${$route.params.token}`"
            :placeholder="$t('enterRefererPlaceHolder')"
            :rules="[...accountRules]"
          ></v-text-field>
        </v-form>
        <div class="d-flex flex-column align-center">
          <div class="address-title rem-4 rem-md-12">
            {{ $t('yourAddress') }}
          </div>
          <div class="mb-8 d-none d-sm-block">{{ $store.state.account }}</div>
          <div class="mb-4 d-block d-sm-none">{{ shortAddress }}</div>
        </div>
      </v-card-text>
      <div class="modal-footer">
        <div class="left" @click="register()">{{ $t('registry') }}</div>
        <div class="right" @click="$emit('cancel')">{{ $t('cancel') }}</div>
      </div>
      <loading :loadingShow="loadingShow" :content="'waitRegistry'"></loading>
    </v-card>
  </v-dialog>
</template>
<style scoped lang="scss">
.address-title {
  color: #df570b;
  margin-bottom: 10px;
}
.register-card-wrap {
  border-radius: 26px !important;
}
.registry-dialog-title {
  color: #6f6f6f;
}

.en .modal-footer {
  letter-spacing: unset;
}
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: stretch;
  cursor: pointer;
  height: 79px;
  border-top: solid 1.3px #ababab;
  font-weight: bold;
  font-size: 24.2px;
  letter-spacing: 12px;
  color: #6e6e6e;
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left {
    border-right: solid 1px #ababab;
  }
}
</style>
