// register the plugin on vue
import ABI from '@/assets/abi/egt.js'
import store from '../store'
import { rpcURL } from '@/assets/contract.js'
const Web3 = require("web3");
const Contract = require('web3-eth-contract');
Contract.setProvider(rpcURL);

export default class ERC {
  constructor(token, defiContractVersion = 2) {
    console.log(this.token)
    this.token = token
    this.defiContractVersion = defiContractVersion
    this.decimals = parseInt(token.decimals)
    this.contract = new Contract(ABI, token.tokenaddress);
    // console.log('this.contract', this.contract)
  }

  get contractAddress () {
    return this.defiContractVersion === 1 ? store.state.DefiAddress : store.state.Defi2Address
  }

  async getBalance(walletAddress) {
    let balance = await this.contract.methods.balanceOf(walletAddress).call();
    return parseFloat((parseInt(balance) / (10 ** this.decimals)).toFixed(10));
  }

  async getAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, this.contractAddress).call();
    console.log(allowance)
    return parseInt(allowance) / (10 ** this.decimals)
  }

  async getEgtAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, store.state.EGTAddress).call();
    return parseInt(allowance) / (10 ** 18)
  }

  async isMember(walletAddress){
    let isMember = await this.contract.methods.isMember(walletAddress).call();
    return isMember
  }

  async register(refererAddress){
    let extraData =  await this.contract.methods.register(refererAddress)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async buy(amount){
    const num = amount * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    let extraData = await this.contract.methods.buy()
    let data = extraData.encodeABI()
    return this.sendTransaction(data, numString)
  }

  async sell(amount){
    const num = amount * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    let extraData = await this.contract.methods.sell(numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async approve(){
    const num = 1000000000 * 10 ** this.decimals;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    // console.log('numString', numString)

    let extraData =  await this.contract.methods.approve(this.contractAddress, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async approveEgt(){
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
      to: this.token.tokenaddress,
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