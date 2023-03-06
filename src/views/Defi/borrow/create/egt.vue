<template>
  <v-container class="defi-page">
    <v-row justify="center" class="my-md-15 mt-2 mb-15">
      <v-col cols="11" sm="9" md="6">
        <v-card
          light
          class="defi-card px-6 px-md-12 card-wrap d-flex flex-column justify-center align-center"
        >
          <div></div>
          <h2 class="mb-3 deposit-title">
            <img
              :src="`${require(`@/assets/img/borrow/${$route.params.token}.svg`)}`"
              class="token-icon"
            />
            EGT / {{ $route.params.token.toUpperCase() }}
          </h2>
          <div class="deposit-subtitle mb-4" v-t="'depositNotify'"></div>

          <v-form
            ref="form"
            lazy-validation
            style="width: 100%; gap: 6px"
            class="mb-5 d-flex flex-column"
          >
            <inputBlock
              :title="{
                key: 'pleaseEnterAmount',
                arg: { token: 'EGT' },
              }"
              :unit="$t('piece')"
              mode="balance"
              :token="'egt'"
              :inputText.sync="loan.egtAmount"
              :disabled="allowance < balance ? true : false"
              :balance="balance"
              :rules="[...TokenAmountRules]"
            ></inputBlock>
            <div class="d-flex justify-space-between mb-4 loan-usable">
              <span
                >{{ $t('usable') }}: {{ Math.min(allowance, balance) }}
                {{ ($route.params.swapToken || '').toUpperCase() }}</span
              >
              <span
                >{{ $t('marketValue') }}:
                {{ isNaN(parseFloat(value)) ? '-' : parseFloat(value) }}
                {{ $route.params.token === 'usdt' ? 'USDT' : 'TBT' }}</span
              >
            </div>
            <inputBlock
              title="pleaseSelectLoansDays"
              :unit="$t('day')"
              mode="select"
              :inputText.sync="loan.date"
              :disabled="allowance < balance ? true : false"
            ></inputBlock>
            <inputBlock
              title="pleaseEnterWantedLoan"
              :unit="$route.params.token === 'usdt' ? 'UT' : 'TBT'"
              :inputText.sync="loan.amount"
              :rules="[...TokenAmountRules]"
              :disabled="allowance < balance ? true : false"
            ></inputBlock>

            <div class="d-flex justify-end mb-5 loan-usable">
              {{ $t('loanMortgage') }}: {{ rate }} %
            </div>

            <inputBlock
              title="pleaseProvideLoanRate"
              unit="%"
              :inputText.sync="loan.interest"
              :rules="[...TokenAmountRules, ...rateRules]"
              :disabled="allowance < balance ? true : false"
            ></inputBlock>
            <!-- <inputBlock
              title="marketValue"
              :unit="$route.params.token === 'usdt' ? 'UT' : 'TBT'"
              mode="onlyText"
              :inputText="value"
            ></inputBlock>
            <inputBlock
              title="loanMortgage"
              unit="%"
              mode="onlyText"
              :inputText="rate"
            ></inputBlock> -->
            <!--<div class="d-flex justify-space-between">
              <div>
                <span class="mr-10">{{ $t('gasNowEstimate') }}</span>
                <span class="gas-text error--text font-weight-bold">{{ gasNow }}</span>
              </div>
              <span>UT</span>
            </div>
            <div class="d-flex justify-center error--text subtitle-2 font-weight-bold text-center">
              {{ $t('gasWarning') }}
            </div>
            <div class="d-flex justify-end subtitle-2">
              {{ $t('priceUpdated') }} {{ timestampToTime(updateTime) }}
            </div>-->
          </v-form>

          <btn
            class="mb-5"
            v-if="allowance === 0 || allowance < balance"
            :buttonText="'approve'"
            :color="'red darken-1'"
            :isCenter="true"
            :width="270"
            :isLoading="onTransactionLoading"
            @clickBtn="approve()"
          ></btn>
          <btn
            class="mb-5"
            v-else
            :buttonText="'apply'"
            :color="`primary_${$route.params.token}`"
            :isCenter="true"
            :width="270"
            :isLoading="onTransactionLoading"
            @clickBtn="create()"
          ></btn>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitApprove'"></loading>
    <warning
      :warningShow="warningShow"
      @confirm="warningShow = false"
    ></warning>
  </v-container>
