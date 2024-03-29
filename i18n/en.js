export default {
  test: '測試測試測試',
  // langs
  tw: '繁體中文',
  chs: '簡体中文',
  jp: '日本語',
  en: 'English',
  // navbar
  gamePool: 'Prize Pool',
  buyEGT: 'Buy EGT',
  sellEGT: 'Swap for ETH',
  swapEGT: 'Swap for ETH-EGT',
  calculator: 'EGT Unit Converter',
  community: 'My Community',
  orderListNav: 'Supply<br />List',
  myDepositNav: 'My<br />Supply',
  depositRuleNav: 'Rules',
  tokenSwapNav: 'Swap',
  headerMyLoanNav: 'My<br />Loans',
  borrowRuleNav: 'Rules',
  createLoanNav: 'Apply<br />Loans',
  // index
  indexTitle: 'P2P Lending Based on Smart Contracts for Commercial Purpose',
  indexSubtitle:
    'Smart Contracts．Decentralization．Run on the Ethereum blockchain．P2P Lending',
  indexDesc:
    'EDT, a completely decentralized peer-to-peer lending built on blockchain for commercical purpose, bundles with smart contracts and runs on Ethereum in order to be impartial, fair and transparent. It is trustworthy and worry-free for everyone to invest and borrow.',
  investAmount: 'Loan Amount',
  gamePoolAmount: 'Prize Pool Amount',
  login: 'Log in',
  logout: 'Log out',
  // 貸款
  toBorrow: 'Borrow',
  borrowRule: 'Rules',
  borrowRuleText: [
    'Befor applying for loans, the borrower shall deposit your collateral in your blockchain wallet. Then, complete the form to submit the loan application.',
    'After you successfully submit the application, the collateral will be kept in smart contract, and you will find the loan contract on My Loans and Investment List waiting for matchmaking. Before getting matched, the borrower can always amend your content anytime',
    "After you get matched, the borrower's blockchain wallet will receive the loan proceeds(interest deduction) and you will find the loan contract on My Loans.",
    "The borrower can repay the loan anytime before the due date. After the borrower successfully repays the loan, the smart contract will automatically return the collateral to the borrower's blockchain wallet.",
    'When the contract expires, if the borrower defaults on the loan, the collateral will be seized by smart contract and the investor has the right to obtain ownership of the collateral.',
    'The borrower shall bear the gas fee involved in the transactions mentioned above.',
  ],
  myLoans: 'My Loans',
  headerMyLoan: 'My Loans',
  createLoan: 'Apply for Loans',
  // 投資
  toDeposit: 'Supply',
  depositRule: 'How to Invest',
  depositRuleText_usdt: [
    'Before investing, the investor shall deposit your USDT in your blockchain wallet. Then, click Investment List to get your investment contract and apply for investment.',
    'Once you provide funds to the borrower, and the transaction is executed, USDT will be automatically transferred to the borrower by smart contract. Then you will find your supply information on ‘My Supplies’',
    "By the time the contract expires, if the borrower repays the loan, the total amount and its interest will be automatically transferred to the investor's blockchain wallet.",
    'When the contract expires, if the borrower defaults on the loan, the investor has the right to claim 90% of the collateral, and 10% of which will be seized by the platform.',
    'The investor shall bear the gas fee involved in the transactions mentioned above.',
  ],
  depositRuleText_tbt: [
    'Before supplying, you shall deposit TBT in your blockchain wallet. Then, click the ‘Supply List’ and provide your assets based on the market borrowing demand.',
    'Once you provide funds to the borrower, and the transaction is executed, TBT will be automatically transferred to the borrower by smart contract. Then you will find your supply information on ‘My Supplies’',
    "By the time the contract expires, if the borrower repays the loan, the total amount and its interest will be automatically transferred to the investor's blockchain wallet.",
    'When the contract expires, if the borrower defaults on the loan, the investor has the right to claim 90% of the collateral, and 10% of which will be seized by the platform.',
    'The investor shall bear the gas fee involved in the transactions mentioned above.',
  ],
  myDeposit: 'My Supplies',
  orderList: 'Supply List',
  // defi registry
  registryBorrow: 'Register before borrowing',
  registryDeposit: 'Register before investing',
  enterReferer: 'Enter Your Referrer’s Address',
  // egt
  enterEthAmount: 'Enter the ETH Quantity',
  enterExchangeEthAmount: 'Enter the Desired ETH Quantity',
  enterEgtAmount: 'Enter the EGT Quantity',
  enterExchangeEgtAmount: 'Enter the Desired EGT Quantity',
  enterBSCEgtAmount: 'Enter the BSC-EGT Quantity',
  canChange: 'Get',
  piece: 'Unit',
  pieceBack: '',
  buy: 'buy',
  egtExchangeRateFront: 'Exchange Rate: ',
  egtExchangeRateBack: '',
  registryEgt: 'Register before buying',
  registry: 'Activate',
  sellApprove: 'Unlock before Swapping',
  sell: 'Swap',
  sendBscEGT: 'Sending ETH-EGT',
  // bridge
  userAddress: "User's Address",
  enterBridgeAmount: 'Enter the Desired ETH-EGT Quantity',
  sendToken: 'Send',
  // game
  luckyPool: 'Lucky Prize Pool',
  countdown: 'Countdown',
  noOrder: 'Currently No Order',
  drawing: 'Drawing',
  currRound: 'Round',
  newLuckyAddress: 'The Latest Lucky Address',
  luckyPoolRule: 'Lucky Pool Rules',
  luckyPoolRuleText: [
    'Each Prize Bracket has its allotted time frame, and thus each round will be based on the Countdown shown above. Each allotted time frame will be based on the Prize Brackets List shown below. If a new loan contract was carried out, the Countdown will be recalculated based on the new Rollover and its allotted time. By the time the Countdown finishes off, if there is no new loan contract, the round will be finished off and the lucky address will have all the prize. ',
    'Lucky Address: When Countdown ends, the address of the borrower who happens to be the last borrower who successfully matches the loan contract.Let me take myself as an example. When the Rollover is more than 100,000, and its allotted time frame is 10 minutes, if I successfully match the loan contract (no matter how much I apply for or how much interest it attaches), my address will be the the Latest Lucky Address. As a result, the Countdown will start from 10 minutes. By the time the Countdown ends, if there is no other new matched borrower, my address will be the Lucky Address and have all the prize. However, before the Countdown ends, there is another new borrower who successfully matches the loan contract, the Countdown will restart from 10 minutes, and he will be the winner while I have no chance to win since his address is currently the Latest Lucky Address.',
  ],
  stepTable: 'Prize Brackets',
  time: 'Time',
  blockchainBased: 'based on block time',
  accumPoolAmount: 'Rollover',
  rankPool: 'Battle Prize Pool',
  myRankAmount: 'My Battle Fees',
  rankPoolRule: 'Rules',
  rankPoolRuleText_usdt: [
    'The Battle Pool will take 30 days for a new round, and the exact time of each round will be based on the Countdown shown above. When the round ends, the player with the highest Battle Fees will have the 50% of the Battle Prize Pool, and the rest of the 50% will be proportionally distributed to other 49 players (from second rank to 50th rank).',
    'Battle Fees: When you apply for an loan, and the loan contract successfully get matched, its interest will be accumulated as your Battle Fees. However, the same loan and its interest cannot be used for the next round.Let me take myself as an example. In the round, I apply for the first loan and successfully get matched, so the interest coming along is 100USDT. Then I apply for the second loan, and the interest is 200 USDT. As a result, my Battle Fees will be 300USDT (100+200). If my Battle Fees in the round are the highest one, then I will get to have 50% of the Battle Prize Pool. But if my Battle Fees are not the highest but still in Top 50, then Prize Pool will be proportionally distributed based on my ranking.',
  ],
  rankPoolRuleText_tbt: [
    'The Battle Pool will take 30 days for a new round, and the exact time of each round will be based on the Countdown shown above. When the round ends, the player with the highest Battle Fees will have the 50% of the Battle Prize Pool, and the rest of the 50% will be proportionally distributed to other 49 players (from second rank to 50th rank).',
    'Battle Fees: When you apply for an loan, and the loan contract successfully get matched, its interest will be accumulated as your Battle Fees. However, the same loan and its interest cannot be used for the next round.Let me take myself as an example. In the round, I apply for the first loan and successfully get matched, so the interest coming along is 100TBT. Then I apply for the second loan, and the interest is 200 TBT. As a result, my Battle Fees will be 300TBT (100+200). If my Battle Fees in the round are the highest one, then I will get to have 50% of the Battle Prize Pool. But if my Battle Fees are not the highest but still in Top 50, then Prize Pool will be proportionally distributed based on my ranking.',
  ],
  rank: 'Rank',
  address: 'Address',
  rankAmount: 'Fees',
  // other
  yourAddress: 'Your Receiving Address',
  backToIndex: 'Return',
  gasNowEstimate: 'Currently Estimated Gas Fee',
  gasWarning:
    '(The estimated gas fee serves as a reference only. The actual gas fee shall be based on the costs required to execute a contract.)',
  priceUpdated: 'The prices were last updated: ',
  filter: 'Filter',
  id: 'No. ',
  loanDays: 'Due within',
  loanToken: 'Collateral Currency',
  loanTokenAmount: 'Collateral Amount',
  loanAmount: 'Loan Amount',
  loanMortgage: 'LTV',
  loanRate: 'Interest Rate',
  loanInterest: 'Interest',
  marketValue: 'Market Value',
  marketValueLabel: 'Market Value',
  APR: 'APR',
  waiting: 'Order Matching',
  repay: 'Repaid',
  breach: 'In default',
  loaning: 'Ongoing',
  approve: 'Unlock before Applying',
  more: 'More than',
  less: 'Less than',
  invest: 'Invest',
  noRecord: 'No Relevant Record',
  day: 'days',
  hour: ' h',
  min: ' m',
  sec: ' s',
  contract: 'The contract ',
  expired: 'has expired',
  buffer: 'is in grace period',
  due: 'Due within',
  status: 'Contract Status',
  withdraw: 'Supplied',
  edit: 'edit',
  modify: 'edit',
  cancel: 'Cancel',
  payback: 'Repay',
  apply: 'Apply',
  editWarning: "'Edit' will CANCEL the order and have it reorder",
  editSubWarning:
    '(Whether you cancel or place an order, you will have to pay the gas fee.)',
  // calculator
  vs: ' for ',
  vsEn: 'Swap',
  vsBack: '',
  change: 'Exchange',
  amount: 'Quantity',
  dollar: '',
  dataUpdated: 'The data was last updated: ',
  calculate: 'Calculate',
  // community
  refererAmount: 'My Referees',
  communityAmount: 'My Community Members',
  // ADT
  adt: 'ADT',
  holding: 'The Quantity You Hold',
  claimable: 'The Quantity You Get',
  claim: 'Get',
  // gas fee
  gasPage: 'Gas Subsidy',
  date: 'Date',
  from: 'Start Date',
  to: 'End Date',
  applyAddress: "Applicant's Address",
  search: 'Search',
  total: 'Total',
  subsidy: 'Subsidy',
  subsidyTotal: 'Total Amount of Subsidy',
  send: 'Send',
  // warning
  warning: 'RISK NOTICE',
  warningRegistry:
    '1. Please register before you borrow or invest, or you may not be able to complete processing.',
  warningBorrow:
    '2. The market value of the collateral on the website serves as a reference only. The information does not represent an assessment of the market value of the collateral, and shall not be contrued as only standard reference. The information are subject to continuous change and therefore are not warranted as to its accuracy or fitness for investment purpose. As mentioned above, investors should weigh their own risks and take responsibility of their own decisions. _platform_ have no liability for the accuracy of the information provided.',
  warningDeposit:
    '2. The market value of the collateral on the website serves as a reference only. The information does not represent an assessment of the market value of the collateral, and shall not be contrued as only standard reference. The information are subject to continuous change and therefore are not warranted as to its accuracy or fitness for investment purpose. As mentioned above, investors should weigh their own risks and take responsibility of their own decisions. _platform_ have no liability for the accuracy of the information provided.',
  warningCalculate:
    'The market value of the collateral can be calculated on EGT Unit Converter.',
  toRegistry: 'Register',
  toCalculator: 'Go to EGT Unit Converter',
  agree: 'I have read, understand, and agree to the above rules.',
  confirm: 'Confirm',
  // toasted
  loginFirst: 'Please log in first',
  installMetamask: 'Please download MetaMask first',
  changeMainnet: 'Please switch to Binance Smart Chain(BSC)',
  changeETH: 'Please switch to Ethereum Mainnet',
  connectionBreak: 'Disconnected. Please log in again',
  changeWallet: 'Successfully changed the connected account',
  waitApprove: 'Unlocking, Please wait',
  waitRegistry: 'Registering, Please wait',
  waitClaim: 'Withdrawing, Please wait',
  txSend: 'Transaction Sent',
  userRefuse: 'The user refused to connect',
  addressHasUsed: 'The address has been registered',
  errorOccured: 'Error',
  USDTUnderBalance: 'USDT balance is insufficient',
  TBTUnderBalance: 'TBT balance is insufficient',
  underBalance: 'Insufficient Funds',
  gameOpening: 'Prize Pool Drawing',
  cannotGetGas: 'cannot calculate the gas fee',
  renewGetGas:
    'WebSocket get disconnected. Please reload this page to get the latest estimated gas fee',
  renew: 'WebSocket get disconnected. Please reload this page',
  waitGetData: 'Please wait, we are loading data from blockchain',
  noReward: 'Currently No Return',
  cannotGetEthValue:
    'data failed: error occured in collecting the market value of ETH',
  cannotGetData: 'data failed: error occured in collecting data',
  selectTx: 'Please choose the transaction you need to subsidize',
  txError: 'trade failed: error occured while trading',
  agreeFirst: 'Please agree to the terms',
  cannotGetMarketValue: 'cannot calculate the market value',
  cryptoLendingPlatform: 'Crypto Lending Platform',
  tokenSwap: 'Swap',
  disabled: 'Unactivated',
  depositMention:
    'As a supplier, you shall pay the gas fee (BNB) when executing the transactions mentioned below.',
  depositSoon: 'Supply Now',
  warningContent:
    'The platform will not provide the timely market value of collateral since the market value of the collateral is subject to fluctuation. Borrowers and suppliers shall not consider the market value of the collateral on the platform as the only advice or information for investment. Therefore the platform bears no liability to inform the timely and accurate market value of the collateral.',
  continueDeposit: 'Continue',
  serviceRegistry: 'Activate Your Service',
  enterRefererPlaceHolder: 'Enter Address',
  yoursReceiveAddress: 'Your Address',
  notInWhiteList:
    'You are not yet qualified to place an order, please contact the contact window',
  predictApr: 'Estimated APR',
  loanRateFull: 'Interest Rate',
  loanInterestFull: 'Interest ({token})',
  onPayback: 'Repayment',
  loanDateLabel: 'Supply Date',
  creationTime: 'Creation Date',
  paybackTime: 'Repayment Date',
  cancelTime: 'Cancel Date',
  selectDepositTokenType: 'Select Collateral Token',
  depositNotify:
    'Before borrowing, make sure you have enough amount of the collateral in your blockchain wallet.',
  usable: 'Balance',
  pleaseSelectLoansDays: 'Select the loan tenor',
  pleaseEnterWantedLoan: 'Enter an amount of the loan',
  pleaseEnterAmount: 'Enter {token} Amount',
  pleaseProvideLoanRate: 'Enter interest rate',
  otherTokenSwap: 'Other Cryptos',
  transferToken: '{fromToken}→{targetToken}',
  transferToken_mbl: '{fromToken}→{targetToken}',
  swapImmediate: 'Swap',
  swapAmount: 'Total Amount, {amount} {tokenName}',
  enterAmount: 'Enter an amount, {tokenName} ({protocol})',
  enterWantedSwapAmount:
    'Please enter the amount of {tokenName} you want to swap',
  sideNavSubTitle: [
    'DEFI provides multiple tools for asset management,',
    'helping you find the best way to manage your assets.',
  ],
  disclaimerContent: [
    'DEFI (collectively, the “Services”) solely serves as a matchmaking platform for suppliers and borrowers. Given the information pertaining to collateralized loans on the Services is decided and published by suppliers and borrowers, any related liability and contract shall only be assumed and enforced by both suppliers and borrowers. If any controversy and dispute arise, suppliers and borrowers shall be liable for resolving the controversy and dispute. Therefore, the Services shall not be responsible for any controversy and dispute and will not resolve and intervene in any controversy and dispute.',
    'Some fundraising groups on social media, recently formed by some borrowers and publicly soliciting funding, have no relation with the Services. If any dispute and controversy arise, the borrowers shall bear all the responsibility and resolve the dispute and controversy. Also, note that stakeholders shall evaluate the identity of the borrowers thereof, which will be at your own risk.',
    'You acknowledge and agree that you will access and use the Services, including, without limitation, our websites (for laptop and mobile), applications, database system and our other related programmed services. The Services are provided on an "as is" and "as available" basis. We reserve the right to modify or update the Services at any time. We shall not be liable for any damages or losses caused by temporary suspension of services or suspension of transactions during modifying or updating the Services. We shall not compensate users for all the damages or losses under the circumstances mentioned above.',
    'Please note that in order to ensure the rights and benefits of our members, the users shall observe the Terms of Services. If you have any questions, please feel free to contact us.',
  ],
  sideNavSlogan: 'Amplify Your<br />Crypto Assets.',
  disclaimer: 'Disclaimer',
  unlockToken: 'Unlock',
  enabled: 'Activated',
  isCancel: 'Cancelled',
  notForTaiwan: 'This site does not serve customers in Taiwan.',
  toDetails: 'Detailed explanation',
  close: 'Close',
  notForTaiwanContent: `Our company has been committed to providing high-quality products and services and has established a broad customer base worldwide. However, due to some legal and management restrictions, we are currently unable to offer our products and services to users in Taiwan.\nWe deeply regret that this decision may cause inconvenience and difficulties for you. We thank you for your support and trust in our company and appreciate your understanding.\nIf you have any questions or need further clarification, please feel free to contact our customer service department. We will do our utmost to provide you with support and assistance.\nThank you again for your support and understanding. We look forward to the opportunity to serve you in the future.\n\n`,
  switch: `switch`
}
