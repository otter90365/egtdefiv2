<template>
  <v-container class="defi-borrow-loans-page">
    <v-row justify="center" class="my-md-15 my-2 mb-15">
      <v-col cols="12" sm="9">
        <!-- <v-card
          light
          class="defi-borrow-loans-card card-wrap d-flex flex-column justify-center align-center"
        >
          <img
            :src="
              `${require(`@/assets/img/icon-borrow-${$route.params.token}.png`)}`
            "
            width="60px"
            class="mb-5"
          />
          <h2 class="mb-5" :class="`primary_${$route.params.token}--text`">
            {{ $t('myLoans') }}
          </h2>

          <div
            class="d-flex flex-column flex-md-row justify-center align-end align-md-center mb-2"
            style="width: 100%;"
          >
            <div
              class="d-flex justify-center align-center mb-2 mb-md-0"
              style="width: 100%;"
            >
              <div class="mr-3">{{ $t('loanToken') }}</div>
              <v-select
                v-model="search"
                outlined
                dense
                hide-details
                full-width
                :items="tokenItems"
                :item-text="'name'"
                :item-value="'value'"
                :color="`primary_${$route.params.token}`"
                :item-color="`primary_${$route.params.token}`"
              ></v-select>
            </div>
          </div> -->

        <div class="mb-8" style="width: 100%;">
          <noRecord v-if="currOrdersDetail.length === 0"></noRecord>
          <orderBlock
            v-for="(order, i) in currOrdersDetail"
            :key="i"
            mode="loan"
            :isLock="lockCheck(order)"
            :data="order"
            :buttonText="buttonTextState(order)"
            @clickBtn="clickBtn(order)"
            @approve="approve()"
          ></orderBlock>
        </div>

        <v-pagination
          v-if="currOrdersDetail.length !== 0"
          class="mb-8"
          v-model="currPage"
          :length="totalPage"
          :total-visible="7"
          :color="`primary_${$route.params.token}`"
        ></v-pagination>

        <btn
          class="mb-5"
          :buttonText="'createLoan'"
          :color="`primary_${$route.params.token}`"
          :isCenter="true"
          :width="270"
          @clickBtn="
            $router.push({
              name: 'Defi-borrow-create',
              params: { token: $route.params.token },
            })
          "
        ></btn>
        <!-- <div class="can-click" @click="$router.push({ name: 'Home' })">
          {{ $t('backToIndex') }}
        </div> -->
        <!-- </v-card> -->
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="loadingText"></loading>
    <v-dialog v-model="warningShow" :max-width="500" :width="'90%'">
      <v-card
        class="d-flex flex-column justify-center align-center pa-5"
        height="300"
      >
        <div class="text-center">{{ $t('editWarning') }}</div>
        <div class="text-center mb-5">{{ $t('editSubWarning') }}</div>
        <div class="d-flex justify-center align-center">
          <btn class="mr-2" :buttonText="'modify'" @clickBtn="edit()"></btn>
          <btn
            :buttonText="'cancel'"
            isOutlined
            @clickBtn="warningShow = false"
          ></btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { BREACH_BUFFER_HOUR } from '@/constant/order'
