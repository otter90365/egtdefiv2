<template>
  <div class="gas-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11">
        <v-card light class="gas-card card-wrap d-flex flex-column justify-center align-center">
          <h2 class="mb-5" :class="`primary_${$route.params.token}--text`">{{ $t('gasPage') }}</h2>

          <div class="d-flex flex-column flex-md-row align-start align-md-center">
            <div class="mr-5 font-weight-bold" :class="`primary_${$route.params.token}--text`">{{ $t('date') }}</div>
            <div class="d-flex align-center">
              <timeSelect class="mr-5" :title="'from'" :time.sync="startTime"></timeSelect>
              <timeSelect :title="'to'" :time.sync="endTime"></timeSelect>
            </div>
          </div>

          <div class="d-flex flex-column flex-md-row justify-center align-center" style="width: 100%;">
            <div class="d-flex align-center" style="width: 100%; max-width: 500px;">
              <div class="mr-2 font-weight-bold" :class="`primary_${$route.params.token}--text`" style="width: 120px;">{{ $t('applyAddress') }}</div>
              <v-form ref="search" lazy-validation style="width: 100%;">
                <v-text-field
                  class="mr-2"
                  v-model="address"
                  :rules="accountRules"
                  :color="`primary_${$route.params.token}`"
                ></v-text-field>
              </v-form>
            </div>
            <btn :buttonText="'search'" :color="`primary_${$route.params.token}`" @clickBtn="filter()"></btn>
          </div>
          <v-data-table
            class="elevation-1 mb-5"
            v-model="selected"
            :headers="headers"
            :items="history"
            :items-per-page="10"
            :loading="tableLoading"
            loading-text="Loading... Please wait"
            show-select
            :color="`primary_${$route.params.token}`"
            item-key="hash"
          >
            <template v-slot:item.hash="{ item }">
              <!--<a rel="noopener noreferrer" target="_blank" :href="`https://rinkeby.etherscan.io/tx/${item.hash}`">-->
              <a rel="noopener noreferrer" target="_blank" :href="`https://etherscan.io/tx/${item.hash}`">
                <span class="d-none d-md-block">{{ item.hash }}</span>
                <span class="d-block d-md-none">{{ `${item.hash.slice(0, 6)}...${item.hash.slice(35)}` }}</span>
              </a>
            </template>
            <template v-slot:item.gasUsdt="{ item }">
              <span style="width: 100px;">
                {{ (item.gasUsdt).toLocaleString() }}
              </span>
            </template>
            <template v-slot:item.timeStamp="{ item }">
              {{ timestampToTime(item.timeStamp * 1000) }}
            </template>
          </v-data-table>

          <v-row style="width: 100%;">
            <v-col md="6"></v-col>
            <v-col cols="12" md="6">
              <div class="d-flex">
                <div class="mr-2">{{ $t('total') }}</div>
                <div>{{ totalGas }}</div>
              </div>
              <div class="d-flex align-center">
                <div class="mr-2" style="width: 50px;">{{ $t('subsidy') }}</div>
                <v-form ref="form" lazy-validation>
                  <v-text-field
                    class="mr-2"
                    v-model="rate"
                    append-icon="%"
                    :rules="rateRules"
                    :color="`primary_${$route.params.token}`"
                  ></v-text-field>
                </v-form>
              </div>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <span class="mr-2">{{ $t('subsidyTotal') }}</span>
                  <span class="mr-2">{{ rewardGas }}</span>
                </div>
                <btn :buttonText="'send'" :color="`primary_${$route.params.token}`" @clickBtn="sendUsdt()"></btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import Defi from '@/plugins/defi.js'
