import {ExchangeClient} from '../exchange';
const appconfig=require('../../config');
 

interface DataExtract{
  start: string;
  end:string;
  interval:string;
}


export class HistoricalService{
  //@ts-ignore
constructor({start,end,interval}){
//@ts-ignore
this.client = ExchangeClient.client;this.start=start;this.end=end;this.interval=interval
//@ts-ignore
this.header=  ['Timestamp', 'Open', 'High', 'Low', 'Close', 'Volume']
const {asset,base}=appconfig.config;
//@ts-ignore
this.market = `${asset}/${base}`;
}
async getData(){
//@ts-ignore
const ohlcv=await this.client.fetchOHLCV(this.market,this.interval);
const timestamps ={}
//@ts-ignore
const filtered=ohlcv.filter((x,i)=>{
const timestamp=x[0];
const str = `${timestamp}`;
//@ts-ignore
  if(timestamps[str]!==undefined){return false}
//@ts-ignore
timestamps[str]=true
return true
})
//@ts-ignore
return filtered
}
}

 