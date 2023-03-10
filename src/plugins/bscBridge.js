// register the plugin on vue
import ABI from '@/assets/abi/bridge.js'
import store from '../store'
import { bscBridgeAddress } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');

export default class BscBridge {
  constructor() {
    Contract.setProvider(store.state.rpcUrl);
    this.contract = new Contract(ABI, bscBridgeAddress);
    // console.log('this.contract', this.contract)
  }

  async deposit(amount){
    const amountString = this.web3.utils.toWei(amount.toString())
    let extraData =  await this.contract.methods.Deposit(amountString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: bscBridgeAddress,
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