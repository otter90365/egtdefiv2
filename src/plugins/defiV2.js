// register the plugin on vue
import ABI_V2 from '@/assets/abi/defiv2.js';
import store from '../store';

import range from 'lodash/range';
import indexOf from 'lodash/indexOf'
import { newOrderStartIndex } from '@/constant/order';

const Contract = require('web3-eth-contract');
const Web3 = require("web3");

export default class DefiV2 {
  constructor (contractAddress = store.state.Defi2Address) {
    Contract.setProvider(store.state.rpcUrl);
    this.contractAddress = contractAddress
    this.contract = new Contract(ABI_V2, contractAddress);
    this.web3 = new Web3(new Web3.providers.HttpProvider(store.state.rpcUrl));
  }

  /**
   * Get 可以交易的 token
   * @return {Promise<{name: string, tokenaddress: string, decimals: number}[]>} */
  async getTokenList() {
    /** @type {number} */
    const supportedTokenAmount = await this.contract.methods.TradeTokenAmount().call();
    const tokenList = await Promise.all(range(0, supportedTokenAmount).map(i => this.contract.methods.TradeTokens(i).call()));
    return tokenList.filter(data => data.status)
      .map(({ name, tokenaddress, decimals }) => ({ name, tokenaddress, decimals }));
  }

  // Get Adt & game address
  async getAddress() {
    try {
      let adt = await this.contract.methods.adt().call();
      return { adt: adt };
      // return { adt };
    } catch (error) {
      console.log('error', error);
      return 'error';
    }
  }

  // Get total amount
  async getTotalAmount() {
    let amount = await this.contract.methods.totalAmount().call();
    return amount / (10 ** 18);
  }

  async isMember(walletAddress) {
    let isMember = await this.contract.methods.isMember(walletAddress).call();
    return isMember;
  }

  /** @return {Promise<boolean>} */
  async inWhiteList(walletAddress = '') {
    const result = await this.contract.methods.whiteList(walletAddress).call();
    return result;
  }

  async register(refererAddress) {
    let extraData = await this.contract.methods.register(refererAddress);
    let data = extraData.encodeABI();
    return this.sendTransaction(data);
  }

  // 建立 erc 訂單
  async ercorder(loan, tokenAddress) {
    const wantString = this.web3.utils.toWei(loan.amount.toString())
    const amountString = this.web3.utils.toWei(loan.egtAmount.toString())
    const rateString = this.web3.utils.toWei((loan.interest / 100).toString())
    let lendday = loan.date;

    let extraData = await this.contract.methods.ercOrder(tokenAddress, wantString, amountString, rateString, lendday);
    let data = extraData.encodeABI();
    return this.sendTransaction(data);
  }

  // // 建立 eth 訂單
  // async ethorder(loan){
  //   // console.log('loan', loan)
  //   let want = loan.amount * 10 ** 18
  //   let amount = loan.ethAmount * 10 ** 18
  //   let rate = loan.interest * 10 ** 16
  //   let lendday = loan.date

  //   const wantString = want.toLocaleString('fullwide', {useGrouping:false})
  //   const amountString = amount.toLocaleString('fullwide', {useGrouping:false})
  //   const rateString = rate.toLocaleString('fullwide', {useGrouping:false})
  //   let extraData = await this.contract.methods.ethOrder(wantString, rateString, lendday)
  //   let data = extraData.encodeABI()
  //   return this.sendTransaction(data, amountString)
  // }

  // 取得投資清單總數
  /**
   * @param {string} tokenAddress
   * @returns {Promise<'error' | number>}
   */
  async getOrderAmount(tokenAddress) {
    try {
      let result = await this.contract.methods.tokenOrders(tokenAddress).call();
      return parseInt(result);
    } catch (error) {
      console.log('error', error);
      return 'error';
    }
  }

  // 取得投資清單
  async getAllOrders(tokenAddress) {
    try {
      let amount = await this.getOrderAmount(tokenAddress);
      if (amount === 'error') throw new Error('connect error');
      if (amount === 0) return [];
      const pager = Math.ceil(amount / 50);

      // get all specific token orders' index
      const startAmount = range(0, pager).map(i => i * 50);

      const reqList = startAmount.map(startIndex => (async () => {
        /** @type {number[]} */
        const result = await this.contract.methods.allOrder(tokenAddress, startIndex, true).call();
        return result;
      })());

      const orderIndex = (await Promise.all(reqList)).flat();

      // get each order details
      if (amount > 0) {
        const secIndexOf0 = indexOf(orderIndex, '0', 1)
        if (~secIndexOf0) {
          let slicedList = orderIndex.splice(secIndexOf0)
          if(slicedList.filter(i => +i).length) {
            orderIndex.push(...slicedList.filter(i => +i))
          }
          
        }
      }
      let orders = await this.getOrderDetail(tokenAddress, orderIndex, true);

      return orders.slice(0, amount);
    } catch (error) {
      console.log('error', error);
      return 'error';
    }
  }

