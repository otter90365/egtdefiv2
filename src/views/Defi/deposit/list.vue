<template>
  <v-container class="defi-list-page" ref="container">
    <v-row justify="center">
      <v-col cols="12" md="9">
        <div
          class="mb-8 d-flex"
          style="width: 100%; gap: 16px; flex-direction: column"
        >
          <noRecord v-if="currOrders.length === 0"></noRecord>
          <Fragment v-else>
            <orderBlock
              v-for="(order, i) in currOrders"
              :key="(`${order.sorterId} ${order.token} ${i}`)"
              :data="order"
              buttonText="invest"
              :isLock="lockCheck(order)"
              @clickBtn="invest(order)"
              @approve="approve()"
            ></orderBlock>
          </Fragment>
        </div>

        <v-pagination
          v-if="currOrders.length !== 0"
          class="mb-8"
          v-model="currPage"
          :length="totalPage"
          :total-visible="7"
          :color="`primary_${$route.params.token}`"
        ></v-pagination>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="loadingText"></loading>
    <warning
      :warningShow="warningShow"
      :page="'deposit'"
      @confirm="warningShow = false"
    ></warning>
  </v-container>
</template>
<script>
import orderBlock from '@/components/newOrderBlock.vue'
import loading from '@/components/loading.vue'
import warning from '@/components/warning.vue'
import noRecord from '@/components/noRecord.vue'
import Defi from '@/plugins/defi.js'
import bscUsdt from '@/plugins/bscUsdt.js'
import bscTbt from '@/plugins/bscTbt.js'
import base from '@/mixin/base.js'
// import DefiV2 from '@/plugins/defiV2';

import DefiV2 from '@/plugins/defiV2'

