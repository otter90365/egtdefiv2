// register the plugin on vue
import ABI from '@/assets/abi/game.js'
import store from '../store'
import { rpcURL } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');
Contract.setProvider(rpcURL);

export default class Game {
  constructor() {
    this.contract = new Contract(ABI, store.state.GameAddress);
    // console.log('this.contract', this.contract)
  }

  async getTotalAmount(){
    let result = await this.contract.methods.allamount().call();
    return parseFloat(result) / (10 ** 18)
  }

  // fomo round
  async getCurrRound(){
    let result = await this.contract.methods.fomoround().call();
    return result
  }
  
  async getRoundDetails(round){
    let result = await this.contract.methods.Fomodatas(round).call();
    result.roundamount = parseFloat(result.roundamount) / (10 ** 18)
    result.stoptime = parseInt(result.stoptime)
    return result
  }

  // 排名 round
  async getRankRound(){
    let result = await this.contract.methods.rankround().call();
    return result
  }

  async getRankRoundDetails(round){
    let result = await this.contract.methods.Rankdatas(round).call();
    return parseFloat(result) / (10 ** 18)
  }

  async getWinner(){
    let result = await this.contract.methods.getsort().call();
    return result
  }

  async getUserAmount(walletAddress, round){
    let result = await this.contract.methods.useramount(walletAddress, round).call();
    return parseFloat(result) / (10 ** 18)
  }

  async getGameData(round){
    let result = await this.contract.methods.Poolamounts(round).call();
    return result
  }

  async getRankstoptime(round){
    let result = await this.contract.methods.rankstoptime(round).call();
    return parseInt(result)
  }
  
  async addMoney(amount){
    let num = amount * 10 ** 18
    const amountString = num.toLocaleString('fullwide', {useGrouping:false})
    let extraData = await this.contract.methods.addpool(amountString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: store.state.GameAddress,
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