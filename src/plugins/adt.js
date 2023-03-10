// register the plugin on vue
import ABI from '@/assets/abi/adt.js'
import store from '../store'
import { rpcURL, TBTAddress, TBTTestTokenAddress, USDTAddress, USDTTestTokenAddress } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');
Contract.setProvider(rpcURL);

export default class ADT {
  constructor() {
    this.contract = new Contract(ABI, store.state.ADTAddress);
    // console.log('this.contract', this.contract)
  }

  async getAmount(walletAddress) {
    let tokenAddress
    if (process.env.VUE_APP_TEST_TOKEN == 1) {
      console.log('used test token')
      tokenAddress = store.state.currToken === 'usdt' ? USDTTestTokenAddress : TBTTestTokenAddress
    } else {
      tokenAddress = store.state.currToken === 'usdt' ? USDTAddress : TBTAddress
    }
    console.log('tokenAddress', tokenAddress)

    let balance = await this.contract.methods.balanceOf(walletAddress).call() / (10 ** 18);
    let dividend = await this.contract.methods.dividendMortgage(tokenAddress).call();
    let mask = await this.contract.methods.maskMortgage(tokenAddress, walletAddress).call();
    console.log('dividend', dividend)
    console.log('mask', mask)
    let claimable = (dividend - mask) * balance / (10 ** 18)
    return {balance: Number.isInteger(balance)?balance:balance.toFixed(5), claimable: Number.isInteger(claimable)?claimable:claimable.toFixed(5)};
    // return {balance: Number.isInteger(balance)?balance:balance.toFixed(5)};
  }

  // async getMortgageAmount(walletAddress, token) {
  //   let balance = await this.contract.methods.balanceOf(walletAddress).call() / (10 ** 18);
  //   let dividend = await this.contract.methods.dividendMortgage(token).call();
  //   let mask = await this.contract.methods.maskMortgage(token, walletAddress).call();
  //   let claimable = (dividend - mask) * balance / (10 ** 18)
  //   let result = Number.isInteger(claimable) ? claimable : claimable.toFixed(5)
  //   return result
  // }

  async claim(walletAddress){
    let tokenAddress
    if (process.env.VUE_APP_TEST_TOKEN == 1) {
      console.log('used test token')
      tokenAddress = store.state.currToken === 'usdt' ? USDTTestTokenAddress : TBTTestTokenAddress
    } else {
      tokenAddress = store.state.currToken === 'usdt' ? USDTAddress : TBTAddress
    }
    let extraData =  await this.contract.methods.upDate(tokenAddress, walletAddress)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async claimMortgage(walletAddress, token){
    let extraData =  await this.contract.methods.updatemortgage(token, walletAddress)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: store.state.ADTAddress,
      from: window.ethereum.selectedAddress,
      data: data,
    };
    
    try{
      let txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      })
      return {txHash: txHash}
    }catch(error){
      // console.log('error', error)
      return error
    }
  }
}