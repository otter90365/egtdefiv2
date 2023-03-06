// register the plugin on vue
import ABI from '@/assets/abi/bridge.js'
import { EthBridgeAddress, EthRpcURL } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');
Contract.setProvider(EthRpcURL);

export default class EthBridge {
  constructor() {
    this.contract = new Contract(ABI, EthBridgeAddress);
    // console.log('this.contract', this.contract)
  }

  async withdraw(payload){
    let amount = payload.amount * 10 ** 18
    const amountString = amount.toLocaleString('fullwide', {useGrouping:false})
    let extraData =  await this.contract.methods.Withdraw(payload.sendAddress, amountString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: EthBridgeAddress,
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