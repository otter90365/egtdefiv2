// register the plugin on vue
import store from '../store'
import { rpcURL } from '@/assets/contract.js'
const Web3 = require("web3");

/** @deprecated */
export default class Eth {
  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
  }

  async getBalance(walletAddress) {
    let balance = await this.web3.eth.getBalance(walletAddress);
    return balance / (10**18);
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: store.state.DefiAddress,
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