export default {
  name: 'Defi-deposit-list',
  mixins: [base],
  data() {
    return {
      defiContract: null,
      defiContract2: null,
      tokenContract: null,
      tokenContractV1: null,
      isMember: false,
      isMemberV2: false,
      orders: [],
      filterOrders: [],
      currOrders: [],
      loadingShow: false,
      loadingText: '',
      warningShow: true,
      usdtBalance: 0,
      usdtBalanceV1: 0,
      usdtAllowance: 0,
      usdtAllowanceV1: 0,
      timer: null,
      currPage: 1,
      searchType: 'id',
      filterType: 'more',
      search: '',
      searchItems: [
        {
          name: this.$t('id'),
          value: 'id',
        },
        {
          name: this.$t('loanDays'),
          value: 'settleday',
        },
        {
          name: this.$t('loanToken'),
          value: 'token',
        },
        {
          name: this.$t('loanAmount'),
          value: 'want',
        },
        {
          name: this.$t('loanMortgage'),
          value: 'mortgage',
        },
        {
          name: this.$t('loanRate'),
          value: 'rate',
        },
      ],
      filterItem: [
        {
          name: this.$t('more'),
          value: 'more',
        },
        {
          name: this.$t('less'),
          value: 'less',
        },
      ],
      tokenItems: [],
      gasNow: null,
      updateTime: null,
      gasLimit: 0,
    }
  },
  components: {
    orderBlock,
    loading,
    warning,
    noRecord,
  },
  watch: {
    currPage(newVal) {
      this.currOrders = this.filterOrders.slice(10 * (newVal - 1), 10 * newVal)
      const _main = document.querySelector('main')
      _main.scrollTop = 0
    },
    '$store.state.locale': {
      handler: function () {
        this.searchItems = [
          {
            name: this.$t('id'),
            value: 'id',
          },
          {
            name: this.$t('loanDays'),
            value: 'settleday',
          },
          {
            name: this.$t('loanToken'),
            value: 'token',
          },
          {
            name: this.$t('loanAmount'),
            value: 'want',
          },
          {
            name: this.$t('loanMortgage'),
            value: 'mortgage',
          },
          {
            name: this.$t('loanRate'),
            value: 'rate',
          },
        ]

        this.filterItem = [
          {
            name: this.$t('more'),
            value: 'more',
          },
          {
            name: this.$t('less'),
            value: 'less',
          },
        ]
      },
    },
  },
  computed: {
    totalPage() {
      return Math.ceil(this.filterOrders.length / 10)
    },
  },
  methods: {
    async getMortgage(item, isV1Contract = true) {
      let token = ''
      if (isV1Contract) {
        token = this.$store.state.tokenList.find(
          (t) => t.tokenaddress.toLowerCase() === item.Token.toLowerCase()
        )
      } else {
        token = this.$store.state.tokenListV2.entitiesBy.address[item.token]
      }

      let value, rate
      if (token && isV1Contract) {
        value = await this.getValue(
          token.name,
          item.Amount / 10 ** 18,
          this.$route.params.token
        )
        rate = this.getRate(item.Want / 10 ** 18, value)
        return rate
      } else if (token) {
        value = await this.getValue(
          token.name,
          item.amount,
          this.$route.params.token
        )
      }
    },
    async getAllOrders() {
      this.orders = []
      try {
        if (this.isMember) {
          console.log('get1')
          let result = await this.$store.dispatch('getAllOrders')

          if (result.status === 200) {
            if (result.data) {
              let allOrders = []
              let data
              let _this = this
              for (let i = 0; i < result.data.length; i++) {
                if (
                  result.data[i].Token !==
                  '0x0000000000000000000000000000000000000000'
                ) {
                  let rate = await _this.getMortgage(result.data[i])
                  data = {
                    amount: result.data[i].Amount / 10 ** 18,
                    borrower: result.data[i].Borrower,
                    id: result.data[i].Id,
                    lender: result.data[i].Lender,
                    rate: parseInt(result.data[i].Rate) / 10 ** 16,
                    settleday: parseInt(result.data[i].Settleday),
                    startday: parseInt(result.data[i].Startday),
                    token: result.data[i].Token,
                    want: result.data[i].Want / 10 ** 18,
                    canOrder: true,
                    mortgage: rate ? parseFloat(rate) : null,
                    version: 1,
                  }
                  allOrders.push(data)
                }
              }
              this.orders = allOrders
              this.orders.sort((a, b) => {
                return parseInt(a.id) - parseInt(b.id)
              })
            } else {
              this.orders = []
              this.currOrders = []
              this.loadingShow = false
            }
          } else {
            this.$toasted.error(this.$t('errorOccured'))
            this.orders = []
            this.currOrders = []
          }
        }
      } catch (error) {
        console.log('error', error)
        this.$toasted.error(this.$t('errorOccured'))
        this.orders = []
        this.currOrders = []
      }

      // version 2
      try {
        const _this = this
        /** @type {string[]} */
        const tokenAddresses = this.$store.state.tokenListV2.addresses
        /** @type {{amount: number, borrower: string, id: number, lender: string, rate: number settleday: number, startday: number, token: string, want: number, canOrder: boolean; version: number; sorterId: number }[]} */
        const orders = await Promise.all(
          tokenAddresses.map((address) =>
            _this.defiContract2.getAllOrders(address)
          )
        )

        const afterMortgage = await Promise.all(
          orders
            .flat()
            .sort((a, b) => {
              return parseInt(b.startday) - parseInt(a.startday)
            })
            .map((item) => {
              return this.getMortgage(item, false).then((rate) => ({
                rate: rate ? parseFloat(rate) : null,
                ...item,
              }))
            })
        )

        this.orders = [...afterMortgage, ...this.orders]
        console.log(this.orders)
      } catch (error) {
        console.error(error)
      }

      this.filterOrders = JSON.parse(JSON.stringify(this.orders))
      this.currOrders = this.filterOrders.slice(0, 10)
      this.loadingShow = false
    },
    async invest(order) {
      await this.memberValidate()
      if (this.isMember || this.isMemberV2) {
        if (this.$store.state.chainId) {
          let pass = false
          if (order.version == 1) {
            pass = this.usdtBalanceV1 >= order.want
          } else {
            pass = this.usdtBalance >= order.want
          }
          if (pass) {
            let result
            if (order.version == 1) {
              result = await this.defiContract.selectOrder(
                order.token,
                parseInt(order.id)
              )
            } else {
              console.log(order)
              result = await this.defiContract2.selectOrder(
                order.token,
                parseInt(order.id)
              )
            }
            // console.log('result', result)
            if (result.txHash) {
              this.$toasted.show(this.$t('txSend'))
            } else if (result.code === 4001) {
              this.$toasted.error(this.$t('userRefuse'))
            }
            this.loadingShow = true
            await this.getAllOrders()
            this.loadingShow = false
          } else {
            this.$toasted.error(
              this.$t(`${this.$route.params.token.toUpperCase()}UnderBalance`)
            )
          }
        } else {
          this.$toasted.error(this.$t('changeMainnet'))
        }
      } else {
        this.$toasted.error(this.$t('registryDeposit'))
      }
    },
    async getUsdtBalance() {
      this.usdtBalance = await this.tokenContract.getBalance(
        this.$store.state.account
      )
      if (this.isMember) {
        this.usdtBalanceV1 = await this.tokenContractV1.getBalance(
          this.$store.state.account
        )
      }
    },
    async getUsdtAllowance() {
      this.usdtAllowance = await this.tokenContract.getAllowance(
        this.$store.state.account
      )
      if (this.isMember) {
        this.usdtAllowanceV1 = await this.tokenContractV1.getAllowance(
          this.$store.state.account
        )
      }
    },
    async approve() {
      if (this.$store.state.chainId) {
        let result = await this.tokenContract.approve()
        // console.log('result', result)
        if (result.txHash) {
          this.loadingText = 'waitApprove'
          this.loadingShow = true
          this.timer = window.setInterval(async () => {
            this.usdtAllowance = await this.tokenContract.getAllowance(
              this.$store.state.account
            )
            if (this.usdtAllowance >= this.usdtBalance) {
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
    async memberValidate() {
      // eslint-disable-next-line no-extra-semi
      ;[this.isMember, this.isMemberV2] = await Promise.all([
        this.defiContract.isMember(this.$store.state.account),
        this.defiContract2.isMember(this.$store.state.account),
      ])
    },
    lockCheck(order) {
      const version = order.version
      // usdtAllowance === 0 || usdtAllowance < usdtBalance
      if (version === 1) {
        return (
          this.usdtAllowanceV1 === 0 || this.usdtAllowanceV1 < this.usdtBalance
        )
      } else {
        return this.usdtAllowance === 0 || this.usdtAllowance < this.usdtBalance
      }
    },
  },
  async mounted() {
    // defi contract
    this.loadingText = 'waitGetData'
    this.loadingShow = true
    this.defiContract = new Defi()
    this.defiContract2 = new DefiV2()
    this.tokenItems = this.$store.state.tokenList.map((ele) => ({
      name: ele.name.toUpperCase(),
      value: ele.tokenaddress,
    }))

    // if (this.isMember){
    await this.memberValidate()
    await this.getAllOrders()
    if (this.$route.params.token === 'usdt') {
      this.tokenContract = await new bscUsdt(2)
    } else {
      this.tokenContract = await new bscTbt(2)
    }
    if (this.isMember) {
      if (this.$route.params.token === 'usdt') {
        this.tokenContractV1 = new bscUsdt(1)
      } else {
        this.tokenContractV1 = new bscTbt(1)
      }
    }
    await this.getUsdtBalance()
    await this.getUsdtAllowance()

    // this.connectGasWs()
    this.gasLimit = await this.defiContract.getInvestGas()
    this.loadingShow = false
  },
  destroyed() {
    if (this.ws) {
      this.ws.close()
    }
  },
}
</script>

<style lang="scss" scoped>
.defi-list-page {
  width: 100%;
  padding-top: 37px;
}
</style>
