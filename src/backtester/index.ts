import {HistoricalService} from '../classes/historical';
import { Simple } from '../classes/strategy/simple';
import {CandleStick} from '../models/candlestick';


export class backtester{
//@ts-ignore
constructor({start,end,interval,market}){
//@ts-ignore
this.start=start;this.end=end;this.interval=interval;this.market=market;
//@ts-ignore
this.service=new HistoricalService(start,end,interval)
}

async startnow(){
try{
  //@ts-ignore
const history = await this.service.getData();
 //@ts-ignore
const int=this.interval;
 //@ts-ignore
const candlesticks = history.map((f)=>{
  //@ts-ignore
  return new CandleStick({
    startTime:(new Date(f[0] )),
    low:f[1],
    high:f[2],
    open:f[3],
    close:f[4],
    interval:int,
    volume:f[5]
  })
  })
//@ts-ignore
}catch(err){console.log(err)}
}

}

module.exports = backtester