<template>
  <div class="order-block mb-3" style="width: 100%;">
    <v-row no-gutters class="order-header white--text d-flex justify-space-between align-center py-2 px-5" :class="`primary_${$route.params.token}`">
      <div>{{ $t('id') }} {{ data.id }}</div>
      <div
        class="font-weight-bold"
        :class="{'red--text':!data.canOrder}"
      >
        {{ data.canOrder ? 
            `${$t('loanDays')} ${data.settleday / 24} ${$t('day')}` :
            `${$t('contract')}${status === 'breach' ? $t('expired') :
                                status === 'buffer' ? $t('buffer') : $t('due')} ${countdown.day}${$t('day')} ${countdown.hour}${$t('hour')} ${countdown.min}${$t('min')} ${countdown.sec}${$t('sec')}`}}
      </div>
    </v-row>
    <v-row no-gutters class="order-content py-2 text-center" :data-type="$route.params.token">
      <v-col cols="3" class="d-flex flex-column justify-center align-center">
        <div>{{ $t('loanToken') }}</div>
        <div>{{ token.name ? token.name.toUpperCase() : '' }}</div>
      </v-col>
      <v-col cols="3" class="d-flex flex-column justify-center align-center">
        <div>{{ $t('loanTokenAmount') }}</div>
        <div>
          {{ round(data.amount, 3) || 0 }}
          <span class="text-caption">{{ token.name ? token.name.toUpperCase() : '' }}</span>
        </div>
      </v-col>
      <v-col cols="3" class="d-flex flex-column justify-center align-center">
        <div>{{ $t('marketValue') }}</div>
        <div>
          {{ round(value, 0) }}
          <span class="text-caption">{{ $route.params.token.toUpperCase() }}</span>
        </div>
      </v-col>
      <v-col cols="3" class="d-flex flex-column justify-center align-center">
        <div>{{ $t('status') }}</div>
        <div class="font-weight-bold text-center">
          {{ $t(status) }}
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters class="order-content py-2 text-center" :data-type="$route.params.token">
      <v-col cols="3" class="d-flex flex-column justify-center align-center">
        <div>{{ $t('loanAmount') }}</div>
        <div>
          {{ round(data.want) }}
          <span class="text-caption">{{ $route.params.token.toUpperCase() }}</span>
        </div>
      </v-col>
      <v-col cols="3" class="d-flex flex-column justify-center align-center">
        <div>{{ $t('loanMortgage') }}</div>
        <div>{{ rate }}%</div>
      </v-col>
      <v-col cols="3" class="d-flex flex-column justify-center align-center">
        <div>{{ $t('loanRate') }}</div>
        <div>{{ mode==='loan' ? round(data.rate) : round(data.rate / 2) }}%</div>
      </v-col>
      <v-col cols="3" class="d-flex flex-column justify-center align-center">
        <div>{{ $t('loanInterest') }}</div>
        <div>
          {{ mode==='loan' ? round(data.want * data.rate / 100) : round(data.want * data.rate / 100 / 2) }}
          <span class="text-caption">{{ $route.params.token.toUpperCase() }}</span>
        </div>
      </v-col>
    </v-row>
    
    <div class="d-flex justify-space-around align-center order-btn pa-2" :data-type="$route.params.token">
      <div>{{ $t('APR') }} {{ mode==='loan' ? round(365 / (data.settleday / 24) * (round(data.rate))) : round(365 / (data.settleday / 24) * (round(data.rate) / 2)) }} %</div>
      <btn v-if="isLock" :buttonText="'approve'" :color="'red darken-1'" :isCenter="true" @clickBtn="approve()"></btn>
      <btn v-else
        :buttonText="buttonText"
        :isDisabled="mode==='loan' ? completed
                  : data.canOrder ? false : status!=='breach'"
        :isCenter="true"
        :color="`primary_${$route.params.token}`"
        @clickBtn="clickBtn()"
      ></btn>
    </div>
  </div>
</template>

