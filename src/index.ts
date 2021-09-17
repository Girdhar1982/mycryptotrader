 
import {app} from './app';
import {ExchangeClient} from './classes/exchange';
import {Trade,Trades} from './models/trade';
import {Position,Positions} from './models/position';
import {HistoricalService} from './classes/historical';
import {CandleStick} from './models/candlestick';
import commander from 'commander';
import dotenv from 'dotenv';
import ccxt from 'ccxt';;
import axios from 'axios';
import fs from 'fs';

let num=0;
const appconfig=require('./config');
function toDate(val:any){
return new Date(val * 1e3)
}

function toUnixDate(val:any){
return new Date(val / 1e3)
}

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
const now = new Date();
const yesterday= new Date(now.getTime() - (24 * 60 *60 * 1e3 ))
//@ts-ignore
const start =async (config,client) =>{
await startcleanup()
/*
try{ 
//@ts-ignore
 //console.log(chigh, cclose ,clow,tbid,tcurrent,ticker.info,buyprice )
if(Trades.tradesNotEmpty()){
  //@ts-ignore
let currentTrades=Trades.GetTrade() ;
//console.log('Current Trades - ',currentTrades);
//@ts-ignore
for (let i = 0; i < currentTrades.length; i++) {
//@ts-ignore 
//@ts-ignore
let order=await ExchangeClient.fetchOrder(currentTrades[i].id)
 
if(order){
 //console.log(order.status);
//Add to Position if order is filled
if(order.status === 'open'){
  // added to the positions  
//@ts-ignore
  console.log(`Current open trade (${currentTrades[i].amount}) buy price (${currentTrades[i].price}) - side (${currentTrades[i].side}) === Status  (${currentTrades[i].status}) `)
  }

//Add to Position if order is filled
if(order.status === 'filled'){
// added to the positions
const position= new Position(order)
await Positions.addPosition(position)
/// remove from trade queue 
await Trades.removeTrade(order.id)
console.log(`Order filled added to position (${order.amount}) buy price (${order.price}) - side (${order.side}) `)
}

if(order.status === 'canceled'){
  // added to the positions 
  /// remove from trade queue 
  await Trades.removeTrade(order.id)
  console.log(`Order Cancelled removed from Trades- buy price (${order.price}) - side (${order.side}) `)
}

}else{
//@ts-ignore
await Trades.removeTrade(currentTrades[i].id)
//@ts-ignore
console.log(`Could not locate order.. it might have been removed manually. Order Id. ${currentTrades[i].id} Cleanup Done.'` )
}
} 
currentTrades=Trades.GetTrade()
if(currentTrades){
//@ts-ignore
if(currentTrades.length > 0){
var new_json = JSON.stringify(currentTrades);
fs.writeFile("trades.txt", new_json, function(err) {
  if (err) {console.log(err);}
});
}
}

}else{console.log('There are No Open Trades.')}
if(Positions.positionsNotEmpty()){
let currentPositions=Positions.GetPosition()
console.log('Current positions',currentPositions)
//@ts-ignore
if(currentPositions.length > 0){
  var new_json = JSON.stringify(currentPositions);
  fs.writeFile("currentPositions.txt", new_json, function(err) {
    if (err) {console.log(err);}
  });
  }
}
//
//console.log(Trades.GetTrade());
}catch(err){console.log(err)}
//app.listen(3000, ()=>{  console.log('Crypto v3 Listening on 3000');});
*/
}


const startcleanup=async()=>{
try{
  num=(num+1);
  console.log(num);
const getcurrent=await ExchangeClient.getCurrent();

const {ticker,account_balance,assetBalance,baseBalance} =getcurrent
if(ticker){
 
console.log('trading is open asking price...',ticker.info.askPrice)
}
//check if asset balance is 0 if it is then buy 100 USDT 
if((assetBalance !== undefined) && (baseBalance !== undefined ) ){ 
//if(baseBalance  >= 1281 && assetBalance === 0 ) {
if(baseBalance  >= 1  ) {
const saveUSDT=(baseBalance - 2)
if(saveUSDT > 1 ){
await ExchangeClient.createmarketbuyorder('200');
setTimeout(function() {}, 1000);
console.log('Buy here usdt available ',saveUSDT)
}
}
else{
console.log(assetBalance,baseBalance )
}
}
//console.log(ticker);
}catch(err){
//console.log(ticker);
if(err){console.log(err)}
}
/*
let orders=await ExchangeClient.CurrentOpenBuyOrders();
if(orders){   
  for (let i = 0; i < orders.length; i++) {
  if(orders[i].id === undefined ){
   console.log('Error : Order Id is not right' );
   } 
  let order=await ExchangeClient.fetchOrder(orders[i].id)
  if(order){   
  console.log(`Existing Order with (${orders[i].amount}) buy price (${orders[i].price}) - Cancelled : Because of Startup `)   
  //existing order with Not same price 
  await Trades.removeTrade(orders[i].id)
  await ExchangeClient.cancelorder(orders[i].id);  
  }}
}
*/
}

const run = async() => {
ExchangeClient.connect(appconfig.ftx.apiKey,appconfig.ftx.apiSecret)
app.listen(3000, ()=>{
console.log('App Listening on 3000');
});
//console.log(client);
await startcleanup()
start(appconfig.config,ExchangeClient.client);
setInterval(start,appconfig.config.tickInterval,appconfig.config,ExchangeClient.client)
} 
run();


