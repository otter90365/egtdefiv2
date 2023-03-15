<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <span> 使用 token: </span>
        <v-btn-toggle mandatory v-model="usedToken">
          <v-btn small value="tbt">TBT</v-btn>
          <v-btn small value="usdt">USDT</v-btn>
        </v-btn-toggle>

        contract address: {{ $store.state.Defi2Address }}
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

    <v-row>
      <v-col cols="7">
        <v-text-field
          label="檢查controller資訊"
          single-line
          outline
          v-model="controller"
        >
        </v-text-field>
        <v-btn @click="checkController" class="ml-1" :loading="!isLoaded"> Check </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="showControllerDetail">
      <v-col cols="12">
        <div>
          <div>account address: {{ controller }}</div>
          <v-btn @click="setController">
            {{ accountIsController ? '將此 account 取消 Controller 權限' : '將此 account 設定為 Controller'}}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import base from '@/mixin/base'
import DefiV2 from '@/plugins/defiV2'

export default {
  mixins: [base],
  data() {
    return {
      usedToken: 'tbt',
      contract: {},
      isLoaded: true,
      account: '',

      controller: '',
      showControllerDetail: false,
      accountIsController: false,

      showDetail: false,
      accountIsInWhiteList: false,
      accountIsEnabled: false,
    }
  },
  async mounted() {
    await this.connectMetamask()
    this.$store.commit('updateCurrToken', 'tbt')
    await this.$store.dispatch('getRpcUrl')
    this.contract[this.usedToken] = new DefiV2(this.$store.state.Defi2Address)
  },
  watch: {
    async usedToken(value) {
      this.$store.commit('updateCurrToken', value)
      await this.$store.dispatch('getRpcUrl')
      if (!this.contract[value]) {
        this.contract[value] = new DefiV2(this.$store.state.Defi2Address)
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
    async checkController() {
      if (!this.controller) {
        this.$toasted.error('account is empty')
        return
      }
      this.isLoaded = false
      this.showControllerDetail = false
      try {
        this.accountIsController = await this.contract[
          this.usedToken
        ].isController(this.controller)
        this.showControllerDetail = true
      } catch (error) {
        this.$toasted.error(error.message)
      }
      this.isLoaded = true
    },
    async setController() {
      try {
        this.isLoaded = false
        await this.contract[this.usedToken].setController(this.controller)        
      } catch (error) {
        this.$toasted.error(error.message)
        console.error(error)
      }
      this.isLoaded = true
      await this.checkController()
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