</template>
<script>
import DefiV2 from '@/plugins/defiV2.js'
import EGT from '@/plugins/egt.js'
import inputBlock from '@/components/inputBlock.vue'
import btn from '@/components/btn.vue'
import loading from '@/components/loading.vue'
import warning from '@/components/warning.vue'
import base from '@/mixin/base.js'
import { EGTAddress } from '@/assets/contract'
export default {
  name: 'Defi-borrow-create-egt',
  mixins: [base],
  data() {
    return {
      defiContract: null,
      egtContract: null,
      loan: {
        egtAmount: null,
        date: 7 * 24,
        amount: null,
        interest: null,
      },
      balance: 0,
      allowance: 0,
      loadingShow: false,
      warningShow: true,
      timer: null,
      value: null,
      rate: null,
      gasNow: null,
      updateTime: null,
      gasLimit: 0,
      isMember: false,
      onTransactionLoading: false,
    }
  },
  watch: {
    'loan.egtAmount': {
      handler() {
        this.getEgtValue()
      },
    },
    'loan.amount': {
      handler() {
        this.getMorgageRate()
      },
    },
    value() {
      this.getMorgageRate()
    },
  },
  components: {
    inputBlock,
    btn,
    loading,
    warning,
  },
  methods: {
    async approve() {
      if (this.$store.state.chainId) {
        let result = await this.egtContract.approve()
        // console.log('result', result)
        if (result.txHash) {
          this.loadingShow = true
          this.timer = window.setInterval(async () => {
            this.allowance = await this.egtContract.getAllowance(
              this.$store.state.account
            )
            if (this.allowance >= this.balance) {
              window.clearInterval(this.timer)
              this.loadingShow = false
            }
          }, 1000)
        } else if (result.code === 4001) {
          this.$toasted.error(this.$t('userRefuse'))
        }
      } else {
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async getEgtValue() {
      this.value = await this.getValue(
        'egt',
        this.loan.egtAmount,
        this.$route.params.token
      )
    },
    async getMorgageRate() {
      this.rate = await this.getRate(this.loan.amount, this.value)
    },
    async create() {
      if (!this.isMember) {
        return this.$toasted.error(this.$t('registryBorrow'))
      }
      if (!(await this.defiContract.inWhiteList(this.$store.state.account))) {
        return this.$toasted.error(this.$t('notInWhiteList'))
      }
      if (this.$store.state.chainId) {
        if (this.$refs.form.validate()) {
          // console.log('loan', this.loan)
          this.loan.amount = parseFloat(this.loan.amount)
          this.loan.egtAmount = parseFloat(this.loan.egtAmount)
          this.loan.interest = parseFloat(this.loan.interest)
          this.onTransactionLoading = true
          let egtAddress = EGTAddress
          if (process.env.VUE_APP_TEST_TOKEN == 1) {
            egtAddress = this.$store.state.tokenListV2.entitiesBy.name['egt'].tokenaddress
          }
          const result = await this.defiContract
            .ercorder(this.loan, egtAddress)
            .catch((err) => err)
          this.onTransactionLoading = false

          if (result.txHash) {
            this.$toasted.show(this.$t('txSend'))
            this.$refs.form.reset()
            this.loan.date = 7 * 24
            await this.getBalance()
            this.$router.push({ name: 'Defi-borrow-create' })
          } else if (result.code === 4001) {
            this.$toasted.error(this.$t('userRefuse'))
          } else {
            if (result instanceof Error)
              this.$toasted.error(result.message)
          }
        }
      } else {
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async getBalance() {
      this.balance = await this.egtContract.getBalance(
        this.$store.state.account
      )
    },
    // Get 預估 gas
    connectGasWs() {
      let _this = this
      this.ws = new WebSocket(`wss://www.gasnow.org/ws`)
      this.ws.onopen = () => {
        // console.log('[Client] Successfully Connected', e)
      }
      this.ws.onmessage = async function (e) {
        let data = JSON.parse(e.data)
        // console.log('data', data)
        if (data.data && data.data.gasPrices) {
          try {
            let result = await _this.$store.dispatch('getTokenPrice', {
              token: 'ethereum',
              currency: 'usd',
            })
            if (result) {
              _this.gasNow = (
                parseFloat((data.data.gasPrices.standard / 10 ** 18) * 300000) *
                result.ethereum.usd
              ).toFixed(6)
              _this.updateTime = data.data.timestamp
            } else {
              this.$toasted.error(this.$t('cannotGetGas'))
              _this.gasNow = null
            }
          } catch (error) {
            console.log('error', error)
          }
        }
      }
      this.ws.onclose = () => {
        if (this.$route.path === '/borrow/create/egt') {
          this.$toasted.error(this.$t('renewGetGas'))
        }
        console.log('closed')
      }
    },
  },
  async mounted() {
    // defi contract
    this.defiContract = await new DefiV2()
    this.isMember = await this.defiContract.isMember(this.$store.state.account)
    // if (this.isMember){
    if (this.$refs.form) {
      this.$refs.form.resetValidation()
    }
    this.egtContract = await new EGT()
    this.getBalance()
    this.allowance = await this.egtContract.getAllowance(
      this.$store.state.account
    )
    this.gasLimit = await this.defiContract.getBorrowGas()
    this.connectGasWs()

    // 編輯訂單
    if (this.$route.params.order) {
      this.loan = {
        egtAmount: this.$route.params.order.amount,
        date: this.$route.params.order.settleday,
        amount: this.$route.params.order.want,
        interest: this.$route.params.order.rate,
      }
    }
    // }else{
    //   this.$router.push({name: 'Defi-registry'})
    // }
  },
  destroyed() {
    if (this.ws) {
      this.ws.close()
    }
  },
}
</script>

<style lang="scss" scoped>
.defi-page {
  .deposit-title {
    position: relative;
    width: 346px;
    height: 62px;
    justify-content: center;
    align-items: center;
    display: flex;
    color: white;
    background-color: #00126f;
    border-radius: 62px;
    font-size: 30px;
    @include dai_vuetify_md {
      width: 207px;
      border-radius: 37px;
      height: 37px;
      font-size: 17px;
    }
  }
  .deposit-subtitle {
    color: #ababab;
    font-size: 20px;
    @include dai_vuetify_md {
      font-size: 13px;
    }
  }
}
.defi-card {
  padding-left: 0;
  padding-right: 0;

  border-radius: 25px;
  @include dai_vuetify_md {
    border-radius: 14px;
  }
}

.token-icon {
  width: 36px;
  @include dai_vuetify_md {
    width: 20px;
  }
  margin-right: 21px;
  margin-left: -36px;
  filter: drop-shadow(0px 0px 5.31278px #ffffff);
}

.loan-usable {
  color: #818181;
  font-weight: bold;
  font-size: 24px;
  @include dai_vuetify_md {
    font-size: 14px;
  }
}
</style>
