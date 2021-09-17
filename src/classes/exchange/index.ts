import ccxt from 'ccxt';
import {HistoricalService} from '../historical';
import {CandleStick} from '../../models/candlestick';

const appconfig=require('../../config');
const {asset,base,allocation,spread,candleInterval}=appconfig.config;
const market = `${asset}/${base}`;
const now = new Date();
const yesterday= new Date(now.getTime() - (24 * 60 *60 * 1e3 ))

class exchangeclient{
  //@ts-ignore
  private _client;
  get client(){
  if (!this._client){
  throw new Error('Client not connected..')
  } return this._client;
  }

  connect(apiKey:string,secret:string){
  this._client= new ccxt.binance({apiKey:apiKey,secret:secret})
  return new Promise((resolve,reject)=>{
  this._client.enableRateLimit = true;
  console.log('Connected to exchange...');resolve('true')
  });
}

 //@ts-ignore
  async CurrentOpenOrders(){   
  const orders = await this._client.fetchOpenOrders(market);
  if (orders.length !== 0 ){
  try{  
  return (orders)
  }catch(err){
   } }
   return (null)
  }


 //@ts-ignore
 async CurrentOpenBuyOrders(){   
  const orders = await this._client.fetchOpenOrders(market);
  if (orders.length !== 0 ){
  try{ 
  //@ts-ignore
  orders = orders.filter((td)=>{
  //@ts-ignore
  if(td.side === 'buy'){ return td}})
  return (orders)
  }catch(err){
   } }
   return (null)
  }

//@ts-ignore
 async fetchOrder(id){  
 const order = await this._client.fetchOrder(id);
 //console.log(account_balance)
 //console.log("check",orders,orders.length);
if (order.length !== 0 ){
//@ts-ignore
return order     
}
return (null)
}


async getCurrent(){
let ticker,account_balance,assetBalance,baseBalance;
try{
  ticker = await this._client.fetchTicker(market)
  //const service=new HistoricalService(now,yesterday,candleInterval)
  account_balance = await this._client.fetch_balance()
    assetBalance= account_balance.free[asset];
  //const baseBalance= account_balance.free[base];
   baseBalance= account_balance.free[base]; 
}catch (err){console.log('Getting current account balance error.. ',err)}
return ({ticker,account_balance,assetBalance,baseBalance})
}

async  getPriceHistory(){
  //@ts-ignore
 const service=new HistoricalService(now,yesterday,candleInterval)
 //const ohlcv=await client.fetchOHLCV(market,'5m');
//@ts-ignore
const ohlcv=await service.getData();
//@ts-ignore
const candlesticks = ohlcv.map((f)=>{
//@ts-ignore
return new CandleStick({
 startTime:(new Date(f[0] )),
 low:f[1],
 high:f[2],
 open:f[3],
 close:f[4],
 interval:candleInterval,
 volume:f[5]
})
})
return (candlesticks)
}

//@ts-ignore
async  createlimitbuyorder(buyVolume,buyPrice){
let order;
try{
order=await this._client.createLimitBuyOrder(market,buyVolume,buyPrice);
return (order)
}catch(err){console.log('buy order failed.. ',err);return null}
}



//@ts-ignore
async  createmarketbuyorder(buyVolume){
  let order;
  console.log(`Creating New Market buy order with .. Volume (${buyVolume}) `)
  try{
  //const amount=10;     
  //order=await this._client.createOrder(market,'market','buy',buyVolume);
  return (order)
  }catch(err){console.log('buy order failed.. ',err);
  //try sending low volume
  try{
  //order=await this._client.createOrder(market,'market','buy',20); 
  }catch(err){
    console.log('Low Volume buy order failed.. ',err);
  }
  return null}
  }

//@ts-ignore
async  createlimitsellorder(sellVolume,sellPrice){
  let order;
  console.log(`Creating New Order with .. Volume (${sellVolume}) Sell price (${sellPrice}) `)
 try{
order=await this._client.createLimitSellOrder(market,sellVolume,sellPrice);
return (order)
}catch(err){    
console.log('Create Sell order failed.. ',err)
return null;
} 
}



//@ts-ignore
async cancelorder(id){
  let order;
  try{
  order=await this._client.cancelOrder(id)
  return (order)
  }catch(err){console.log('Cancel order failed.. ',err);return null;}  
  }
}
  export const ExchangeClient= new exchangeclient();