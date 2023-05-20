<template>
  <v-container class="order-block mb-3">
    <v-row
      no-gutters
      class="order-header black--text d-flex align-center py-2 px-md-5 px-3"
      :data-type="$route.params.token"
    >
      <img
        :src="require(`@/assets/img/borrow/${token.name}.svg`)"
        class="order-token-img"
        v-if="token.name"
        :alt="token.name + '.svg'"
      />
      <strong class="ml-md-3 ml-1 rem-md-16 rem-4">
        {{ $t('id') }} {{ data.sorterId ? data.sorterId : data.id }}
      </strong>
      <div class="black--text ml-auto rem-md-15 rem-2">
        {{
          data.canOrder
            ? `${$t('loanDays')} ${data.settleday / 60 / 60 / 24} ${$t('day')}`
            : `${
                status === 'breach'
                  ? $t('expired')
                  : status === 'buffer'
                  ? $t('buffer')
                  : $t('due')
              } ${countdown.day} ${$t('day')} ${countdown.hour}${$t('hour')} ${
                countdown.min
              }${$t('min')} ${countdown.sec}${$t('sec')}`
        }}
      </div>
    </v-row>
    <v-row
      no-gutters
      :style="`background-color: ${$route.params.token === 'tbt' ? '#90DEF6' : '#dcdcdc'}`"
      class="py-2 px-md-5 px-3"
    >
      <v-col cols="12" class="d-flex justify-space-between rem-md-9 rem-2">
        <div></div>
        <strong>
          {{ $t('predictApr') }}
          {{
            mode === 'loan'
              ? round((365 / (data.settleday / 60 / 60 / 24)) * round(data.rate))
              : round((365 / (data.settleday / 60 / 60 / 24)) * (round(data.rate) / 2))
          }}
          %
        </strong>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="order-content py-2 text-center"
      :data-type="$route.params.token"
    >
      <v-col cols="4" class="center-block">
        <div
          v-html="
            `${$t('marketValueLabel')}(${$route.params.token.toUpperCase()})`
          "
        ></div>
        <div>{{ round(value, 0) || 0 | numberFormat }}</div>
      </v-col>
      <v-col cols="4" class="center-block">
        <div
          v-html="
            `${$t('loanTokenAmount')}(${
              token.name ? token.name.toUpperCase() : ''
            })`
          "
        ></div>
        <div>
          {{ round(data.amount, 3) || 0 | numberFormat }}
        </div>
      </v-col>
      <v-col cols="4" class="center-block">
        <div>{{ $t('loanMortgage') }}</div>
        <div>{{ rate }}%</div>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="order-content py-2 text-center"
      :data-type="$route.params.token"
    >
      <v-col cols="4" class="center-block">
        <div>
          {{ $t('loanAmount') }}({{ $route.params.token.toUpperCase() }})
        </div>
        <div class="text-green">
          {{ round(data.want) | numberFormat }}
        </div>
      </v-col>
      <v-col cols="4" class="center-block">
        <div v-html="$t('loanRateFull')"></div>
        <div class="text-green">
          {{ mode === 'loan' ? round(data.rate) : round(data.rate / 2) }}
          <span class="rem-4">%</span>
        </div>
      </v-col>
      <v-col cols="4" class="center-block">
        <div>
          {{
            $t('loanInterestFull', { token: $route.params.token.toUpperCase() })
          }}
        </div>
        <div class="text-green">
          {{
            (mode === 'loan'
              ? ((data.want * data.rate) / 100).toFixed(2)
              : ((data.want * data.rate) / 100 / 2).toFixed(2)) | numberFormat
          }}
        </div>
      </v-col>
    </v-row>

    <div
      class="d-flex justify-space-between align-center order-btn px-md-6 px-3 rem-md-10 rem-3 py-4"
      :data-type="$route.params.token"
    >
      <div class="center-block align-start">
        <span v-if="isLender">
          {{ $t('loanDateLabel') }}
          {{ (data.filledTime * 1000) | parseDate }}
        </span>
        <span v-else>
          {{ $t('creationTime') }}
          {{ (data.startday * 1000) | parseDate }}
        </span>
        <span>
          {{
            !data.canOrder && !data.filledTime
              ? $t('cancelTime')
              : $t('paybackTime')
          }}
          {{
            (data.completeordertime
              ? data.completeordertime * 1000
              : $t(status)) | parseDate
          }}
        </span>
      </div>
      <btn
        v-if="isLock"
        :buttonText="'unlockToken'"
        :color="'red darken-1'"
        :isCenter="true"
        @clickBtn="approve()"
      ></btn>
      <btn
        v-else
        :buttonText="buttonText"
        :isDisabled="
          mode === 'loan'
            ? completed
            : data.canOrder
            ? false
            : status !== 'breach'
        "
        :isCenter="true"
        @clickBtn="clickBtn()"
      ></btn>
    </div>
  </v-container>
</template>

