<template>
  <v-container class="defi-registry-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="defi-registry-card card-wrap d-flex flex-column justify-center align-center">
          <h2 class="mb-2" :class="`primary_${$route.params.token}--text`">{{ $route.params.from === 'deposit' ? $t('toDeposit') : $t('toBorrow') }}</h2>

          <div class="red--text mb-10">{{ $route.params.from === 'deposit' ? $t('registryDeposit') : $t('registryBorrow') }}</div>

          <div>{{ $t('enterReferer') }}</div>
          <v-form ref="form" lazy-validation style="width: 100%;">
            <v-text-field
              class="mb-2"
              v-model="referer"
              :color="`primary_${$route.params.token}`"
              placeholder="0x..."
              :rules="[...accountRules]"
            ></v-text-field>
          </v-form>

          <addressBlock></addressBlock>

          <btn class="mb-5" :buttonText="'registry'" :color="`primary_${$route.params.token}`" :isCenter="true" :width="270" @clickBtn="register()"></btn>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitRegistry'"></loading>
  </v-container>
</template>
<script>
// TODO: this file @deprecated
import base from '@/mixin/base.js'
import Defi from "@/plugins/defi.js";
import btn from '@/components/btn.vue'
import addressBlock from '@/components/addressBlock.vue'
import loading from '@/components/loading.vue'
export default {
  name: 'Defi-registry',
  mixins: [base],
  data (){
    return {
      referer: '',
      isMember: false,
      timer: null,
      loadingShow: false,
    }
  },
  components:{
    btn,
    addressBlock,
    loading
  },
  methods:{
    async register(){
      if (this.$store.state.chainId){
        if (this.$refs.form.validate()){
          if (this.isMember){
            this.$toasted.error(this.$t('addressHasUsed'))
          }else{
            let result = await this.defiContract.register(this.referer)
            // console.log('result', result)
            if (result.txHash){
              this.loadingShow = true
              this.timer = window.setInterval(async () => {
                this.isMember = await this.defiContract.isMember(this.$store.state.account)
                if (this.isMember) {
                  window.clearInterval(this.timer)
                  this.loadingShow = false
                  this.$router.push(`/${this.$route.params.lang}/${this.$route.params.token}/${this.$route.params.from ? this.$route.params.from : 'deposit'}`)
                }
              }, 1000)
            }else if (result.code === 4001){
              this.$toasted.error(this.$t('userRefuse'))
            }
          }
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    }
  },
  async mounted(){
    // defi contract
    this.defiContract = await new Defi()

    // defi isMember
    this.isMember = await this.defiContract.isMember(this.$store.state.account)
    if (this.isMember){
      this.$router.push(`/${this.$route.params.lang}/${this.$route.params.token}/${this.$route.params.from ? this.$route.params.from : 'deposit'}`)
    }
  }
}
</script>
<style lang="scss">
.defi-registry-page{
  
}
</style>