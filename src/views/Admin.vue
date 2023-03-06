<template>
  <div class="admin-index">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="index-card card-wrap">
          <div class="d-flex flex-column justify-center align-center mb-5">
            <div>輸入欲增加至彩金池之金額</div>
            <v-form ref="form" lazy-validation style="width: 100%;">
              <v-text-field
                class="mb-2"
                v-model="addPoolAmount"
                :color="`primary_${$route.params.token}`"
                :rules="[...TokenAmountRules]"
              ></v-text-field>
            </v-form>
            <btn :buttonText="'確認增加'" :color="`primary_${$route.params.token}`" @clickBtn="addMoney()"></btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import btn from "@/components/btn.vue";
import Game from "@/plugins/game.js";
import base from "@/mixin/base.js";
export default {
  name: "Home",
  mixins: [base],
  data(){
    return {
      gameContract: null,
      addPoolAmount: null,
    }
  },
  components:{
    btn
  },
  methods:{
    async addMoney(){
      if (this.$refs.form.validate()){
        try{
          let result = await this.gameContract.addMoney(this.addPoolAmount)
          if (result.txHash){
            this.$toasted.show(this.$t('txSend'))
            this.$refs.form.reset()
          }else if (result.code === 4001){
            this.$toasted.error(this.$t('userRefuse'))
          }
        }catch(error){
          console.log('error', error)
        }
      }
    },
  },
  async mounted(){
    // console.log('==========index==========')
    this.gameContract = await new Game()
  }
}
</script>
<style lang="scss">
.admin-index{
  
}
</style>