<template>
  <div class="calculator-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="calculator-card card-wrap d-flex flex-column justify-center align-center">
          <img :src="`${require(`@/assets/img/icon-calculator-${$route.params.token}.png`)}`" width="60px" class="mb-5">
          <h2 class="mb-10" :class="`primary_${$route.params.token}--text`">{{ $t('calculator') }}</h2>

          <div class="d-flex justify-space-around align-center mb-15">
            <div class="icon-block d-flex flex-column justify-center align-center can-click"
              :data-type="$route.params.token"
              :class="{'ml-sm-10 ml-3':i!==0}"
              v-for="(item, i) in icons"
              :key="i"
              @click="$router.push(`/${$route.params.lang}/${$route.params.token}${item.link}`)">
              <img :src="`${require(`@/assets/img/${item.img}`)}`" width="60px" class="rounded-circle mb-3">
              <div class="">{{ item.text }}</div>
            </div>
          </div>

          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data (){
    return {
      icons: [
        {
          img: 'icon-twd.svg',
          text: 'EGT / TWD',
          link: '/calculator/twd',
        },
        {
          img: 'icon-usdt.png',
          text: 'EGT / USDT',
          link: '/calculator/usdt',
        }
      ]
    }
  },
  async mounted(){
    
  }
}
</script>
<style lang="scss">
.calculator-page{
  .calculator-card{
    .icon-block{
      width: 180px;
      height: 180px;
      border: 1px solid #0abbb5;
      border-radius: 10px;
      @media (max-width: 600px){
        width: 120px;
        height: 120px;
      }
    }
    .icon-block[data-type="tbt"]{
      border-color: #991594 !important;
    }
  }
}
</style>