import bscUsdt from '@/plugins/bscUsdt.js'
import timeSelect from '@/components/timeSelect.vue'
import btn from '@/components/btn.vue'
import base from '@/mixin/base.js'
export default {
  name: "GasFee",
  mixins: [base],
  data(){
    return {
      defiContract: null,
      bscUsdtContract: null,
      address: '',
      headers: [
        {
          text: 'Tx hash',
          value: 'hash',
          sortable: false,
        },
        { text: 'Gas Fee', value: 'gasUsdt' , sortable: false },
        { text: 'time', value: 'timeStamp' , sortable: false },
      ],
      history: [],
      selected: [],
      startMenu: false,
      startTime: `${(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)}`,
      endMenu: false,
      endTime: `${(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)}`,
      tableLoading: false,
      ethPrice: 0,
      rate: 0,
      usdtBalance: 0,
    }
  },
  components:{
    timeSelect,
    btn
  },
  computed:{
    totalGas(){
      let amount = this.selected.reduce(function(accu, currItem){
        return accu + currItem.gasUsdt
      }, 0)
      return parseFloat((amount).toFixed(3))
    },
    rewardGas(){
      let amount = this.totalGas * this.rate / 100
      return parseFloat((amount).toFixed(3))
    }
  },
  methods:{
    async getBlockNum(timestamp){
      let blockNum = await this.defiContract.getBlockNumber()
      let blockData = await this.defiContract.getBlockDetail(blockNum)
      let newBlockNum = blockNum - ( blockData.timestamp - (timestamp/1000)) / 15
      return Math.floor(newBlockNum)
    },
    async filter(){
      if (this.$refs.search.validate()){
        this.tableLoading = true
        // Get Eth Price
        try{
          let result = await this.$store.dispatch('getTokenPrice', {
            token: 'ethereum',
            currency: 'usd'
          })
          if (result){
            // console.log('result', result)
            this.ethPrice = result.ethereum.usd
          }else{
            this.$toasted.error(this.$t('cannotGetEthValue'))
            this.ethPrice = 0
          }
        }catch (error){
          console.log('error', error)
          this.$toasted.error(this.$t('cannotGetEthValue'))
          this.ethPrice = 0
        }

        let startBlock = await this.getBlockNum(Date.parse(this.startTime) - 28800000)
        let offset = Date.now() - (Date.parse(this.endTime) - 28800000)
        let endBlock
        if (offset < 86400000){
          endBlock = await this.defiContract.getBlockNumber()
        }else{
          endBlock = await this.getBlockNum(Date.parse(this.endTime)+86400000+3600000 - 28800000)
        }
        // 要再過濾時間(真的是整點後)
        let data = {
          defiAddress: this.$store.state.DefiAddress,
          startBlock: startBlock,
          endBlock: endBlock,
          page: 1,
        }
        try{
          let result = await this.$store.dispatch('getAllRecords', data)
          // console.log('result', result)
          let _this = this
          let filterList = result.result.filter((item) => (item.from).toLowerCase() === (_this.address).toLowerCase())
          // console.log('filterList', filterList)
          if (filterList.length !== 0){
            filterList = filterList.filter((item) => item.timeStamp <= (Date.parse(this.endTime)/1000 + 86400 - 28800) && item.timeStamp >= (Date.parse(this.startTime)/1000 - 28800))
            this.history = filterList.filter((item) => item.input.includes('0x8f68511d'))
            // console.log('this.history', this.history)
            this.history.forEach((item)=>{
              item.gasUsdt = parseInt(item.gasUsed) * parseInt(item.gasPrice) / (10**18) * _this.ethPrice
            })
          }else{
            this.history = []
          }
        }catch(error){
          console.log('error', error)
          this.$toasted.error(this.$t('cannotGetData'))
        }
        this.tableLoading = false
      }
    },
    async sendUsdt(){
      if (this.$refs.form.validate()){
        if (this.rewardGas > 0){
          if (this.usdtBalance >= this.rewardGas){
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId === '0x38' || chainId === 56){
            // if (chainId === '0x61' || chainId === 97){
              await this.sendTransaction()
            }else{
              this.$toasted.error(this.$t('changeMainnet'))
            }
            this.$cookies.set('gasRate', parseInt(this.rate))
          }else{
            this.$toasted.error(this.$t('underBalance'))
          }
        }else{
          this.$toasted.error(this.$t('selectTx'))
        }
      }
    },
    async sendTransaction(){
      try{
        let result = await this.bscUsdtContract.transfer(this.address, this.rewardGas)
        if (result.txHash){
          this.$toasted.show(this.$t('txSend'))
        }else if (result.code === 4001){
          this.$toasted.error(this.$t('userRefuse'))
        }
      }catch(error){
        console.log('error', error)
        this.$toasted.error(this.$t('txError'))
      }
    }
  },
  async mounted(){
    // defi contract
    this.defiContract = await new Defi()
    this.bscUsdtContract = await new bscUsdt()
    this.usdtBalance = await this.bscUsdtContract.getBalance(this.$store.state.account)
  
    let gasRate = this.$cookies.get('gasRate')
    if (gasRate){
      this.rate = gasRate
    }else{
      this.rate = 80
    }
  }
}
</script>
<style lang="scss">
.gas-page{
  .form-block{
    width: 100%;
    max-width: 500px;
  }
}
</style>