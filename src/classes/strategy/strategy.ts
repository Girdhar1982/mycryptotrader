import { Trade } from "../../models/trade";
import { Position } from "../../models/position";
export class Strategy{
  //@ts-ignore
constructor({ onBuySignal,onSellSignal} ) {
  //@ts-ignore
  this.onBuySignal=onBuySignal,this.onSellSignal=onSellSignal;
  //@ts-ignore
  this.positions=[]
}

 //@ts-ignore
async run ({sticks,time}){}


 //@ts-ignore
openPositions(){return this.positions.filter((x)=>{ x.state === 'opem'  }) }



 //@ts-ignore
async positionOpened({price,time,amount,id}){
  //@ts-ignore
 const trade=new Trade({price,time,amount});
   //@ts-ignore
const position = new Position({trade,id});this.positions[id]=position;
}

 //@ts-ignore
async positionClosed({price,time,amount,id}){
  //@ts-ignore
  const trade=new Trade({price,time,amount});  const position = this.positions[id];
  
    //@ts-ignore
  if(position){position.close({trade}) }
  
 
}

}
 