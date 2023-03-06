<template>
  <div class="index">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <h1 class="text-shadow text-center mb-5" :class="`primary_${$route.params.token}--text`">{{ $t('indexTitle') }}</h1>
        <h3 class="text-shadow text-center mb-15" :class="`primary_${$route.params.token}--text`">{{ $t('indexSubtitle') }}</h3>
        <v-card light class="index-card card-wrap">
          <div class="text-center mb-5">{{ $t('indexDesc') }}</div>
          <div class="d-flex flex-column justify-center align-center mb-5">
            <h2 :class="`primary_${$route.params.token}--text`">{{ $t('investAmount') }}</h2>
            <h2 class="mb-3">{{ totalAmount.toLocaleString() }} {{ ($route.params.token).toUpperCase() }}</h2>
            <h2 :class="`primary_${$route.params.token}--text`">{{ $t('gamePoolAmount') }}</h2>
            <h2 class="red--text mb-5">{{ roundAmount.toLocaleString() }} {{ ($route.params.token).toUpperCase() }}</h2>
            <btn class="mb-3" :buttonText="'gamePool'" :color="`primary_${$route.params.token}`" :width="'100%'" @clickBtn="toGame()"></btn>
            <div class="bsc-egt-block d-flex flex-column justify-center align-center pa-3 can-click" @click="toSwap()" :data-type="$route.params.token">
              <img :src="`${require(`@/assets/img/icon-bscegt-${$route.params.token}.png`)}`" width="40px">
              <div class="font-weight-bold" :class="`primary_${$route.params.token}--text`">{{ $t('swapEGT') }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import btn from "@/components/btn.vue";
import Game from "@/plugins/game.js";
import Defi from "@/plugins/defi.js";
export default {
  name: "Home",
  data(){
    return {
      gameContract: null,
      defiContract: null,
      totalAmount: '--',
      roundAmount: '--'
    }
  },
  components:{
    btn
  },
  methods:{
    toGame(){
      if (this.$store.state.account){
        this.$router.push({name: 'Game'})
      }else{
        this.$toasted.error(this.$t('loginFirst'))
      }
    },
    toSwap(){
      if (this.$store.state.account){
        this.$router.push({name: 'Egt-swap', params: {lang: this.$store.state.locale, token: this.$route.params.token}})
        // this.$router.push({name: 'ComingSoon'})
      }else{
        this.$toasted.error(this.$t('loginFirst'))
      }
    },
    async getTotalAmount(){
      try{
        this.totalAmount = await this.defiContract.getTotalAmount()
      }catch(error){
        this.totalAmount = 0
        console.log('error', error)
      }
    },
    async getRoundAmount(){
      try{
        let round = await this.gameContract.getCurrRound()
        let detail = await this.gameContract.getRoundDetails(round)
        this.roundAmount = detail.roundamount
      }catch(error){
        this.roundAmount = 0
        console.log('error', error)
      }
    }
  },
  created(){
    if (!this.$store.state.tokens.includes(this.$route.params.token)){
      this.$router.push({name: "Index", params: {lang: this.$store.state.locale, token: this.$route.params.token}})
    }
  },
  async mounted(){
    // console.log('==========index==========')
    this.gameContract = await new Game()
    this.defiContract = await new Defi()
    await this.getTotalAmount()
    await this.getRoundAmount()
  }
}
</script>
<style lang="scss">
.index{
  .bsc-egt-block{
    width: 100%;
    border: 2px solid #0abbb5;
    border-radius: 10px;
  }
  .bsc-egt-block[data-type="tbt"]{
    border-color: #991594 !important;
  }
}
</style>