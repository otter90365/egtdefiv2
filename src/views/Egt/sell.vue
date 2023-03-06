<!--<template>
  <div class="egt-sell-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="exchange-card card-wrap d-flex flex-column justify-center align-center">
          <img src="@/assets/img/icon-sell.png" width="60px" class="mb-5">
          <h2 class="primary--text mb-10">{{ $t('sellEGT') }}</h2>
          <addressBlock></addressBlock>

          <div>{{ $t('enterEgtAmount') }}</div>
          <v-form ref="form" style="width: 100%;" lazy-validation>
            <v-text-field
              class="my-1"
              v-model="amount"
              outlined
              persistent-hint
              :hint="`Balance: ${balance} EGT`"
              color="primary"
              placeholder="0"
              :label="`${$t('enterExchangeEgtAmount')}`"
              :rules="[...TokenAmountRules, ...balanceRules]"
              :disabled="allowance===0||allowance<balance?true:false"
            >
              <template v-slot:append>
                <div @click="amount=balance">Max</div>
              </template>
            </v-text-field>
          </v-form>

          <div class="primary--text mb-10">{{ $t('canChange') }} {{ amount ? amount/1200 : 0 }} {{ $t('piece') }} ETH {{ $t('pieceBack') }}  ({{ $t('egtExchangeRateFront') }}1200 : 1 {{ $t('egtExchangeRateBack') }})</div>

          <btn v-if="allowance===0 || allowance<balance" class="mb-5" :buttonText="'sellApprove'" :color="'red darken-1'" :isCenter="true" :width="270" @clickBtn="approve()"></btn>
          <btn v-else class="mb-5" :buttonText="'sell'" color="primary" :isCenter="true" :width="270" @clickBtn="clickSellBtn()"></btn>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitApprove'"></loading>
  </div>
</template>
<script>
import Eth from "@/plugins/web3.js";
import EGT from "@/plugins/egt.js";
import base from '@/mixin/base.js'
import btn from '@/components/btn.vue'
import addressBlock from '@/components/addressBlock.vue'
import loading from '@/components/loading.vue'
export default {
  name: "Egt-sell",
  mixins: [base],
  data (){
    return {
      amount: null,
      balance: 0,
      allowance: 0,
      web3: null,
      egtContract: null,
      loadingShow: false,
      timer: null,
      balanceRules: [
        (v) => v <= this.balance || 'Under Balance'
      ]
    }
  },
  components:{
    btn,
    addressBlock,
    loading
  },
  methods:{
    async clickSellBtn(){
      if (this.$store.state.chainId){
        if (this.$refs.form.validate()){
          let result = await this.egtContract.sell(this.amount)
          // console.log('result', result)
          if (result.txHash){
            await this.getBalance()
            this.$toasted.show(this.$t('txSend'))
            this.$refs.form.reset()
          }else if (result.code === 4001){
            this.$toasted.error(this.$t('userRefuse'))
          }
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async approve(){
      if (this.$store.state.chainId){
        let result = await this.egtContract.approveEgt()
        // console.log('result', result)
        if (result.txHash){
          this.loadingShow = true
          this.timer = window.setInterval(async () => {
            this.allowance = await this.egtContract.getEgtAllowance(this.$store.state.account)
            if (this.allowance >= this.balance) {
              window.clearInterval(this.timer)
              this.loadingShow = false
            }
          }, 1000)
        }else if (result.code === 4001){
          this.$toasted.error(this.$t('userRefuse'))
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async getBalance(){
      let total = await this.egtContract.getBalance(this.$store.state.account)
      this.balance = total
    }
  },
  async mounted(){
    // egt contract
    this.egtContract = await new EGT()

    // egt isMember
    let isMember = await this.egtContract.isMember(this.$store.state.account)
    // console.log('isMember', isMember)
    if (isMember){
      this.web3 = await new Eth()

      this.getBalance()
      this.allowance = await this.egtContract.getEgtAllowance(this.$store.state.account)
    }else{
      this.$router.push({name: 'Egt-registry'})
    }
  }
}
</script>

<style lang="scss" scoped>
.egt-sell-page{
  
}
</style>-->