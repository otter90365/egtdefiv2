import tbtSwap from "@/plugins/tbtSwap.js";
import store from '@/store'
import debounce from 'lodash/debounce'
const tokenPriceDispatchFnSingleton = new Map()

function getTokenPriceSingleton(tokenType) {
  if (tokenPriceDispatchFnSingleton.has(tokenType)) {
    return tokenPriceDispatchFnSingleton.get(tokenType)(tokenType)
  }
  const cb = debounce((_tokenType) => store.dispatch('getTokenPrice', {
    token: _tokenType,
    currency: 'usd'
  }), 200, {leading: true})
  tokenPriceDispatchFnSingleton.set(cb)
  return cb(tokenType)
}

export default {
  data() {
    return {
      web3: null,
      // 表單驗證
      dataRules: (v) => !!v || 'Required',
      listRules: (v) => v.length !== 0 || 'Required',
      TokenAmountRules: [
        (v) => !!v || 'Required',
        (v) => /^[0-9]/.test(v) || 'Number Only',
        (v) => v > 0 || 'Cannot Be Negative',
      ],
      accountRules: [
        (v) => !!v || 'Required',
        (v) => /0x[\w]{40}/.test(v) || 'Please Enter Correct Address',
        (v) => v.length === 42 || 'Please Enter Correct Address',
      ],
      voteRules: [
        (v) => v <= 300 || 'No More Than 300',
        (v) => v >= 10 || 'Must Higher Than 10',
      ],
      TokenAmountRulesNoRequired: [
        (v) => /^[0-9]/.test(v) || 'Number Only',
        (v) => v > 0 || 'Cannot Be Negative',
      ],
      rateRules: [
        (v) => v >= 0.1 || 'Must Higher Than 0.1%',
        (v) => v <= 100 || 'No More Than 100%',
      ],
    };
  },
  methods: {
    timestampToDate(timestamp){
      let time = new Date(timestamp)
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      let date = time.getDate()
      return `${year}-${month<10?`0${month}`:month}-${date<10?`0${date}`:date}`
    },
    timestampToTime(timestamp){
      let time = new Date(timestamp)
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      let date = time.getDate()
      let hour = time.getHours()
      let min = time.getMinutes()
      let sec = time.getSeconds()

      return `${year}-${month<10?`0${month}`:month}-${date<10?`0${date}`:date} ${hour<10?`0${hour}`:hour}:${min<10?`0${min}`:min}:${sec<10?`0${sec}`:sec}`
    },
    round(num, roundTo){
      if (num){
        let result
        if (roundTo !== undefined){
          result = Number.isInteger(num) ? num : (num).toFixed(roundTo)
        }else{
          result = Number.isInteger(num) ? num : (num).toFixed(2)
        }
        return result
      }else{
        return null
      }
    },
    // 取得欲抵押的 EGT / Eth 市值
    async getValue(token, amount, type){
      try{
        let tokenType = token==='egt' || token==='eth' ? 'ethereum' : 
                        token==='btc'                  ? 'bitcoin'  :
                        token==='ebt'                  ? 'eos'      : token
        let result = await getTokenPriceSingleton(tokenType)
        if (result){
          // console.log('result', result)
          let value
          if (token === 'egt'){
            value = parseFloat(amount / 1200) * result[tokenType].usd
          }else{
            value = parseFloat(amount) * result[tokenType].usd
          }

          if (type === 'usdt'){
            return parseFloat((value).toFixed(2))
          }else{
            let tbtSwapContract = await new tbtSwap()
            let usdtRate = await tbtSwapContract.getRate()
            return parseFloat((value * usdtRate).toFixed(2))
          }
        }else{
          this.$toasted.error(this.$t('cannotGetMarketValue'))
          return null
        }
      }catch (error){
        console.log('error', error)
        this.$toasted.error(this.$t('cannotGetMarketValue'))
        return null
      }
    },
    // 取得抵押率(貸款成數)
    getRate(amount, value){
      return value ? (amount / value * 100 ).toFixed(2) || null : null
    },


    // wallet
    async connectMetamask() {
      let _this = this
      if (window.ethereum){
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(_this.handleAccountsChanged)
          .catch((err) => {
            if (err.code === 4001) {
              // EIP-1193 userRejectedRequest error
              // If this happens, the user rejected the connection request.
              this.$toasted.error('Please connect to MetaMask.');
            } else {
              console.error(err);
            }
          });
      }else{
        this.$toasted.error(this.$t('installMetamask'))
      }
    },
    async handleAccountsChanged(accounts){
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        this.$toasted.error('Please connect to MetaMask.');
      } else if (accounts[0] !== this.$store.state.account) {
        this.$store.commit('updateAccount', accounts[0]);
        this.$cookies.set('address', accounts[0]);
      }
    },
    checkChainId(chainId){
      let isEthereum = chainId === '0x1' || chainId === 1
      // let isEthereum = chainId === '0x4' || chainId === 4

      let isBsc = chainId === '0x38' || chainId === 56
      // let isBsc = chainId === '0x61' || chainId === 97
      this.$store.commit('updateChainId', isBsc);
      this.$store.commit('updateIsEth', isEthereum);
      if (!isBsc){
        if (this.$route.name !== 'Ethegt-send'){
          this.$toasted.error(this.$t('changeMainnet'));
        }
      }
    }
  },
};
