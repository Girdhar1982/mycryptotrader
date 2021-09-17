export class CandleStick{
  //@ts-ignore
constructor({low,high,close,open,volume,interval,startTime=new Date()}){
    //@ts-ignore
this.startTime=startTime;this.interval=interval;
  //@ts-ignore
  this.low=low;this.high=high;this.close=close;this.open=open;this.volume=volume
}
average(){
  //@ts-ignore
  return ( parseFloat(this.close) + parseFloat(this.high) + parseFloat(this.low) ) / 3 
}

}