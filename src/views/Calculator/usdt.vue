<template>
  <div class="calculator-usdt-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="calculator-card card-wrap d-flex flex-column justify-center align-center">
          <img src="@/assets/img/icon-usdt.png" width="60px" class="mb-5">
          <h2 :class="`primary_${$route.params.token}--text`">{{ $t('vsEn') }} EGT {{ $t('vs') }} USDT {{ $t('vsBack') }}</h2>
          <div class="mb-10" :class="`primary_${$route.params.token}--text`">({{ $t('egtExchangeRateFront') }}1 : 1200 {{ $t('egtExchangeRateBack') }})</div>
          <v-row class="mb-10">
            <v-col cols="12">
              <v-form ref="form" lazy-validation class="d-flex flex-column justify-center align-center">
                <v-text-field
                  v-model="egtAmount"
                  style="width: 250px;"
                  outlined
                  dense
                  full-width
                  :color="`primary_${$route.params.token}`"
                  placeholder="0"
                  label="EGT"
                  :rules="[...TokenAmountRules]"
                >
                </v-text-field>
                <v-icon class="mb-5">mdi-arrow-up-down-bold</v-icon>
                <div class="d-flex flex-column align-center">
                  <div>USDT {{ $t('amount') }}</div>
                  <h2 :class="`primary_${$route.params.token}--text`">{{ usdtResult || '--'}} {{ $t('piece') }} USDT</h2>
                </div>
              </v-form>
            </v-col>
          </v-row>
          <div v-if="updateTime" class="mb-3 red--text text-caption text-right" style="width: 100%;">{{ $t('dataUpdated') }} {{ timestampToTime(updateTime) }}</div>
          <btn class="mb-5" :buttonText="'calculate'" :color="`primary_${$route.params.token}`" :isCenter="true" :width="270" @clickBtn="calculate()"></btn>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import base from '@/mixin/base.js'
import btn from '@/components/btn.vue'
export default {
  name: 'Calculator-usdt',
  mixins: [base],
  data (){
    return {
      egtAmount: null,
      usdtResult: null,
      updateTime: null,
    }
  },
  components:{
    btn
  },
  methods:{
    async calculate(){
      if (this.$refs.form.validate()){
        let data = {
          token: 'ethereum',
          currency: 'usd'
        }
        try{
          let result = await this.$store.dispatch('getTokenPrice', data)
          if (result){
            // console.log('result', result)
            this.usdtResult = this.egtAmount ? (this.egtAmount * result.ethereum.usd / 1200).toFixed(2) : null
            this.updateTime = result.ethereum.last_updated_at * 1000
          }else{
            this.$toasted.error(this.$t('errorOccured'))
          }
        }catch (error){
          console.log('error', error)
          this.$toasted.error(this.$t('errorOccured'))
        }
      }
    },
  },
}
</script>
<style lang="scss">
.calculator-usdt-page{
  .calculator-card{
    
  }
}
</style>