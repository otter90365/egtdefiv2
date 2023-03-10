// register the plugin on vue
import ABI from '@/assets/abi/defi.js';
import store from '../store';
const Contract = require('web3-eth-contract');
const Web3 = require("web3");

export default class Defi {
  constructor () {
    Contract.setProvider(store.state.rpcUrl);
    this.contract = new Contract(ABI, store.state.DefiAddress);
    this.web3 = new Web3(new Web3.providers.HttpProvider(store.state.rpcUrl));
    // console.log('this.contract', this.contract)
  }

  // Get 可以交易的 token
  async getToken() {
    let amount = await this.contract.methods.Tradetokenamount().call();
    const requestList = [];
    for (let i = 0; i < parseInt(amount) + 1; i++) {
      requestList.push(this.contract.methods.Tradetokens(i).call());
    }

    const dataList = await Promise.all(requestList);
    return dataList.filter(data => data.status)
      .map(({ name, tokenaddress, decimals }) => ({ name, tokenaddress, decimals }));
  }

  // Get Adt & game address
  async getAddress() {
    try {
      let adt = await this.contract.methods.adt().call();
      let game = await this.contract.methods.jackpot().call();
      return { adt: adt, game: game };
      // return { adt };
    } catch (error) {
      console.log('error', error);
      return 'error';
    }
  }

  // Get total amount
  async getTotalAmount() {
    let amount = await this.contract.methods.totalamount().call();
    return amount / (10 ** 18);
  }

