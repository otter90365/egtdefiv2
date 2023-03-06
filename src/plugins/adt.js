// register the plugin on vue
import ABI from '@/assets/abi/adt.js'
import store from '../store'
import { rpcURL } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');
Contract.setProvider(rpcURL);

export default class ADT {
  constructor() {
    this.contract = new Contract(ABI, store.state.ADTAddress);
    // console.log('this.contract', this.contract)
  }

  async getAmount(walletAddress) {
    let balance = await this.contract.methods.balanceOf(walletAddress).call() / (10 ** 18);
    let dividend = await this.contract.methods.dividend().call();
    let mask = await this.contract.methods.mask(walletAddress).call();
    let claimable = (dividend - mask) * balance / (10 ** 18)
    return {balance: Number.isInteger(balance)?balance:balance.toFixed(5), claimable: Number.isInteger(claimable)?claimable:claimable.toFixed(5)};
  }

  async getMortgageAmount(walletAddress, token) {
    let balance = await this.contract.methods.balanceOf(walletAddress).call() / (10 ** 18);
    let dividend = await this.contract.methods.dividendmortgage(token).call();
    let mask = await this.contract.methods.maskmortgage(token, walletAddress).call();
    let claimable = (dividend - mask) * balance / (10 ** 18)
    let result = Number.isInteger(claimable) ? claimable : claimable.toFixed(5)
    return result
  }

  async claim(walletAddress){
    let extraData =  await this.contract.methods.update(walletAddress)
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