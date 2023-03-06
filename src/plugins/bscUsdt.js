// register the plugin on vue
import ABI from '@/assets/abi/usdt.js'
import store from '../store'
import { USDTAddress, rpcURL, USDTTestTokenAddress } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');
Contract.setProvider(rpcURL);

export default class bscUsdt {
  constructor(defiContractVersion = 2) {
    this.defiContractVersion = defiContractVersion
    this.tokenAddress = USDTAddress
    if (process.env.VUE_APP_TEST_TOKEN == 1 && defiContractVersion === 2) {
      console.log('use test token')
      this.contract = new Contract(ABI, USDTTestTokenAddress);
      this.tokenAddress = USDTTestTokenAddress
  } else {
      this.contract = new Contract(ABI, USDTAddress);
    }
    // console.log('this.contract', this.contract)
  }

  get defiContractAddress () {
    return this.defiContractVersion === 1 ? store.state.DefiAddress : store.state.Defi2Address
  }

  async getBalance(walletAddress) {
    try{
      let balance = await this.contract.methods.balanceOf(walletAddress).call();
      return parseFloat((parseInt(balance) / (10 ** 18)).toFixed(5));
    }catch(error){
      console.log('error', error)
    }
  }

  async getAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, this.defiContractAddress).call();
    return parseInt(allowance) / (10 ** 18)
  }

  async approve(){
    const num = 1000000000 * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    // console.log('numString', numString)
    let extraData =  await this.contract.methods.approve(this.defiContractAddress, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async transfer(toAddress, amount){
    amount = amount * (10 ** 18)
    const amountString = amount.toLocaleString('fullwide', {useGrouping:false})
    let extraData =  await this.contract.methods.transfer(toAddress, amountString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: this.tokenAddress,
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