/*

const cancelCurrentOrders=async (market:String,client:any)=>{
  const orders = await client.fetchOpenOrders(market);
   //console.log(account_balance)
  //console.log("check",orders,orders.length);
  if (orders.length !== 0 ){
  //@ts-ignore
  for (let i = 0; i < orders.length; i++) {
    //@ts-ignore
  //console.log(orders[i]);
  try{
  await client.cancelOrder(orders[i].id)
  console.log('Cancelled Order ',orders[i].id)


  }catch(err){
  console.log('Failed to Cancel Order ',orders[i].id, ' Error ', err)
  }



  } 
  }
  return ({})
}

















const {asset,base,allocation,spread,candleInterval}=config;
const market = `${asset}/${base}`;
const orders = await client.fetchOpenOrders(market);
const ticker = await client.fetchTicker(market)
//@ts-ignore
console.log(now,yesterday);//@ts-ignore
const service=new HistoricalService(now,yesterday,candleInterval)

//const ohlcv=await client.fetchOHLCV(market,'5m');
//@ts-ignore
const ohlcv=await service.getData();
//@ts-ignore
const candlesticks = ohlcv.map((f)=>{
//@ts-ignore
return new CandleStick({
  startTime:(new Date(f[0])),
  low:f[1],
  high:f[2],
  open:f[3],
  close:f[4],
  interval:candleInterval,
  volume:f[5]
})
})
console.log(candlesticks)
//console.log(ohlcv.length);
//time
//open
//close
//high
//low
//volume

const account_balance = await client.fetch_balance()
//console.log(account_balance)
//console.log("check",orders,orders.length);
if (orders.length !== 0 ){
//@ts-ignore
for (let i = 0; i < orders.length; i++) {
  //@ts-ignore
//console.log(orders[i]);
await client.cancelOrder(orders[i].id)
} 
}
const results =await Promise.all(
  [
  axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd'),
  axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
  ]
  )  
  const marketPrice = results[0].data.ripple.usd / results[1].data.tether.usd ;
  const sellPrice = marketPrice * (1 + spread);
  const buyPrice = marketPrice  * (1 - spread);
  const assetBalance= account_balance.free[asset];
  //const baseBalance= account_balance.free[base];
  const baseBalance= account_balance.free[base];
  console.log(`${market} : Sell Price ${sellPrice} - Buy Price  ... ${buyPrice}
  USDT Balance ${baseBalance}
  XRP Balance ${assetBalance}
  ` )

let buyDisabled=false;
let sellDisabled=false;

if (baseBalance < '.10'){console.log('Nothing to spend Buy disabled... ', baseBalance);buyDisabled=true} 
if (assetBalance < '.10'){console.log('Nothing to Sell - disabled... ', assetBalance);sellDisabled=true}
let sellVolume,buyVolume
if(!sellDisabled){
sellVolume = assetBalance * allocation;
console.log(`Market Price ${marketPrice} - New tick for ${market}... Create Limit sell order for ${sellVolume }@${sellPrice}`)
//await client.createLimitSellOrder(market,sellVolume,sellPrice);
}

if(!buyDisabled){
buyVolume = (baseBalance * allocation ) /marketPrice;
console.log(`Market Price ${marketPrice} - New tick for ${market}... Create Limit buy order for ${buyVolume }@${buyPrice} ` )
//await client.createLimitBuyOrder(market,buyVolume,buyPrice);
}
*/