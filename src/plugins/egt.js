// register the plugin on vue
import ABI from '@/assets/abi/egt.js'
import store from '../store'
const Web3 = require("web3");
const Contract = require('web3-eth-contract');

export default class EGT {
  tokenAddress = ''
  constructor(defiContractVersion = 2) {
    Contract.setProvider(store.state.rpcUrl);
    this.defiContractVersion = defiContractVersion
    this.tokenAddress = store.state.EGTAddress
    if (process.env.VUE_APP_TEST_TOKEN == 1 && defiContractVersion === 2) {
      this.tokenAddress = store.state.tokenListV2.entitiesBy.name['egt'].tokenaddress
    }
    console.log(this.tokenAddress)
    this.contract = new Contract(ABI, this.tokenAddress);
    // console.log('this.contract', this.contract)
  }

  get defiContractAddress() {
    return this.defiContractVersion === 1 ? store.state.DefiAddress : store.state.Defi2Address
  }

  async getBalance(walletAddress) {
    let balance = await this.contract.methods.balanceOf(walletAddress).call();
    return parseFloat((parseInt(balance) / (10 ** 18)).toFixed(10));
  }

  async getAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, this.defiContractAddress).call();
    return parseInt(allowance) / (10 ** 18)
  }

  async getOtherAllowance(walletAddress, contract){
    let allowance = await this.contract.methods.allowance(walletAddress, contract).call();
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
    const amountString = this.web3.utils.toWei(amount.toString())
    let extraData = await this.contract.methods.buy(amountString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sell(amount){
    const amountString = this.web3.utils.toWei(amount.toString())
    let extraData = await this.contract.methods.sell(amountString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async approve(){
    const num = 1000000000 * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    // console.log('numString', numString)

    let extraData =  await this.contract.methods.approve(this.defiContractAddress, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async approveOther(contract){
    const num = 1000000000 * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})

    let extraData =  await this.contract.methods.approve(contract, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data, value){
    let web3
    if (value){
      web3 = await new Web3(new Web3.providers.HttpProvider(store.state.rpcUrl));
    }
    const transactionParameters = {
      to: this.tokenAddress,
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