  // 取得個人訂單 (1 = lender 2 = borrower)
  /**
   * @param {string} tokenAddress
   * @param {'lender' | 'borrower'} type
   * @param {string} walletAddress
   *  */
  async getSelfOrders(tokenAddress, type, walletAddress) {
    try {
      // let tokenAddress = token === 'egt' ? store.state.EGTAddress : store.state.ETHAddress
      let amount = await this.getOrderAmount(tokenAddress);
      if (amount === 'error') return 'error';
      if (amount === 0) return [];
      const pager = Math.ceil(amount / 50);

      const startAmount = range(0, pager)
        .map(i => i * 50);

      const orderIndex = (await Promise.all(startAmount.map(
        i => this.contract.methods.selfOrder(
          type === 'lender' ? 1 : 2,
          tokenAddress,
          i
        ).call({ from: walletAddress })
      ))).flat();
      if (orderIndex[0] == 0) {
        if (orderIndex[1] == 0) {
          const item = await this.contract.methods.Orders(tokenAddress, '0').call();
          if (item) return [0];
          return [];
        } else {
          return [0, ...orderIndex.filter(ele => ele != 0)];
        }
      } else {
        return orderIndex.filter(ele => ele != 0);
      }
    } catch (error) {
      console.log('error', error);
      return 'error';
    }
  }

  /**
   * 
   * @param {{tokenAddress: string, tokenOrder: number}[]} orderList 
   * @param {boolean} filterCanorder 
   * @param {boolean} isReceipt 
   * @param {'lender' | 'borrower' | undefined} filterPosition 
   */
  async getAllOrderDetail(orderList = [], filterCanorder, isReceipt, filterPosition) {
    const results = await Promise.all(orderList.map(order => {
      return (async () => {
        const canorder = await this.contract.methods.canOrder(order.tokenAddress, order.tokenOrder).call();
        if (filterCanorder) {
          if (!canorder) return false;
        }

        const item = await this.contract.methods.Orders(order.tokenAddress, order.tokenOrder).call();

        if (filterPosition) {
          const dataAddress = item[filterPosition].toLowerCase();
          const walletAddress = window.ethereum.selectedAddress.toLowerCase();
          if (dataAddress !== walletAddress) return false;
        }

        const data = {
          version: 2,
          amount: parseInt(item.amount) / (10 ** 18),
          sorterId: +item.id + newOrderStartIndex,
          borrower: item.borrower,
          id: item.id,
          lender: item.lender,
          rate: parseInt(item.rate) / (10 ** 16),
          settleday: parseInt(item.settleday),
          startday: parseInt(item.startday),
          token: item.token,
          want: parseInt(item.want) / (10 ** 18),
          canOrder: canorder,
        };
        if (!canorder && isReceipt) {
          let receipt = await this.contract.methods.Ious(order.tokenAddress, order.tokenOrder).call();
          // console.log('receipt', receipt)
          data.isComplete = receipt.completeOrder;
          data.filledTime = parseInt(receipt.lenderordertime);
          data.completeordertime = parseInt(receipt.completeOrdertime)
        }
        return data;
      })();
    }));

    return results.filter(Boolean);
  }

  // get each order details by token & order id
  /**
   * 
   * @param {string} tokenAddress 
   * @param {number[]} orderIndex 
   * @param {boolean} filterCanorder 
   * @param {boolean} isReceipt 
   * @param {string} filterAddress 
   * @returns 
   */
  async getOrderDetail(tokenAddress, orderIndex, filterCanorder, isReceipt, filterAddress) {
    const orders = (await Promise.all(orderIndex.map(i => (async () => {
      let canorder = await this.contract.methods.canOrder(tokenAddress, i).call();

      // 過濾已成交訂單
      if (filterCanorder) {
        if (!canorder) return false;
      }

      let item = await this.contract.methods.Orders(tokenAddress, i).call();
      // console.log('item', item)

      if (filterAddress) {
        let dataAddress = (item[filterAddress]).toLowerCase();
        let walletAddress = (window.ethereum.selectedAddress).toLowerCase();
        if (dataAddress !== walletAddress) {
          return false;
        }
      }

      let data = {
        amount: parseInt(item.amount) / (10 ** 18),
        borrower: item.borrower,
        id: parseInt(item.id),
        sorterId: parseInt(item.id) + newOrderStartIndex,
        lender: item.lender,
        rate: parseInt(item.rate) / (10 ** 16),
        settleday: parseInt(item.settleday),
        startday: parseInt(item.startday),
        token: item.token,
        want: parseInt(item.want) / (10 ** 18),
        canOrder: canorder,
        version: 2,
      };

      // 取得已成交借據資料
      if (!canorder && isReceipt) {
        let receipt = await this.contract.methods.Ious(tokenAddress, i).call();
        // console.log('receipt', receipt)
        data.isComplete = receipt.completeOrder;
        data.filledTime = parseInt(receipt.lenderordertime);
        data.completeordertime = receipt.completeOrdertime
      }

      return data;
    })()))).filter(Boolean);

    return orders;
  }

  async selectOrder(token, i) {
    let extraData = await this.contract.methods.choseOrder(token, i);
    let data = extraData.encodeABI();
    return this.sendTransaction(data);
  }

