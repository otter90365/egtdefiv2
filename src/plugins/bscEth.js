// register the plugin on vue
import ABI from '@/assets/abi/egt.js'
import store from '../store'
import { rpcURL } from '@/assets/contract.js'
const Web3 = require("web3");
const Contract = require('web3-eth-contract');
Contract.setProvider(rpcURL);

export default class bscEth {
  constructor() {
    // this.contract = new Contract(ABI, store.state.EGTAddress);
    this.contract = new Contract(ABI, store.state.ETHAddress);
    // console.log('this.contract', this.contract)
  }

  async getBalance(walletAddress) {
    let balance = await this.contract.methods.balanceOf(walletAddress).call();
    return parseFloat((parseInt(balance) / (10 ** 18)).toFixed(10));
  }

  async getAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, store.state.EGTAddress).call();
    return parseInt(allowance) / (10 ** 18)
  }

  async approve(){
    const num = 1000000000 * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    // console.log('numString', numString)

    let extraData =  await this.contract.methods.approve(store.state.EGTAddress, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data, value){
    let web3
    if (value){
      web3 = await new Web3(new Web3.providers.HttpProvider(rpcURL));
    }
    const transactionParameters = {
      to: store.state.ETHAddress,
      // to: ETHAddress,
      value: value ? web3.utils.toHex(value) : 0,
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