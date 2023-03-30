import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import keyBy from 'lodash/keyBy'
import { COIN_GECKO_API_KEY } from '@/constant/coingecko'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

export default new Vuex.Store({
  state: {
    disclaimerIsShow: false,
    account: '',
    chainId: false,
    isEth: false,
    tokenList: [],
    tokenListV2: {
      entitiesBy: {
        address: {},
        name: {}
      },
      names: [],
      addresses: [],
    },
    DefiAddress: '',
    Defi2Address: '',
    EGTAddress: '',
    ETHAddress: '',
    TBTAddress: '0xd7F97f2cBcDC696484dA7C04AD012723392Ce30B',
    GameAddress: '',
    ADTAddress: '',
    locale: 'chs',
    langs: ['chs', 'en'],
    // langs: ['chs', 'en', 'tw'],
    tokens: ['usdt', 'tbt'],
    currToken: '',
    nowWidth: 0,
    registryOpen: false,
    locationWarning: false,
    rpcUrl: '',
  },
  mutations: {
    updateDisclaimerIsShow(state) {
      console.log('mutation update')
      state.disclaimerIsShow = !state.disclaimerIsShow
    },
    updateAccount(state, account) {
      state.account = account
    },
    updateChainId(state, chainId) {
      state.chainId = chainId
    },
    updateIsEth(state, isEth) {
      state.isEth = isEth
    },
    updateTokenList(state, tokenList) {
      state.tokenList = tokenList
      console.log('tokenList', tokenList)
      let EGT = tokenList.find((item) => item.name === 'egt')
      if (EGT) {
        state.EGTAddress = EGT.tokenaddress
      }
      let ETH = tokenList.find((item) => item.name === 'eth')
      if (ETH) {
        state.ETHAddress = ETH.tokenaddress
      }
    },
    updateTokenListV2(state, tokenList) {
      const byName = keyBy(tokenList, 'name')
      const byAddress = keyBy(tokenList, 'tokenaddress')

      state.tokenListV2.entitiesBy = {
        address: byAddress,
        name: byName
      }
      state.tokenListV2.addresses = Object.keys(byAddress)
      state.tokenListV2.names = Object.keys(byName)
    },
    updateAddress(state, address) {
      state.ADTAddress = address.adt
      // state.GameAddress = address.game
    },
    updateDefiContract(state, address) {
      state.DefiAddress = address
    },
    updateDefiV2Contract(state, address) {
      state.Defi2Address = address
    },
    updateLang(state, lang) {
      state.locale = lang
    },
    updateNowWidth(state, nowWidth) {
      state.nowWidth = nowWidth
    },
    updateCurrToken(state, currToken) {
      state.currToken = currToken
    },
    clearInfo(state) {
      state.account = ''
    },
    updateRegistryOpen(state, isOpen) {
      state.registryOpen = isOpen
    },
    updateLocationWarning(state, locationWarning) {
      state.locationWarning = locationWarning
    },
    updateRpcUrl(state, rpcUrl) {
      state.rpcUrl = rpcUrl
    }
  },
  getters: {
    disclaimerIsShow(state) {
      return state.disclaimerIsShow
    },
    backendUrl(state) {
      return state.currToken === 'usdt' ? 'https://egt-usd-defi.api-absolute-uv.com' : 'https://egt-tbt-defi.api-absolute-uv.com'
      // return state.currToken === 'usdt' ? 'https://staging-jackpot.egtdefibsc.com' : 'https://egttbt.egtdefibsc.com'
    },
    wsBackendUrl(state) {
      return state.currToken === 'usdt' ? 'wss://egt-usd-defi.api-absolute-uv.com' : 'wss://egt-tbt-defi.api-absolute-uv.com'
      // return state.currToken === 'usdt' ? 'wss://staging-jackpot.egtdefibsc.com' : 'wss://egttbt.egtdefibsc.com'
    },
  },
  actions: {
    async getTokenPrice(_, data) {
      if (COIN_GECKO_API_KEY) {
        const result = await Vue.axios.get(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${data.token}&vs_currencies=${data.currency}&include_last_updated_at=true&x_cg_pro_api_key=${COIN_GECKO_API_KEY}`)
        return result.data
      } else {
        let result = await Vue.axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${data.token}&vs_currencies=${data.currency}&include_last_updated_at=true`)
        return result.data
      }
    },
    async getAllOrders({ getters }) {
      let result = await Vue.axios.post(`${getters.backendUrl}/api/v1/orders`)
      return result.data
    },
    async getOrderDetails({ state }, data) {
      let result = await Vue.axios.get(`https://defi-v2.api-absolute-uv.com/api/v1/user_orders?basic_token=${state.currToken}&key=${data.type}&address=${state.account}`)
      return result.data
    },
    async getAllRecords(_, data) {
      // let result = await Vue.axios.get(`https://api-rinkeby.etherscan.io/api?module=account&action=txlist&&address=${data.defiAddress}&startblock=${data.startBlock}&endblock=${data.endBlock}&page=${data.page}&apikey=C9RIE4CZZGHNE7FICYK8FWWUC2MP8WAR86`)
      let result = await Vue.axios.get(`https://api.etherscan.io/api?module=account&action=txlist&&address=${data.defiAddress}&startblock=${data.startBlock}&endblock=${data.endBlock}&page=${data.page}&apikey=C9RIE4CZZGHNE7FICYK8FWWUC2MP8WAR86`)
      return result.data
    },
    // async getDefiContract({ getters, commit, state }) {
    //   try {
    //     let result = await Vue.axios.get(`${getters.backendUrl}/api/v1/defi_contract`)
    //     // console.log('defi contract result', result)
    //     if (result.data.status === 200) {
    //       commit('updateDefiContract', result.data.data)
    //     }
    //   } catch (error) {
    //     console.log('error', error)
    //   }
    //   commit('updateDefiV2Contract', state.currToken === 'usdt' ? USDTPageConfig.defiContract : TBTPageConfig.defiContract)
    // },
    async getRpcUrl({ state, commit }) {
      try {
        let result = await Vue.axios.get(`https://defi-v2.api-absolute-uv.com/api/v1/url`)
        if (result.data.status === 200) {
          commit('updateRpcUrl', result.data.data.url)
          commit('updateDefiContract', state.currToken === 'usdt' ? result.data.data.usdt_v1 : result.data.data.tbt_v1)
          commit('updateDefiV2Contract', state.currToken === 'usdt' ? result.data.data.usdt_v2 : result.data.data.tbt_v2)
        } else {
          commit('updateRpcUrl', 'https://bsc-dataseed.binance.org')
        }
      } catch (error) {
        commit('updateRpcUrl', 'https://bsc-dataseed.binance.org')
        console.log('error', error)
      }
    },
  },
  modules: {
  }
})