<script>
import btn from '@/components/btn.vue'
import base from '@/mixin/base.js'
import accountActionMixin from '@/mixin/accountActionMixin'
import { BREACH_BUFFER_HOUR } from '@/constant/order'
import get from 'lodash/get'
export default {
  name: 'order-position',
  mixins: [base, accountActionMixin],
  components: {
    btn,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    mode: {
      type: String,
      default: 'default',
    },
    buttonText: {
      type: String,
      default: '',
    },
    isLock: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    parseDate(str) {
      const date = new Date(str)
      if (!date.valueOf()) return str

      const mins = `${date.getMinutes()}`.padStart(2, '0')
      const secs = `${date.getSeconds()}`.padStart(2, '0')

      return `${date.getFullYear()}/${date.getMonth() + 1}/${
        date.getDate() + 1
      } ${date.getHours()}:${mins}:${secs}`
    },
  },
  data() {
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
  watch: {
    'data.token'() {
      this.convertTime()
      this.getToken()
    },
    'data.id'() {
      this.convertTime()
      this.rate = null
      this.value = null
      this.getToken()
      this.getNow()
    },
    'data.settleday'(newVal) {
      if (newVal) {
        this.getNow()
      }
    },
    'data.isComplete'(newVal) {
      if (newVal) {
        window.clearInterval(this.timer)
        this.getNow()
      }
    },
  },
  computed: {
    status() {
      if (this.data.canOrder) {
        return 'waiting'
      } else if (this.data.isComplete) {
        // && this.data.filledTime + this.data.settleday + 12 >= this.now / 3600000
        if (this.data.filledTime) return 'repay'
        return 'isCancel'
      } else if (
        !this.data.isComplete &&
        this.data.filledTime + this.data.settleday + BREACH_BUFFER_HOUR * 3600 >=
          this.now / 1000 &&
        this.now / 1000 >= this.data.filledTime + this.data.settleday
      ) {
        return 'buffer'
      } else if (
        !this.data.isComplete &&
        this.now / 1000 >
          this.data.filledTime + this.data.settleday + BREACH_BUFFER_HOUR * 3600
      ) {
        return 'breach'
      } else {
        return 'loaning'
      }
    },
    completed() {
      if (
        this.status === 'waiting' ||
        this.status === 'loaning' ||
        this.status === 'buffer'
      ) {
        return false
      } else {
        return true
      }
    },
    isLender() {
      if (this.$route.name === 'Defi-borrow-loans') {
        return false
      }
      return true
    },
  },
  methods: {
    async getEgtValue() {
      if (this.token) {
        // console.log(this.token.name)
        this.value = await this.getValue(
          this.token.name,
          this.data.amount,
          this.$route.params.token
        )
      }
    },
    async getMorgageRate() {
      this.rate = await this.getRate(this.data.want, this.value)
    },
    clickBtn() {
      this.$emit('clickBtn')
    },
    approve() {
      this.$emit('approve')
    },
    getNow() {
      let _this = this
      let sec, min, hour, day
      // if (this.data.isComplete){
      if (this.completed) {
        sec = min = hour = day = 0
        this.countdown = { day, hour, min, sec }
        if (this.timer) {
          window.clearInterval(this.timer)
        }
      } else {
        this.timer = setInterval(() => {
          _this.now = Math.floor(Date.now())
          _this.dueTime =
            (_this.data.filledTime + _this.data.settleday) * 1000
          let offsetTime = (_this.dueTime - _this.now) / 1000

          if (offsetTime < -(BREACH_BUFFER_HOUR * 3600)) {
            sec = min = hour = day = 0
            window.clearInterval(_this.timer)
          } else {
            sec = parseInt(offsetTime % 60)
            min = parseInt((offsetTime / 60) % 60)
            hour = parseInt((offsetTime / 60 / 60) % 24)
            day = parseInt(offsetTime / 60 / 60 / 24)
          }

          _this.countdown = { day, hour, min, sec }
        }, 1000)
      }
    },
    async getToken() {
      let _this = this
      if (this.data.version == 1) {
        this.token = this.$store.state.tokenList.find(
          (item) =>
            item.tokenaddress.toLowerCase() === _this.data.token.toLowerCase()
        )
      } else {
        this.token =
          this.$store.state.tokenListV2.entitiesBy.address[
            get(this.data, 'token', '')
          ]
      }
      await this.getEgtValue()
      await this.getMorgageRate()
    },
    convertTime() {
      if (this.data.settleday < 600000) {
        this.data.settleday = this.data.settleday * 60 * 60
      }
      if (this.data.filledTime < 1500000000) {
        this.data.filledTime = this.data.filledTime * 60 * 60
      }
      if (this.data.startday < 1500000000) {
        this.data.startday = this.data.startday * 60 * 60
      }
      if (this.data.completeordertime < 1500000000) {
        this.data.completeordertime = this.data.completeordertime * 60 * 60
      }
    }
  },
  async mounted() {
    this.convertTime()
    if (this.data.settleday >= 0) {
      this.getNow()
    }
    this.getToken()
  },
  destroyed() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  },
}
</script>

<style lang="scss" scoped>
.order-block {
  border-radius: 15px;
  overflow: hidden;
  font-family: Roboto;
}
.order-header {
  background-color: #7bceb9;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  &[data-type="tbt"] {
    background-color: #6DF6FF !important;
  }
}
.order-token-img {
  width: 36px;
  @include dai_vuetify_md {
    width: 22px;
  }
}

.order-content {
  background-color: #f1f1f1;
  &[data-type="tbt"] {
    background-color: #D7EEFF !important;
  }
}
.order-btn {
  background-color: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
.center-block {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.order-content .center-block {
  font-size: 22px;
  & > div:nth-child(2) {
    font-size: 21px;
    font-weight: bold;
    @include dai_vuetify_md {
      font-size: 20px;
    }
  }
  @include dai_vuetify_md {
    font-size: 14px;
  }
}

.en .order-block .center-block > div:first-child {
  @include dai_vuetify_md {
    line-height: 17px;
    height: 32px;
    max-width: 104px;
    display: flex;
    align-items: center;
  }
}

.text-green {
  color: #00a77b;
}
</style>
