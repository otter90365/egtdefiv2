<template>
  <v-container class="defi-deposit-orders-page">
    <v-row justify="center" class="my-md-15 my-2">
      <v-col cols="12" sm="9">

        <div class="mb-8" style="width: 100%">
          <noRecord v-if="currOrdersDetail.length === 0"></noRecord>
          <orderBlock
            v-for="(order, i) in currOrdersDetail"
            :key="i"
            :data="order"
            :buttonText="
              getOrderStatus(order)
            "
            @clickBtn="take(order)"
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
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitGetData'"></loading>
  </v-container>
</template>
<script>
// import btn from '@/components/btn.vue';
import orderBlock from '@/components/orderPosition.vue'
import loading from '@/components/loading.vue'
import noRecord from '@/components/noRecord.vue'
import Defi from '@/plugins/defi.js'
import DefiV2 from '@/plugins/defiV2'
import { BREACH_BUFFER_HOUR } from '@/constant/order'
export default {
  name: 'Defi-deposit-orders',
  data() {
    return {
      defiContract: null,
      defiContract2: null,
      isMember: false,
      orders: [],
      currOrdersDetail: [],
      loadingShow: false,
      currPage: 1,
      search: '',
      tokenItems: [],
      allSearch: [],
      allOrders: [],
    }
  },
  components: {
    // btn,
    orderBlock,
    loading,
    noRecord,
  },
  watch: {
    currPage: {
      handler: async function () {
        this.loadingShow = true
        // await this.getOrderDetail();
        await this.getAllOrderDetails()
        this.loadingShow = false
      },
    },
    search: {
      handler: async function () {
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
    /** @deprecated */
    async getSelfOrders() {
      let tokenOrders = await this.defiContract.getSelfOrders(
        this.search,
        'lender',
        this.$store.state.account
      )

      if (tokenOrders !== 'error') {
        this.orders = tokenOrders
        this.orders.sort((a, b) => {
          return parseInt(b) - parseInt(a)
        })
        await this.getOrderDetail()
        // console.log('this.orders', this.orders)
      } else {
        this.$toasted.error(this.$t('errorOccured'))
        this.orders = []
        this.currOrdersDetail = []
      }
    },
    async getSelfOrdersAll() {
      const isV1Member = await this.isV1Member()
      const isV2Member = await this.isV2Member()

      /** @type {(number[] | 'error')[]} */
      let allItemGroup = []

      if (isV1Member) {
        allItemGroup = await Promise.all(
          this.allSearch.map((address) => {
            return this.defiContract.getSelfOrders(
              address,
              'lender',
              this.$store.state.account
            )
          })
        )
      }

      /** @type {(number[] | 'error')[]} */
      let allItemGroup2 = []

      if (isV2Member) {
        allItemGroup2 = await Promise.all(
          this.$store.state.tokenListV2.addresses.map((tokenAddress) =>
            this.defiContract2.getSelfOrders(
              tokenAddress,
              'lender',
              this.$store.state.account
            )
          )
        )
      }

      const dictWithGroupOrders = allItemGroup
        .map((group, i) => {
          if (group === 'error') return []
          return group
            .map((tokenOrder) => ({
              tokenAddress: this.allSearch[i],
              tokenOrder,
              version: 1,
            }))
            .sort((a, b) => {
              return parseInt(b.tokenOrder) - parseInt(a.tokenOrder)
            })
        })
        .flat()

      const dictWithGroupOrders2 = allItemGroup2
        .map((group, i) => {
          if (group === 'error') return []
          return group
            .map((tokenOrder) => ({
              tokenAddress: this.$store.state.tokenListV2.addresses[i],
              tokenOrder: parseInt(tokenOrder),
              version: 2,
            }))
            .sort((a, b) => {
              return parseInt(b.tokenOrder) - parseInt(a.tokenOrder)
            })
        })
        .flat()
      this.allOrders = [...dictWithGroupOrders2, ...dictWithGroupOrders]
      this.allOrders.sort((a, b) => b.filledTime - a.filledTime)
      if (this.allOrders.length === 0) {
        return (this.currOrdersDetail = [])
      }
      await this.getAllOrderDetails()
    },
    getOrderStatus(data) {
      const now = Math.floor(Date.now())
      if (data.isComplete) {
        // && data.filledTime + data.settleday + 12 >= this.now / 3600000
        return 'repay'
      } else if (
        !data.isComplete &&
        now / 3600000 > data.filledTime + data.settleday + BREACH_BUFFER_HOUR
      ) {
        return 'breach'
      } else {
        return 'withdraw'
      }
    },
    /** @deprecated */
    async getOrderDetail() {
      this.currOrdersDetail = await this.defiContract.getOrderDetail(
        this.search,
        this.currIndex,
        false,
        true,
        'lender'
      )
    },
    async getAllOrderDetails() {
      const v1 = this.defiContract.getAllOrderDetail(
        this.currIndexList.filter((ele) => ele.version === 1),
        false,
        true,
        'lender'
      )
      const v2 = this.defiContract2.getAllOrderDetail(
        this.currIndexList.filter((ele) => ele.version === 2),
        false,
        true,
        'lender'
      )

      this.currOrdersDetail = (await Promise.all([v2, v1]))
        .flat()
        .sort((a, b) => {
          return a.sorterId - b.sorterId
        })

      this.currOrdersDetail.sort((a, b) => b.filledTime - a.filledTime)
    },
    async take(order) {
      if (this.$store.state.chainId) {
        let result
        this.loadingShow = true
        if (order.version === 1) {
          result = await this.defiContract.take(order.token, order.id)
            .catch(err => err)
        } else if (order.version === 2) {
          result = await this.defiContract2.take(order.token, order.id)
            .catch(err => err)
        }
        this.loadingShow = false

        // console.log('result', result)
        if (result.txHash) {
          this.$toasted.show(this.$t('txSend'))
        } else if (result.code === 4001) {
          this.$toasted.error(this.$t('userRefuse'))
        }
        this.getAllOrderDetails()
      } else {
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async isV2Member() {
      const isMember = await this.defiContract2.isMember(
        this.$store.state.account
      )
      return isMember
    },
    async isV1Member() {
      return await this.defiContract.isMember(this.$store.state.account)
    },
  },
  async mounted() {
    // defi contract
    this.loadingShow = true
    const defiContract = await new Defi()
    this.defiContract = defiContract
    const defiContract2 = await new DefiV2()
    this.defiContract2 = defiContract2
    let isMember = await defiContract.isMember(this.$store.state.account)
    const isMemberV2 = await defiContract2.isMember(this.$store.state.account)

    if (isMember || isMemberV2) {
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
        // this.search = this.tokenItems[0] ? this.tokenItems[0].value : '';
        this.allSearch = this.tokenItems.map(({ value }) => value)
        this.currPage = 1
        await this.getSelfOrdersAll()
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
.defi-deposit-orders-page {
}
</style>
