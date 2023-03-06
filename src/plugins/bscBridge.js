// register the plugin on vue
import ABI from '@/assets/abi/bridge.js'
import { bscBridgeAddress, rpcURL } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');
Contract.setProvider(rpcURL);

export default class BscBridge {
  constructor() {
    this.contract = new Contract(ABI, bscBridgeAddress);
    // console.log('this.contract', this.contract)
  }

  async deposit(amount){
    amount = amount * 10 ** 18
    const amountString = amount.toLocaleString('fullwide', {useGrouping:false})
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