<script>
import btn from '@/components/btn.vue';
import base from '@/mixin/base.js';
export default {
  name: 'order-block',
  mixins: [base],
  components:{
    btn
  },
  props:{
    data:{
      type: Object,
      default: ()=>{
        return {}
      }
    },
    mode: {
      type: String,
      default: 'default'
    },
    buttonText: {
      type: String,
      default: ''
    },
    isLock: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return {
      value: null,
      rate: null,
      now: 0,
      dueTime: 0,
      countdown: {
        day: '--',
        hour: '--',
        min: '--',
        sec: '--',
      },
      timer: null,
      token: {},
    }
  },
  watch:{
    "data.token"(){
      this.getToken()
    },
    "data.id"(){
      this.rate = null
      this.value = null
      this.getToken()
    },
    "data.filledTime"(newVal){
      if (newVal){
        this.getNow()
      }
    }
  },
  computed:{
    status(){
      if (this.data.canOrder){
        return 'waiting'
      }else if (this.data.isComplete){// && this.data.filledTime + this.data.settleday + 12 >= this.now / 3600000
        return 'repay'
      }else if (!this.data.isComplete && this.data.filledTime + this.data.settleday + 12 >= this.now / 3600000 && this.now / 3600000 >= this.data.filledTime + this.data.settleday){
        return 'buffer'
      }else if (!this.data.isComplete && this.now / 3600000 > this.data.filledTime + this.data.settleday + 12){
        return 'breach'
      }else{
        return 'loaning'
      }
    },
    completed(){
      if (this.status === 'waiting' || this.status === 'loaning' || this.status === 'buffer'){
        return false
      }else{
        return true
      }
    }
  },
  methods:{
    async getEgtValue(){
      if (this.token){
        // console.log(this.token.name)
        this.value = await this.getValue(this.token.name, this.data.amount, this.$route.params.token);
      }
    },
    async getMorgageRate(){
      this.rate = await this.getRate(this.data.want, this.value);
    },
    clickBtn(){
      this.$emit('clickBtn')
    },
    approve(){
      this.$emit('approve')
    },
    getNow(){
      let _this = this
      let sec, min, hour, day
      // if (this.data.isComplete){
      if (this.completed){
        sec = min = hour = day = 0
        this.countdown = { day, hour, min, sec }
        if (this.timer){  
          window.clearInterval(this.timer)
        }
      }else{
        this.timer = window.setInterval(function () {
          _this.now = Math.floor(Date.now())
          _this.dueTime = (_this.data.filledTime + _this.data.settleday) * 60 * 60 * 1000
          let offsetTIme = (_this.dueTime - _this.now) / 1000

          if (offsetTIme < -43200) {
            sec = min = hour = day = 0
            window.clearInterval(_this.timer)
          } else {
            sec = parseInt(offsetTIme % 60)
            min = parseInt((offsetTIme / 60) % 60)
            hour = parseInt((offsetTIme / 60 / 60) % 24)
            day = parseInt(offsetTIme / 60 / 60 / 24)
          }

          _this.countdown = { day, hour, min, sec }
        }, 1000);
      }
    },
    async getToken(){
      let _this = this
      this.token = this.$store.state.tokenList.find((item) => (item.tokenaddress).toLowerCase() === (_this.data.token).toLowerCase())
      await this.getEgtValue()
      await this.getMorgageRate()
    }
  },
  async mounted(){
    if (this.data.filledTime){
      this.getNow()
    }
    this.getToken()
  },
  destroyed(){
    if (this.timer){
      window.clearInterval(this.timer)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-content[data-type="tbt"]:nth-child(even){
  background-color: #A594BF;
}
.order-content[data-type="usdt"]:nth-child(even){
  background-color: #CCFCFC;
}
.order-content[data-type="tbt"]:nth-child(odd), .order-btn[data-type="tbt"]{
  background-color: #E4DCEF;
}
.order-content[data-type="usdt"]:nth-child(odd), .order-btn[data-type="usdt"]{
  background-color: #EDFEFE;
}
</style>