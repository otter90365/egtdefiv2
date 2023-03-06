<template>
  <div class="community-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="community-card card-wrap d-flex flex-column justify-center align-center">
          <img :src="require(`@/assets/img/icon-community-${$route.params.token}.png`)" width="60px" class="mb-5">
          <h2 class="mb-10" :class="`primary_${$route.params.token}--text`">{{ $t('community') }}</h2>
          <addressBlock></addressBlock>

          <v-row style="width: 100%;" class="mb-10">
            <v-col cols="12" sm="6" class="d-flex flex-column justify-center align-center">
              <div>{{ $t('refererAmount') }}</div>
              <h2 :class="`primary_${$route.params.token}--text`">{{ refers }}</h2>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex flex-column justify-center align-center">
              <div>{{ $t('communityAmount') }}</div>
              <h2 :class="`primary_${$route.params.token}--text`">{{ community }}</h2>
            </v-col>
          </v-row>

          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitGetData'"></loading>
  </div>
</template>
<script>
import addressBlock from '@/components/addressBlock.vue'
import Defi from "@/plugins/defi.js";
import loading from '@/components/loading.vue'
export default {
  name: 'Community',
  data (){
    return {
      defiContract: null,
      refers: null,
      community: null,
      loadingShow: false,
    }
  },
  components:{
    addressBlock,
    loading
  },
  async mounted(){
    this.loadingShow = true
    this.defiContract = await new Defi()

    // defi isMember
    let isMember = await this.defiContract.isMember(this.$store.state.account)
    if (isMember){
      try {
        await this.$nextTick(async () => {
          let result = await this.defiContract.getCommunity(this.$store.state.account)
          // console.log('result', result)
          this.refers = result.myRefs
          this.community = result.community
          this.loadingShow = false
        });
      }catch(error){
        console.log('error', error)
      }
    }else{
      this.$store.commit('updateRegistryOpen', true)
    }
  }
}
</script>