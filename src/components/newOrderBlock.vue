<script>
import { BREACH_BUFFER_HOUR } from '@/constant/order'
import base from '@/mixin/base.js'
import get from 'lodash/get'
export default {
  name: 'new-order-block',
  mixins: [base],
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
    },
    'data.filledTime'(newVal) {
      if (newVal) {
        this.getNow()
      }
    },
  },
  computed: {
    isLender() {
      return this.mode === 'loan'
    },
    status() {
      if (this.data.canOrder) {
        return 'waiting'
      } else if (this.data.isComplete) {
        // && this.data.filledTime + this.data.settleday + 12 >= this.now / 3600000
        return 'repay'
      } else if (
        this.data.filledTime + this.data.settleday + BREACH_BUFFER_HOUR * 3600 >=
          this.now / 1000 &&
        this.now / 1000 >= this.data.filledTime + this.data.settleday
      ) {
        return 'buffer'
      } else if (
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
    apr() {
      return this.mode === 'loan'
        ? this.round(
            (365 / (this.data.settleday / 60 / 60 / 24)) * this.round(this.data.rate)
          )
        : this.round(
            (365 / (this.data.settleday / 60 / 60 / 24)) *
              (this.round(this.data.rate) / 2)
          )
    },
  },
  methods: {
    get,
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
    toUpperCase(str) {
      if (!str) return str;
      if (typeof str !== 'string') return str;
      return str.toUpperCase();
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
        this.timer = window.setInterval(function () {
          _this.now = Math.floor(Date.now())
          _this.dueTime =
            (_this.data.filledTime + _this.data.settleday) * 1000
          let offsetTIme = (_this.dueTime - _this.now) / 1000

          if (offsetTIme < -(BREACH_BUFFER_HOUR * 3600)) {
            sec = min = hour = day = 0
            window.clearInterval(_this.timer)
          } else {
            sec = parseInt(offsetTIme % 60)
            min = parseInt((offsetTIme / 60) % 60)
            hour = parseInt((offsetTIme / 60 / 60) % 24)
            day = parseInt(offsetTIme / 60 / 60 / 24)
          }

          _this.countdown = { day, hour, min, sec }
        }, 1000)
      }
    },
    async getToken() {
      let _this = this
      if (this.data.version === 1) {
        this.token = this.$store.state.tokenList.find(
          (item) =>
            get(item, 'tokenaddress', '').toLowerCase() ===
            get(_this.data, 'token', '').toLowerCase()
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
    }
  },
  async mounted() {
    this.convertTime()
    if (this.data.filledTime) {
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
.order-content[data-type='tbt']:nth-child(even) {
  background-color: #a594bf;
}
.order-content[data-type='usdt']:nth-child(even) {
  background-color: #ccfcfc;
}
.order-content[data-type='tbt']:nth-child(odd),
.order-btn[data-type='tbt'] {
  background-color: #e4dcef;
}
.order-content[data-type='usdt']:nth-child(odd),
.order-btn[data-type='usdt'] {
  background-color: #edfefe;
}
</style>
<template>
  <div class="order-block">
    <div class="order-block-header" :data-type="$route.params.token">
      <span class="order-block-id">
        <span class="icon-bg" :class="`${token.name}`">
          <img
            v-if="token.name"
            :src="
              require('@/assets/img/borrow/' +
                get(token, 'name', '').toLowerCase() +
                '.svg')
            "
            alt=""
          />
        </span>
        <span :title="data.version">
          {{ $t('id') }} {{ data.sorterId ? data.sorterId : data.id }}
        </span>
      </span>
      <span class="order-block-apr"> {{ $t('APR') }} {{ apr }}% </span>
      <strong class="order-block-loandays">
        {{
          data.canOrder
            ? `${$t('loanDays')} ${Math.floor(data.settleday / 60 / 60 / 24)} ${$t(
                'day'
              )}`
            : `${
                status === 'breach'
                  ? $t('expired')
                  : status === 'buffer'
                  ? $t('buffer')
                  : $t('due')
              } ${countdown.day}${$t('day')} ${countdown.hour}${$t('hour')} ${
                countdown.min
              }${$t('min')} ${countdown.sec}${$t('sec')}`
        }}
      </strong>
    </div>
    <div class="order-block-content" :data-type="$route.params.token">
      <span>
        <label class="label"
          ><span v-html="$t('marketValueLabel')"></span>({{
            toUpperCase($route.params.token)
          }})</label
        >
        <div class="value">{{ round(value, 0) | numberFormat }}</div>
      </span>
      <span>
        <label
          class="label"
          v-html="`${$t('loanTokenAmount')}(${toUpperCase(token.name)})`"
        ></label>
        <div class="value">
          {{ (round(data.amount, 2) || 0) | numberFormat }}
        </div>
      </span>
      <span>
        <strong class="btn unlock-token" v-if="isLock" @click.stop="approve">{{
          $t('unlockToken')
        }}</strong>
        <strong
          class="btn deposit"
          v-else
          @click.stop="clickBtn()"
          :disabled="
            isLender ? completed : data.canOrder ? false : data !== 'breach'
          "
        >
          {{ $t(buttonText) }}
        </strong>
        <div class="loan-mortgage">
          <span class="ltv-label">
            {{ $t('loanMortgage') }}
          </span>
          <strong>{{ rate }}%</strong>
        </div>
      </span>
      <span>
        <label class="label"
          >{{ $t('loanAmount') }}({{
            $route.params.token.toUpperCase()
          }})</label
        >
        <div class="value text-green">
          {{ round(data.want) | numberFormat }}
        </div>
      </span>
      <span>
        <label class="label" v-html="$t('loanRateFull')"></label>
        <div class="value text-green">
          {{ isLender ? round(data.rate) : round(data.rate / 2) }}%
        </div>
      </span>
      <span>
        <label class="label">{{
          $t('loanInterestFull', { token: $route.params.token.toUpperCase() })
        }}</label>
        <div class="value text-green">
          {{
            (isLender
              ? ((data.want * data.rate) / 100).toFixed(2)
              : ((data.want * data.rate) / 100 / 2).toFixed(2)) | numberFormat
          }}
        </div>
      </span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.order-block {
  color: #000000;
  background-color: #f1f1f1;
  border-radius: 15px;
  margin: 0 7px;
  overflow: hidden;
}
.order-block-header {
  background: #dcdcdc;
  display: flex;
  padding: 17px 22px;
  border-radius: 15px 15px 0px 0;
  align-items: center;
  @include dai_vuetify_md {
    padding: 11px 10px;
  }
  &[data-type="tbt"] {
    background: #6DF6FF !important;
  }
}

.order-block-id {
  font-size: 28px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: 2px;
  border-radius: 50%;
  @include dai_vuetify_md {
    font-size: 16px;
  }
}

.icon-bg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  @include dai_vuetify_md {
    width: 29px;
    height: 29px;
  }
}
.order-block-id img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  @include dai_vuetify_md {
    width: 25px;
    height: 25px;
  }
}

.icon-bg.egt {
  background: radial-gradient(66% 66% at 70% 34%, #8230ff 0%, #5a0a98 100%);
}

.order-block-apr {
  font-size: 20px;
  margin-left: 21px;
  background: #ffe600;
  box-shadow: 0px 0px 6.52098px rgba(0, 0, 0, 0.25);
  border-radius: 19.5629px;
  padding: 6px 13px;
  @include dai_vuetify_md {
    font-size: 12px;
    padding: 3px 8px;
    margin-left: 9px;
  }
}

.order-block-loandays {
  font-size: 28px;
  margin-left: auto;
  @include dai_vuetify_md {
    font-size: 16px;
  }
}

.order-block-content {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr auto 1fr;
  padding: 25px 21px;
  line-height: 25px;
  gap: 29px;
  @include dai_vuetify_md {
    padding: 16px 10px;
    gap: 12px;
  }
  &[data-type="tbt"] {
    background-color: #D7EEFF;
  }
}

.order-block-content > span {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  @include dai_vuetify_md {
    gap: 0px;
  }
}

.order-block-content .label {
  font-size: 22px;
  line-height: 26.6px;
  @include dai_vuetify_md {
    font-size: 14px;
    white-space: nowrap;
    line-height: 15px;
  }
}

.en .order-block-content .label,
.en .btn.label {
  text-align: center;
  white-space: initial;
  @include dai_vuetify_md {
    height: 32px;
    max-width: 104px;
  }
}

.order-block-content .value {
  font-size: 32px;
  font-weight: bold;
  @include dai_vuetify_md {
    font-size: 20px;
  }
}

.order-block-content .value.text-green {
  color: #00a77b;
}

.btn {
  width: 133px;
  height: 43px;
  line-height: 43px;
  font-size: 26.19px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
  @include dai_vuetify_md {
    font-size: 16px;
    line-height: 18px;
    width: 80px;
    height: 26px;
    line-height: 28px;
  }
  &:active {
    transform: scale(0.95);
    filter: grayscale(0.3);
  }
}

.btn.unlock-token {
  background: #d85959;
}
.btn.deposit {
  background: #00a77b;
}

.loan-mortgage {
  display: flex;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  @include dai_vuetify_md {
    font-size: 10px;
  }
  .ltv-label {
    white-space: nowrap;
    font-size: 16px;
    margin-right: 6px;
    @include dai_vuetify_md {
      font-size: 10px;
    }
  }
}

.loan-mortgage strong {
  font-size: 18px;
  @include dai_vuetify_md {
    font-size: 14px;
  }
}
</style>
