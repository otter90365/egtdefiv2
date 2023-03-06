<!--<template>
  <div class="egt-sell-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="egt-registry-card card-wrap d-flex flex-column justify-center align-center">
          <h2 class="primary--text mb-2">{{ $t('buyEGT') }}</h2>

          <div class="red--text mb-10">{{ $t('registryEgt') }}</div>

          <div>{{ $t('enterReferer') }}</div>
          <v-form ref="form" lazy-validation style="width: 100%;">
            <v-text-field
              class="mb-2"
              v-model="referer"
              color="primary"
              placeholder="0x..."
              :rules="[...accountRules]"
            ></v-text-field>
          </v-form>

          <addressBlock></addressBlock>

          <btn class="mb-5" :buttonText="'registry'" color="primary" :isCenter="true" :width="270" @clickBtn="register()"></btn>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitRegistry'"></loading>
  </div>
</template>
<script>
import base from '@/mixin/base.js'
import EGT from "@/plugins/egt.js";
import btn from '@/components/btn.vue'
import addressBlock from '@/components/addressBlock.vue'
import loading from '@/components/loading.vue'
export default {
  name: 'Egt-registry',
  mixins: [base],
  data (){
    return {
      referer: '',
      isMember: false,
      timer: null,
      loadingShow: false,
      egtContract: null,
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
            let result = await this.egtContract.register(this.referer)
            // console.log('result', result)
            if (result.txHash){
              this.loadingShow = true
              this.timer = window.setInterval(async () => {
                this.isMember = await this.egtContract.isMember(this.$store.state.account)
                if (this.isMember) {
                  window.clearInterval(this.timer)
                  this.loadingShow = false
                  this.$router.push({name: 'Egt'})
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
    // egt contract
    this.egtContract = await new EGT()
    console.log('this.egtContract', this.egtContract)

    // egt isMember
    this.isMember = await this.egtContract.isMember(this.$store.state.account)
    if (this.isMember){
      this.$router.push({name: 'Egt'})
    }
  }
}
</script>
<style lang="scss">
.egt-sell-page{
  
}
</style>-->