  async payback(token, i) {
    let extraData = await this.contract.methods.payBack(token, i);
    let data = extraData.encodeABI();
    return this.sendTransaction(data);
  }

  async take(token, i) {
    let extraData = await this.contract.methods.takeMortgage(token, i);
    let data = extraData.encodeABI();
    return this.sendTransaction(data);
  }

  async cancel(token, i) {
    let extraData = await this.contract.methods.borrowerTake(token, i);
    let data = extraData.encodeABI();
    return this.sendTransaction(data);
  }

  // async getCommunity(walletAddress){
  //   console.log('我的社群還沒用 walletAddress', walletAddress)
  //   // let totalEvents = await this.contract.getPastEvents('Register', { fromBlock: 12933676 })

  //   // // 我的直推人數
  //   // let myRefs = totalEvents.filter(event => (event.returnValues.referrer).toLowerCase() == walletAddress.toLowerCase())
  //   // if (myRefs.length === 0){
  //   //   return {myRefs: 0, community: 0}
  //   // }else{
  //   //   let myRefList = myRefs.map(event => (event.returnValues.client).toLowerCase())
  //   //   let secondrefs = totalEvents.filter(event => myRefList.includes((event.returnValues.referrer).toLowerCase()))
  //   //   let secondRefList = secondrefs.map(event => (event.returnValues.client).toLowerCase())
  //   //   let thirdrefs = totalEvents.filter(event => secondRefList.includes((event.returnValues.referrer).toLowerCase()))
  //   //   return {myRefs: myRefs.length, community: myRefList.length + secondRefList.length + thirdrefs.length}
  //   // }
  // }

  async getCommunity(walletAddress) {
    let latestBlock = await this.web3.eth.getBlockNumber();
    let fromBlock = 12933676;
    let totalEvents = [];
    do {
      await this.contract.getPastEvents('Register', {
        fromBlock: fromBlock,
        toBlock: fromBlock + 5000 > latestBlock ? 'latest' : fromBlock + 5000,
      }, function (error) {
        if (error) {
          console.log('error', error);
          return error;
        }
      })
        .then(function (events) {
          if (events.length !== 0) {
            totalEvents.push(...events);
          }
        });

      fromBlock += 5000;
    } while (fromBlock + 5000 < latestBlock);
    // console.log('totalEvents', totalEvents)

    // // 我的直推人數
    let myRefs = totalEvents.filter(event => (event.returnValues.referrer).toLowerCase() == walletAddress.toLowerCase());
    if (myRefs.length === 0) {
      return { myRefs: 0, community: 0 };
    } else {
      let myRefList = myRefs.map(event => (event.returnValues.client).toLowerCase());
      let secondrefs = totalEvents.filter(event => myRefList.includes((event.returnValues.referrer).toLowerCase()));
      let secondRefList = secondrefs.map(event => (event.returnValues.client).toLowerCase());
      let thirdrefs = totalEvents.filter(event => secondRefList.includes((event.returnValues.referrer).toLowerCase()));
      return { myRefs: myRefs.length, community: myRefList.length + secondRefList.length + thirdrefs.length };
    }
    // return result
  }

  async getBorrowGas() {
    var result = await this.web3.eth.estimateGas({
      // to: store.state.DefiAddress, 
      data: "0x456b1598000000000000000000000000f6c5fca9ca34c4b23045efffa576716ff70542c100000000000000000000000000000000000000000000000000000000001e84800000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000006a94d74f43000000000000000000000000000000000000000000000000000000000000000000a8"
    });
    return result;
  }

  async getInvestGas() {
    var result = await this.web3.eth.estimateGas({
      // to: store.state.DefiAddress, 
      data: "0x456b1598000000000000000000000000f6c5fca9ca34c4b23045efffa576716ff70542c10000000000000000000000000000000000000000000000000000000000000000"
    });
    return result;
  }

  async getBlockNumber() {
    let nowBlock = await this.web3.eth.getBlockNumber();
    return nowBlock;
  }

  async getBlockDetail(blockNum) {
    let data = await this.web3.eth.getBlock(blockNum);
    return data;
  }

  async whiteListUser(address = '') {
    const data = await this.contract.methods.whiteListUser(address)

    return this.sendTransaction(data.encodeABI())
  }

  async isController(walletAddress) {
    const result = await this.contract.methods.isController(walletAddress).call();
    return result;
  }

  async setController(walletAddress) {
    const data = await this.contract.methods.setController(walletAddress)
    return this.sendTransaction(data.encodeABI())
  }

  async sendTransaction(data, value) {
    let web3;
    if (value) {
      web3 = await new Web3(new Web3.providers.HttpProvider(store.state.rpcUrl));
    }
    const transactionParameters = {
      to: this.contractAddress,
      value: value ? web3.utils.toHex(value) : 0,
      from: window.ethereum.selectedAddress,
      data: data,
    };

    try {
      let txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      return { txHash: txHash };
    } catch (error) {
      // console.log('error', error)
      return error;
    }
  }
}