// bsc
require('dotenv').config()
export const DefiAddress = '0x4685A7122971CED7b0b8FdB95Cb40eeC4BE174a3';

export const DefiAddressV2TBT = process.env.VUE_APP_DEFI_V2_TBT_ADDRESS;
export const DefiAddressV2USDT = process.env.VUE_APP_DEFI_V2_USDT_ADDRESS;

export const EGTAddress = '0xc86CEbF7380a883Acd62470cC887d24cf8FDdbac'
export const BTCAddress = '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c';
export const USDTAddress = '0x55d398326f99059fF775485246999027B3197955';
export const BscUSDTAddress = '0x55d398326f99059fF775485246999027B3197955';
export const EthBridgeAddress = '0x0cB4CD7A807F079Bc5955Cecf86987f01a61E1e1';
export const bscBridgeAddress = '0x8DD3e3Af35cD4F9bd026A49612476D2Dfb5f225f';
export const TBTAddress = '0xd7F97f2cBcDC696484dA7C04AD012723392Ce30B';
export const TBTSwapAddress = '0x353f952fe32f957c16012d4405678dcf71ca04ae';

export const USDTTestTokenAddress = '0x3b25C319980BD2f25977b8eA7bE42882e2b5046E'
export const TBTTestTokenAddress = '0x2A91aE21182Dc05689f6A3Bb209A80EFD04d32bD'

// export const rpcURL = 'https://bsc-dataseed.binance.org/';
// export const rpcURL = 'https://bsc-dataseed1.defibit.io/';
export const rpcURL = process.env.VUE_APP_RPC_URL;
export const EthRpcURL = 'https://mainnet.infura.io/v3/80d11963e8f5426d896589e98c287c95';

export const TBTPageConfig = {
  defiContract: DefiAddressV2TBT,
};

export const USDTPageConfig = {
  defiContract: DefiAddressV2USDT,
}

/**ABI
 * :Object
decimals:"18"
name:"egt"
tokenaddress:"0xc86CEbF7380a883Acd62470cC887d24cf8FDdbac"

[{"name":"egt","tokenaddress":"0xc86CEbF7380a883Acd62470cC887d24cf8FDdbac","decimals":"18"},{"name":"eth","tokenaddress":"0x2170Ed0880ac9A755fd29B2688956BD959F933F8","decimals":"18"},{"name":"btc","tokenaddress":"0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c","decimals":"18"},{"name":"eos","tokenaddress":"0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6","decimals":"18"},{"name":"ebt","tokenaddress":"0x7392c3dab3089c3B2b10B9EE6993e89c122c50dB","decimals":"18"}]

 */