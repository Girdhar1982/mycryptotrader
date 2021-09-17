import express, {Request,Response} from 'express';
const router = express.Router();
const events = require('events');
import {ExchangeClient} from '../classes/exchange';
import {Position,Positions} from '../models/position';
import {Trade,Trades} from '../models/trade'
const appconfig=require('../config');
const {asset,base,allocation,spread,candleInterval}=appconfig.config;const market = `${asset}/${base}`;
//@ts-ignore
function priceBetween(x, min, max) {
  return parseFloat(x) >= parseFloat(min) && parseFloat(x) <= parseFloat(max);
  }  
  //@ts-ignore
  function priceHigher(x, high) {
    return parseFloat(x) >= parseFloat(high);
  }  
  //@ts-ignore
  function priceLower(x, low) {
    return parseFloat(x) <= parseFloat(low);
  }
  //@ts-ignore
  function priceEqual(x,price){
    return parseFloat(x) == parseFloat(price);
  }

var eventEmitter = new events.EventEmitter();
//@ts-ignore
eventEmitter.on('error', (err) => {
  console.error('Error on eventEmitter: ',err);
})
////#region 
/////////////////BUY SIGNAL
////////////////
eventEmitter.on('buy', async () => {
  console.log(`Call to buy: ${market}`)
  try{    
    let orderRetained=false;
    //Get all Current Open  Orders 
    let orders=await ExchangeClient.CurrentOpenBuyOrders();
    //All existing buy orders need to close to update the asset balances accurately
    //Also it will help to progress with the market.
    if(orders){   
      for (let i = 0; i < orders.length; i++) {   
      let order=await ExchangeClient.fetchOrder(orders[i].id)
      if(order){    
      /*
      const pCheck= priceEqual(order.price,buyprice)
      if(pCheck){ 
      console.log(`Existing Order with (${orders[i].amount}) buy price (${orders[i].price}) - Retained `)   
      /////existing order with same price 
      orderRetained=true;
      const fTrade=Trades.GetTradeWithId(orders[i].id)
      if(fTrade === null ){
      const trade= new Trade(order)    
      await Trades.addTrade({trade})
      }
      }else{}*/
      console.log(`Existing Order with (${orders[i].amount}) buy price (${orders[i].price}) - Cancelled `)   
      //existing order with Not same price 
      await Trades.removeTrade(orders[i].id)
      await ExchangeClient.cancelorder(orders[i].id);    
      }}}  

    //Get the candles in 10m interval
    const getpricehistory=await ExchangeClient.getPriceHistory()    
    const candlesticks = getpricehistory
    const len=candlesticks.length
    //Get average of last candle-using this as buy price 
    const candle=(candlesticks[len-1]) 
    const avg=(candle.average())
    const chigh=candle.high;
    const clow=candle.low;const cclose=candle.close;
    ;const copen=candle.open;
    const getcurrent=await ExchangeClient.getCurrent();
    const {ticker,account_balance,assetBalance,baseBalance} =getcurrent
    const tcurrent=ticker.info.price;
    const tbid=ticker.info.bid;
    let buyprice,buyVolume
    if(priceLower(tbid,clow)){
    console.log(`Last Bid ${tbid} selected for buy price: ${market}`)
    buyprice=tbid;
    }else{
    if(priceHigher(tbid, chigh)){
    console.log(`Last Close ${cclose} selected to buy :  ${market}`)
    buyprice=cclose;
    }
    if(priceBetween(tbid, clow, chigh)){
    console.log(`Average of High (${chigh}) Low (${clow}) Close ${cclose}  is ${avg} selected to buy :  ${market}`)
    buyprice=avg;
    }
    }
    let tempvol= parseFloat(baseBalance) / parseFloat(buyprice)
    buyVolume= Number((tempvol).toFixed(1));    
    console.log(`Account Balance (${baseBalance}) buy volume (${buyVolume}) `)
    buyprice='.38'

    let buyEnabled=false;
    if (baseBalance > '.50'){;buyEnabled=true} else{
    console.log(`Nothing to spend Buy disabled.. (${baseBalance}) lower then .50 cents `)
    }
    //console.log(Trades.GetTrade());
    if(!orderRetained && buyEnabled){
    console.log(`Creating New Order with .. Volume (${buyVolume}) buy price (${buyprice}) `)
    let order=await ExchangeClient.createlimitbuyorder(buyVolume,buyprice)
    //console.log(order);
    const trade= new Trade(order) 
    await Trades.addTrade({trade})     
    //place buy order 
    //to the trade list 
    }  
 
    }catch(err){console.log(err)}
}) // eventemitter.on('buy')
///////////////BUY Signal END
//#endregion

