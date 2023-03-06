// register the plugin on vue
import ABI from '@/assets/abi/tbtSwap.js'
import { TBTSwapAddress, rpcURL } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');
Contract.setProvider(rpcURL);

export default class tbtSwap {
  constructor() {
    this.contract = new Contract(ABI, TBTSwapAddress);
    // console.log('this.contract', this.contract)
  }

  // Get TBT rate
  async getRate(){
    try{
      let result = await this.contract.methods.usdt_rate().call();
      return parseFloat(result / (10 ** 18)) || 0
    }catch(error){
      console.log('error', error)
      return 'error'
    }
  }
}