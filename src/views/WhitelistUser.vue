<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <span> 使用 token: </span>
        <v-btn-toggle mandatory v-model="usedToken">
          <v-btn small value="tbt">TBT</v-btn>
          <v-btn small value="usdt">USDT</v-btn>
        </v-btn-toggle>

        contract address: {{ contractAddress[usedToken] }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
        <v-text-field
          label="檢查account資訊"
          single-line
          outline
          v-model="account"
        >
        </v-text-field>
        <v-btn @click="check" class="ml-1" :loading="!isLoaded"> Check </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="showDetail">
      <v-col cols="12">
        <div v-if="!accountIsInWhiteList">
          <div>account address: {{ account }}</div>
          <v-btn @click="whiteListEnabled">
            將此 account 於 White list 設定啟用
          </v-btn>
        </div>

        <div v-else>
          <h3>{{ usedToken.toUpperCase() }}中</h3>
          <div class="flex">
            Whitelist 狀態：
            <span class="green"></span> 已啟用
          </div>
          <div class="flex">
            註冊狀態：
            <span>
              <span class="flex" v-if="accountIsEnabled">
                <span class="green"> </span>啟用
              </span>
              <span class="flex" v-else>
                <span class="red"> </span>尚未啟用
              </span>
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { DefiAddressV2TBT, DefiAddressV2USDT } from '@/assets/contract'
import base from '@/mixin/base'
import DefiV2 from '@/plugins/defiV2'

const Mapping = {
  tbt: DefiAddressV2TBT,
  usdt: DefiAddressV2USDT,
}

export default {
  mixins: [base],
  data() {
    return {
      usedToken: 'tbt',
      contract: {},
      isLoaded: true,
      account: '',

      showDetail: false,
      accountIsInWhiteList: false,
      accountIsEnabled: false,

      contractAddress: Mapping,
    }
  },
  async mounted() {
    await this.connectMetamask()
    this.contract[this.usedToken] = new DefiV2(DefiAddressV2TBT)
  },
  watch: {
    usedToken(value) {
      if (!this.contract[value]) {
        this.contract[value] = new DefiV2(Mapping[value])
      }
      if (this.account) {
        this.check()
      }
    },
    account(value, oldValue) {
      if (value !== oldValue) {
        this.showDetail = false
      }
    },
  },
  methods: {
    async check() {
      if (!this.account) {
        this.$toasted.error('account is empty')
        return
      }
      this.isLoaded = false
      this.showDetail = false
      try {
        this.accountIsInWhiteList = await this.contract[
          this.usedToken
        ].inWhiteList(this.account)
        this.accountIsEnabled = await this.contract[this.usedToken].isMember(
          this.account
        )
        this.showDetail = true
      } catch (error) {
        this.$toasted.error(error.message)
      }
      this.isLoaded = true
    },
    async whiteListEnabled() {
      try {
        this.isLoaded = false
        const account = this.account
        await this.contract[this.usedToken].whiteListUser(this.account)
        this.account = account
      } catch (error) {
        this.$toasted.error(error.message)
        console.error(error)
      }
      this.isLoaded = true
      await this.check()
    },
  },
}
</script>
<style>
.ml-1 {
  margin-left: 10px;
}
.flex {
  display: flex;
}
.green,
.red {
  display: flex;
  width: 30px;
  justify-content: center;
  align-items: center;
}
.green {
  color: rgb(34, 224, 34);
}
.red {
  color: red;
}
.red::after,
.green::after {
  content: '';
  background: currentColor;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
</style>
