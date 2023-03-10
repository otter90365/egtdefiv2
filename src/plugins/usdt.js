// register the plugin on vue
import ABI from '@/assets/abi/usdt.js'
import store from '../store'
import { USDTAddress } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');
/**
 * @deprecated
 */
export default class USDT {
  constructor(defiContractAddress = 2) {
    Contract.setProvider(store.state.rpcUrl);
    this.defiContractAddress = defiContractAddress
    this.contract = new Contract(ABI, USDTAddress);
    // console.log('this.contract', this.contract)
  }

  get defiContractAddress () {
    return this.defiContractVersion === 1 ? store.state.DefiAddress : store.state.Defi2Address
  }


  async getBalance(walletAddress) {
    let balance = await this.contract.methods.balanceOf(walletAddress).call();
    return parseFloat((parseInt(balance) / (10 ** 18)).toFixed(5));
  }

  async getAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, store.state.DefiAddress).call();
    return parseInt(allowance) / (10 ** 18)
  }

  async approve(){
    const num = 1000000000 * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    // console.log('numString', numString)

    let extraData =  await this.contract.methods.approve(store.state.DefiAddress, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: USDTAddress,
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