  async isMember(walletAddress) {
    let isMember = await this.contract.methods.isMember(walletAddress).call();
    return isMember;
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

    let extraData = await this.contract.methods.ercorder(tokenAddress, wantString, amountString, rateString, lendday);
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
  //   let extraData = await this.contract.methods.ethorder(wantString, rateString, lendday)
  //   let data = extraData.encodeABI()
  //   return this.sendTransaction(data, amountString)
  // }

  // 取得投資清單總數
  /**
   * @param {string} tokenAddress
   * @returns {'error' | number}
   */
  async getOrderAmount(tokenAddress) {
    try {
      let result = await this.contract.methods.tokenorders(tokenAddress).call();
      return parseInt(result);
    } catch (error) {
      console.log('error', error);
      return 'error';
    }
  }

  // 取得投資清單
  async getAllOrders(token) {
    try {
      let tokenAddress = token === 'egt' ? store.state.EGTAddress : store.state.ETHAddress;
      let amount = await this.getOrderAmount(tokenAddress);

      // get all specific token orders' index
      let startAmount = 0;
      let result;
      let orderIndex = [];
      do {
        result = await this.contract.methods.allorder(tokenAddress, startAmount, true).call();

        console.log('result', result);
        if (result[result.length - 1] === "0") {
          let list = await this.filterNullOrder(result, startAmount);
          orderIndex.push(...list);
        } else {
          orderIndex.push(...result);
        }

        startAmount += 50;
      }
      while (amount >= startAmount);

      // console.log('orderIndex', orderIndex)

      // get each order details
      let orders = await this.getOrderDetail(tokenAddress, orderIndex, true);

      return orders;
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
    console.log(tokenAddress, type, walletAddress);
    try {
      // let tokenAddress = token === 'egt' ? store.state.EGTAddress : store.state.ETHAddress
      let amount = await this.getOrderAmount(tokenAddress);
      let startAmount = 0;
      let orderIndex = [];
      do {
        try {
          // response 50 length array list
          let orders = await this.contract.methods.selforder(
            type === 'lender' ? 1 : 2,
            tokenAddress,
            startAmount
          ).call({
            from: walletAddress
          });
          // console.log('orders', JSON.parse(JSON.stringify(orders)))

          if (orders[orders.length - 1] === "0") {
            let list = await this.filterNullOrder(orders, startAmount, type, tokenAddress);
            orderIndex.push(...list);
          } else {
            orderIndex.push(...orders);
          }
        } catch (error) {
          console.log('error', error);
        }

        startAmount += 50;
      }
      while (amount >= startAmount);
      // console.log('selforder orderIndex', tokenAddress, orderIndex)

      return orderIndex;
    } catch (error) {
      console.log('error', error);
      return 'error';
    }
  }

  // 過濾空訂單
  async filterNullOrder(orderIndex, startAmount, filterAddress, tokenAddress) {
    let index = orderIndex.findIndex((el, i) => {
      return orderIndex[i] === orderIndex[i + 1];
    });
    if (index === 0) {
      // 全部都是"0"
      if (startAmount === 0) {
        let item = await this.contract.methods.Orders(tokenAddress, "0").call();
        // console.log('item', item);
        // console.log('filterAddress', filterAddress);

        if (filterAddress) {
          let dataAddress = (item[filterAddress]).toLowerCase();
          let walletAddress = (window.ethereum.selectedAddress).toLowerCase();
          if (dataAddress !== walletAddress) {
            return [];
          }
        }
        return [orderIndex[0]];
      }
      return [];
    } else if (index === -1) {
      // 只有最後一個是"0"
      return orderIndex.slice(0, orderIndex.length - 1);
    } else {
      return orderIndex.slice(0, index);
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
        const canorder = await this.contract.methods.canorder(order.tokenAddress, order.tokenOrder).call();
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
          version: 1,
          amount: parseInt(item.amount) / (10 ** 18),
          borrower: item.borrower,
          id: item.id,
          sorterId: +item.id,
          lender: item.lender,
          rate: parseInt(item.rate) / (10 ** 16),
          settleday: parseInt(item.settleday),
          startday: parseInt(item.startday),
          token: item.token,
          want: parseInt(item.want) / (10 ** 18),
          canOrder: canorder
        };
        if (!canorder && isReceipt) {
          let receipt = await this.contract.methods.Ious(order.tokenAddress, order.tokenOrder).call();
          // console.log('receipt', receipt)
          data.isComplete = receipt.completeorder;
          data.filledTime = parseInt(receipt.lenderordertime);
        }
        return data;
      })();
    }));

    return results.filter(Boolean);
  }

  // get each order details by token & order id
  async getOrderDetail(tokenAddress, orderIndex, filterCanorder, isReceipt, filterAddress) {
    let orders = [];
    for (let i = 0; i < orderIndex.length; i++) {

      let canorder = await this.contract.methods.canorder(tokenAddress, orderIndex[i]).call();

      // 過濾已成交訂單
      if (filterCanorder) {
        if (!canorder) continue;
      }

      let item = await this.contract.methods.Orders(tokenAddress, orderIndex[i]).call();
      // console.log('item', item)

      if (filterAddress) {
        let dataAddress = (item[filterAddress]).toLowerCase();
        let walletAddress = (window.ethereum.selectedAddress).toLowerCase();
        if (dataAddress !== walletAddress) {
          continue;
        }
      }

      let data = {
        amount: parseInt(item.amount) / (10 ** 18),
        borrower: item.borrower,
        id: item.id,
        lender: item.lender,
        rate: parseInt(item.rate) / (10 ** 16),
        settleday: parseInt(item.settleday),
        startday: parseInt(item.startday),
        token: item.token,
        want: parseInt(item.want) / (10 ** 18),
        canOrder: canorder
      };

      // 取得已成交借據資料
      if (!canorder && isReceipt) {
        let receipt = await this.contract.methods.Ious(tokenAddress, orderIndex[i]).call();
        // console.log('receipt', receipt)
        data.isComplete = receipt.completeorder;
        data.filledTime = parseInt(receipt.lenderordertime);
      }
      orders.push(data);
    }

    return orders;
  }

  async selectOrder(token, i) {
    let extraData = await this.contract.methods.choseorder(token, i);
    let data = extraData.encodeABI();
    return this.sendTransaction(data);
  }

  async payback(token, i) {
    let extraData = await this.contract.methods.payback(token, i);
    let data = extraData.encodeABI();
    return this.sendTransaction(data);
  }

  async take(token, i) {
    let extraData = await this.contract.methods.takemortgage(token, i);
    let data = extraData.encodeABI();
    return this.sendTransaction(data);
  }

  async cancel(token, i) {
    let extraData = await this.contract.methods.borrowertake(token, i);
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

  async sendTransaction(data, value) {
    let web3;
    if (value) {
      web3 = await new Web3(new Web3.providers.HttpProvider(store.state.rpcUrl));
    }
    const transactionParameters = {
      to: store.state.DefiAddress,
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