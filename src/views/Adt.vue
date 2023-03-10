<template>
  <div class="adt-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="adt-card card-wrap d-flex flex-column justify-center align-center">
          <div class="d-flex justify-center align-center" :class="`primary_${$route.params.token}`" style="width: 100%; height: 80px;">
            <h2 class="white--text">{{ $t('adt') }}</h2>
          </div>

          <v-row style="width: 100%;" class="mt-10">
            <v-col cols="12" class="d-flex flex-column justify-center align-center">
              <div>ADT {{ $t('holding') }}</div>
              <h2 :class="`primary_${$route.params.token}--text`">{{ balance }}</h2>
            </v-col>
          </v-row>

          <v-row style="width: 100%;" class="my-10">
            <v-col cols="12" sm="6" class="d-flex flex-column justify-center align-center mb-5">
              <div>{{ $route.params.token.toUpperCase() }} {{ $t('claimable') }}</div>
              <h2 :class="`primary_${$route.params.token}--text`">{{ claimAmount }}</h2>
              <btn :buttonText="`${$t('claim')} ${$route.params.token.toUpperCase()}`" :color="`primary_${$route.params.token}`" :width="200" :isDisabled="claimAmount===0" @clickBtn="claim()"></btn>
            </v-col>
            <!--<v-col cols="12" sm="6" class="d-flex flex-column justify-center align-center mb-5" v-for="(token, i) in tokenList" :key="i">
              <div>{{ token.name.toUpperCase() }} {{ $t('claimable') }}</div>
              <h2 :class="`primary_${$route.params.token}--text`">{{ token.claimable }}</h2>
              <btn :buttonText="`${$t('claim')} ${token.name.toUpperCase()}`" :color="`primary_${$route.params.token}`" :width="200" :isDisabled="token.claimable===0" @clickBtn="claimMortgage(token, i)"></btn>
            </v-col>-->
          </v-row>

          <div class="px-5 mb-10" style='width: 100%;'>
            <div class="can-click w-100 text-center" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="loadingText"></loading>
  </div>
</template>
<script>
import ADT from "@/plugins/adt.js";
import DefiV2 from '@/plugins/defiV2.js'
import loading from '@/components/loading.vue'
import btn from '@/components/btn.vue'
export default {
  name: 'ADT',
  data (){
    return {
      defiContract: null,
      adtContract: null,
      balance: 0,
      claimAmount: 0,
      loadingShow: false,
      loadingText: '',
      timer: null,
      tokenList: []
    }
  },
  components:{
    btn,
    loading
  },
  methods:{
    async claim(){
      if (this.$store.state.chainId){
        if (this.claimAmount > 0){
          let result = await this.adtContract.claim(this.$store.state.account)
          // console.log('result', result)
          if (result.txHash){
            this.$toasted.show(this.$t('txSend'))
            this.loadingShow = true
            this.timer = window.setInterval(async () => {
              await this.getAmount()
              if (this.claimAmount === 0) {
                window.clearInterval(this.timer)
                this.loadingShow = false
              }
            }, 1000)
          }else if (result.code === 4001){
            this.$toasted.error(this.$t('userRefuse'))
          }
        }else{
          this.$toasted.error(this.$t('noReward'))
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async claimMortgage(token, i){
      if (this.$store.state.chainId){
        if (token.claimable > 0){
          let result = await this.adtContract.claimMortgage(this.$store.state.account, token.tokenaddress)
          // console.log('result', result)
          if (result.txHash){
            this.$toasted.show(this.$t('txSend'))
            this.loadingText = 'waitClaim'
            this.loadingShow = true
            let _this = this
            this.timer = window.setInterval(async () => {
              await _this.getMortgageAmount()
              if (_this.tokenList[i].claimable === 0) {
                window.clearInterval(_this.timer)
                _this.loadingShow = false
              }
            }, 1000)
          }else if (result.code === 4001){
            this.$toasted.error(this.$t('userRefuse'))
          }
        }else{
          this.$toasted.error(this.$t('noReward'))
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async getAmount(){
      let result = await this.adtContract.getAmount(this.$store.state.account)
      this.balance = result.balance
      this.claimAmount = result.claimable
    },
    // async getMortgageAmount(){
    //   let tokenList = JSON.parse(JSON.stringify(this.$store.state.tokenList))
    //   // console.log('this.balance', this.balance)
    //   for (let i=0; i<tokenList.length; i++){
    //     let result = await this.adtContract.getMortgageAmount(this.$store.state.account, tokenList[i].tokenaddress)
    //     // console.log('result', result)
    //     tokenList[i].claimable = result
    //   }
    //   this.tokenList = tokenList
    // }
  },
  async mounted(){
    // defi contract
    this.loadingText = 'waitGetData'
    this.loadingShow = true
    this.defiContract = await new DefiV2()
    let isMember = await this.defiContract.isMember(this.$store.state.account)
    if (isMember){
      this.adtContract = await new ADT()
      try{
        await this.getAmount()
        // await this.getMortgageAmount()
        this.loadingShow = false
      }catch(error){
        this.loadingShow = false
        console.log('error', error)
      }
    }else{
      this.$store.commit('updateRegistryOpen', true)
    }
  }
}
</script>
<style lang="scss">
.adt-page{
  .adt-card{
    padding: 0;
  }
}
</style>