import btn from '@/components/btn.vue'
import orderBlock from '@/components/orderPosition.vue'
import loading from '@/components/loading.vue'
import noRecord from '@/components/noRecord.vue'
import Defi from '@/plugins/defi.js'
import bscUsdt from '@/plugins/bscUsdt.js'
import bscTbt from '@/plugins/bscTbt.js'
import DefiV2 from '@/plugins/defiV2'
import { newOrderStartIndex } from '@/constant/order'
export default {
  name: 'Defi-borrow-loans',
  data() {
    return {
      defiContract: null,
      defiContract2: null,
      tokenContract: null,
      tokenContractV1: null,
      isMember: false,
      isMemberV2: false,
      orders: [],
      currOrdersDetail: [],
      loadingShow: false,
      loadingText: '',
      warningShow: false,
      usdtBalance: 0,
      usdtAllowance: 0,
      usdtAllowanceV1: 0,
      order: {},
      timer: null,
      currPage: 1,
      search: '',
      allSearch: [],
      tokenItems: [],
      allOrders: [],
      tokenItemsV2: [],
      allSearchV2: [],
    }
  },
  components: {
    btn,
    orderBlock,
    loading,
    noRecord,
  },
  watch: {
    currPage: {
      handler: async function() {
        this.loadingShow = true
        // await this.getOrderDetail();
        await this.getAllOrderDetails()
        this.loadingShow = false
      },
    },
    search: {
      handler: async function() {
        this.loadingText = 'waitGetData'
        this.loadingShow = true
        // await this.getSelfOrders();
        this.currPage = 1
        this.loadingShow = false
      },
    },
  },
  computed: {
    totalPage() {
      // return Math.ceil(this.orders.length / this.dataPerPage);
      return Math.ceil(this.allOrders.length / this.dataPerPage)
    },
    dataPerPage() {
      return 10
    },
    currIndex() {
      let index = this.orders.slice(
        this.dataPerPage * (this.currPage - 1),
        this.dataPerPage * this.currPage
      )
      return index
    },
    currIndexList() {
      return this.allOrders.slice(
        this.dataPerPage * (this.currPage - 1),
        this.dataPerPage * this.currPage
      )
    },
  },
  methods: {
    async getSelfAllOrders() {
      /** @type {(number[] | 'error')[]} */
      let allItemGroup = []
      if (this.isMember) {
        allItemGroup = await Promise.all(
          this.allSearch.map((address) => {
            return this.defiContract.getSelfOrders(
              address,
              'borrower',
              this.$store.state.account
            )
          })
        )
      }
      /** @type {(number[] | 'error')[]} */
      let allItemGroup2 = []
      if (this.isMemberV2) {
        allItemGroup2 = await Promise.all(
          this.allSearchV2.map((address) => {
            return this.defiContract2.getSelfOrders(
              address,
              'borrower',
              this.$store.state.account
            )
          })
        )
      }

      const dictWithGroupOrders = allItemGroup
        .map((group, i) => {
          if (group === 'error') return []
          return group
            .map((tokenOrder) => ({
              tokenAddress: this.allSearch[i],
              tokenOrder,
              sorterId: +tokenOrder,
              version: 1,
            }))
            .sort((a, b) => {
              return parseInt(b.sorterId) - parseInt(a.sorterId)
            })
        })
        .flat()

      const dictWithGroupOrders2 = allItemGroup2
        .map((group, i) => {
          if (group === 'error') return []
          return group
            .map((tokenOrder) => ({
              tokenAddress: this.allSearchV2[i],
              tokenOrder,
              sorterId: newOrderStartIndex + +tokenOrder,
              version: 2,
            }))
            .sort((a, b) => {
              return parseInt(b.sorterId) - parseInt(a.sorterId)
            })
        })
        .flat()

      this.allOrders = dictWithGroupOrders2.concat(dictWithGroupOrders)
      await this.getAllOrderDetails()
    },
    /** @deprecated */
    async getSelfOrders() {
      let tokenOrders = await this.defiContract.getSelfOrders(
        this.search,
        'borrower',
        this.$store.state.account
      )

      if (tokenOrders !== 'error') {
        // console.log('tokenOrders', tokenOrders);
        this.orders = tokenOrders
        this.orders.sort((a, b) => {
          return parseInt(b) - parseInt(a)
        })
        await this.getOrderDetail()
      } else {
        this.$toasted.error(this.$t('errorOccured'))
        this.orders = []
        this.currOrdersDetail = []
      }
    },
    /** @deprecated */
    async getOrderDetail() {
      this.currOrdersDetail = await this.defiContract.getOrderDetail(
        this.search,
        this.currIndex,
        false,
        true,
        'borrower'
      )
    },
    async getAllOrderDetails() {
      const result = await Promise.all([
        this.isMember
          ? this.defiContract.getAllOrderDetail(
              this.currIndexList.filter((ele) => ele.version === 1),
              false,
              true,
              'borrower'
            )
          : [],
        this.isMemberV2
          ? this.defiContract2.getAllOrderDetail(
              this.currIndexList.filter((ele) => ele.version === 2),
              false,
              true,
              'borrower'
            )
          : [],
      ])
      this.currOrdersDetail = result.flat()
      
      let frontList = []
      let middleList = []
      let lastList = []
      const now = Math.floor(Date.now())
      this.currOrdersDetail.forEach(item => {
        if (item.canOrder) {
          middleList.push(item)
        } else if (item.isComplete || (!item.isComplete && now / 1000 > item.filledTime + item.settleday + BREACH_BUFFER_HOUR * 3600)) {
          // repay, isCancel, breach => filledTime 排序 (如果沒有就 startday)(放後面)
          lastList.push(item)
        } else {
          // buffer, loaning => filledTime + settleday 排序 (放前面)
          frontList.push(item)
        }
      })
      lastList.sort((a, b) => (b.filledTime || b.startday) - (a.filledTime || a.startday))
      frontList.sort((a, b) => (a.filledTime + a.settleday) - (b.filledTime + b.settleday))
      this.currOrdersDetail = [...frontList, ...middleList, ...lastList] 
    },
    async clickBtn(order) {
      if (this.$store.state.chainId) {
        if (order.canOrder) {
          this.warningShow = true
          this.order = order
        } else {
          // 還款
          if (this.usdtBalance >= order.want) {
            let result
            this.loadingShow = true
            this.loadingText = 'inTransaction'
            if (order.version === 1) {
              result = await this.defiContract.payback(order.token, order.id)
                .catch(err => err)
            } else {
              result = await this.defiContract2.payback(order.token, order.id)
            }
            this.loadingShow = false
            // console.log('result', result)
            if (result.txHash) {
              this.$toasted.show(this.$t('txSend'))
              this.getSelfAllOrders()
            } else if (result.code === 4001) {
              this.$toasted.error(this.$t('userRefuse'))
            } else {
              console.error(result.message)
            }
          } else {
            this.$toasted.error(
              this.$t(`${this.$route.params.token.toUpperCase()}UnderBalance`)
            )
          }
        }
      } else {
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async edit() {
      if (this.$store.state.chainId) {
        this.loadingShow = true
        this.loadingText = 'inTransaction'
        const version = this.order.version
        const usedContract =
          version === 1 ? this.defiContract : this.defiContract2
        let result = await usedContract.cancel(this.order.token, this.order.id)
          .catch(err => err)
        this.loadingShow = false
        // console.log('result', result)
        if (result.txHash) {
          this.$toasted.show(this.$t('txSend'))
          let token = this.$store.state.tokenList.find(
            (item) => item.tokenaddress === this.order.token
          )
          if (version === 2) {
            token = this.$store.state.tokenListV2.entitiesBy.address[this.order.token]
          }
          if (token) {
            if (token.name === 'egt') {
              this.$router.push({
                name: `Defi-borrow-create-${token.name}`,
                params: { order: this.order },
              })
            } else {
              this.$router.push({
                name: `Defi-borrow-create-swapToken`,
                params: {
                  token: this.$route.params.token,
                  swapToken: token.name,
                  order: this.order,
                },
              })
            }
          } else {
            this.$toasted.show(this.$t('errorOccured'))
          }
        } else if (result.code === 4001) {
          this.$toasted.error(this.$t('userRefuse'))
        } else {
          console.error(result.message)
        }
      } else {
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    buttonTextState(order) {
      return order.canOrder
        ? 'modify'
        : order.isComplete
        ? order.filledTime
          ? 'repay'
          : 'isCancel'
        : 'payback'
    },
    async approve() {
      if (this.$store.state.chainId) {
        this.loadingShow = true
        this.loadingText = 'inTransaction'
        let result = await this.tokenContract.approve()
          .catch(err => err)
        // console.log('result', result)
        if (result.txHash) {
          this.loadingText = 'waitApprove'
          this.loadingShow = true
          let _this = this
          if (this.timer) {
            window.clearInterval(this.timer)
            this.timer = -1
          }
          this.timer = window.setInterval(async () => {
            _this.usdtAllowance = await _this.tokenContract.getAllowance(
              this.$store.state.account
            )
            if (_this.usdtAllowance >= _this.usdtBalance) {
              window.clearInterval(_this.timer)
              _this.loadingShow = false
            }
          }, 1000)
        } else if (result.code === 4001) {
          this.$toasted.error(this.$t('userRefuse'))
          this.loadingShow = false
        } else {
          if (result instanceof Error)
            console.error(result.message)
          this.loadingShow = false
        }
      } else {
        this.$toasted.error(this.$t('changeMainnet'))
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
  unmounted() {
    window.clearInterval(this.timer)
  },
  async mounted() {
    // defi contract
    this.loadingText = 'waitGetData'
    this.loadingShow = true
    this.defiContract = await new Defi()
    this.defiContract2 = await new DefiV2()
    const isMember = (this.isMember = await this.defiContract.isMember(
      this.$store.state.account
    ))
    const isMemberV2 = (this.isMemberV2 = await this.defiContract2.isMember(
      this.$store.state.account
    ))
    if (isMember || isMemberV2) {
      if (this.$route.params.token === 'usdt') {
        this.tokenContract = await new bscUsdt(2)
      } else {
        this.tokenContract = await new bscTbt(2)
      }

      if (isMember) {
        if (this.$route.params.token === 'usdt')
          this.tokenContractV1 = new bscUsdt(1)
        else this.tokenContractV1 = new bscTbt(1)
      }

      this.usdtBalance = await this.tokenContract.getBalance(
        this.$store.state.account
      )

      await this.getUsdtAllowance()
      // for (let i = 0; i < this.$store.state.tokenList.length; i++) {
      //   this.tokenItems.push({
      //     name: this.$store.state.tokenList[i].name.toUpperCase(),
      //     value: this.$store.state.tokenList[i].tokenaddress,
      //   });
      // }
      this.tokenItems = this.$store.state.tokenList.map((item) => ({
        name: item.name.toUpperCase(),
        value: item.tokenaddress,
      }))
      if (this.tokenItems[0]) {
        // this.search = this.tokenItems[0].value;
        this.allSearch = this.tokenItems.map(({ value }) => value)
        this.allSearchV2 = this.$store.state.tokenListV2.addresses
        this.currPage = 1
        await this.getSelfAllOrders()
      }

      // await this.getSelfOrders()
      this.loadingShow = false
    } else {
      this.$store.commit('updateRegistryOpen', true)
    }
  },
}
</script>

<style lang="scss" scoped>
.defi-borrow-loans-page {
}
</style>