/////////////////Sell SIGNAL
////////////////
eventEmitter.on('sell', async () =>{
  console.log(`Call to Sell: ${market}`);
  try{
  let orderRetained=false;
  //Get all Current Open  Orders not filled
  let orders=await ExchangeClient.CurrentOpenOrders();
  if(orders){
    for (let i = 0; i < orders.length; i++) {
    let order=await ExchangeClient.fetchOrder(orders[i].id)
    if(order){
      /*
      const pCheck= (priceEqual(order.price,sellprice) && priceEqual(order.amount,sellVolume))
       if(pCheck){ 
      console.log(`Existing (${orders[i].side})  Order with amount (${orders[i].amount}) price (${orders[i].price})  - Retained `)   
      /////existing order with same price 
      orderRetained=true;
      const fTrade=Trades.GetTradeWithId(orders[i].id)    
      if(fTrade === null ){
      const trade= new Trade(order)
      await Trades.addTrade({trade})
      }}else{}
  */
      //Cancel every thing not filled.  
      console.log(`Existing (${orders[i].side})  Order with (${orders[i].amount}) price (${orders[i].price})  - Cancelled `);
      await Trades.removeTrade(orders[i].id);
      await ExchangeClient.cancelorder(orders[i].id);     
      }}
    }

  //@ts-ignore
  /* Cancel all order ... should not be buying when signal is sell 
  orders = this._trades.filter((td)=>{
      //@ts-ignore
    if(td.side === 'sell'){ return td}})
  */
  //Get the candles in 10m interval
  const getpricehistory=await ExchangeClient.getPriceHistory()    
  const candlesticks = getpricehistory
  const len=candlesticks.length
  //Get average of last candle-using this as buy price 
  const candle=(candlesticks[len-1]) 
  const avg=(candle.average())
  const chigh=candle.high;
  const clow=candle.low;const cclose=candle.close;;const copen=candle.open;
  const getcurrent=await ExchangeClient.getCurrent();
  const {ticker,assetBalance} =getcurrent
  const task=ticker.info.ask;
  let sellprice, sellVolume;
  sellVolume=assetBalance
  sellprice=task;
  console.log(`Asset Balance (${sellVolume}) to sell - Price  (${sellprice}) `)
  sellprice='.65'
    let sellEnabled=false;
    if (priceLower('.99',assetBalance)){;sellEnabled=true} else{
    console.log(`Nothing to Sell disabled.. (${assetBalance}) lower then .99`)
    }
    //console.log(Trades.GetTrade());
    if(!orderRetained && sellEnabled){   
    let order=await ExchangeClient.createlimitsellorder(sellVolume,sellprice)     
    const trade= new Trade(order)     
    await Trades.addTrade({trade})
    //console.log(order);
    //place buy order 
    //to the trade list 
    }  
  }catch(err){console.log(err)}
}) // eventemitter.on('buy')
///////////////Sell Signal END
router.post('/',(req:Request, res:Response)=>{
//@ts-ignore
let body = [];
req.on('error', (err) => {
  console.error(err);
}).on('data', (chunk) => {
  body.push(chunk);
  console.log('Got Something');
}).on('end', () => {
  //@ts-ignore
  body = Buffer.concat(body).toString();
  //@ts-ignore
  if(body === 'buy') { 
    console.log(body);
   // eventEmitter.emit('buy'); // <----------------------- BUY
  } 
  //@ts-ignore    
  if(body === 'sell') {
 // eventEmitter.emit('sell'); // <---------------------- SELL
  }  
  //@ts-ignore  
  if(body === 'stop') {
  //eventEmitter.emit('sell'); // <---------------------- SELL
  }
    //@ts-ignore  
    if(body === 'test') {
      console.log(req.headers.referer);; // <---------------------- SELL
      }
  
  res.statusCode = 200;
  res.end();
  }
)

}
)
export {router as receiveAlert}