<template>
  <div class="bscegt-send-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="send-card card-wrap d-flex flex-column justify-center align-center">
          <div class="d-flex justify-center align-center" :class="`primary_${$route.params.token}`" style="width: 100%; height: 80px;">
            <h2 class="white--text">{{ $t('sendBscEGT') }}</h2>
          </div>

          <v-form ref="form" lazy-validation style="width: 100%;" class="mt-15 d-flex flex-column align-center">
            <h3 :class="`primary_${$route.params.token}--text`">{{ $t('userAddress') }}</h3>
            <v-text-field
              class="input-wrap mb-2"
              v-model="data.sendAddress"
              :color="`primary_${$route.params.token}`"
              placeholder="0x..."
              :rules="[...accountRules]"
            ></v-text-field>
            <h3 :class="`primary_${$route.params.token}--text`">{{ $t('enterBSCEgtAmount') }}</h3>
            <v-text-field
              class="input-wrap mt-1 mb-3"
              v-model="data.amount"
              outlined
              persistent-hint
              :color="`primary_${$route.params.token}`"
              placeholder="0"
              :label="`${$t('enterBridgeAmount')}`"
              :rules="[...TokenAmountRules]"
            >
            </v-text-field>
          </v-form>
          <div class="mb-15 d-flex flex-column justify-center align-center">
            <btn class="mb-3" :buttonText="'sendToken'" :isCenter="true" :width="270" :color="`primary_${$route.params.token}`" @clickBtn="send()"></btn>
            <div class="can-click w-100 text-center" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import EthBridge from '@/plugins/ethBridge.js'
import btn from '@/components/btn.vue'
import base from '@/mixin/base.js'
export default {
  name: 'Ethegt-send',
  mixins: [base],
  data (){
    return {
      data: {
        sendAddress: '',
        amount: null,
      },
      balance: 0,
      ethBridgeContract: null,
    }
  },
  components:{
    btn,
  },
  methods:{
    async send(){
      if (this.$store.state.isEth){
        if (this.$refs.form.validate()){
          let result = await this.ethBridgeContract.withdraw(this.data)
          // console.log('result', result)
          if (result.txHash){
            this.$toasted.show(this.$t('txSend'))
            this.$refs.form.reset()
          }else if (result.code === 4001){
            this.$toasted.error(this.$t('userRefuse'))
          }
        }
      }else{
        this.$toasted.error(this.$t('changeETH'))
      }
    }
  },
  async mounted(){
    // bridge contract
    this.ethBridgeContract = await new EthBridge()
  }
}
</script>
<style lang="scss">
.bscegt-send-page{
  .send-card{
    padding: 0;
  }
  .input-wrap{
    width: 80%;
    max-width: 500px;
  }
}
</style>