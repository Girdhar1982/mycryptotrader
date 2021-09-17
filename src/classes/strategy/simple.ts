
import {Strategy} from './strategy'
export class Simple extends Strategy{
  //@ts-ignore
  async run({sticks,time}){
  const len = sticks.length 
  if(len < 20 ){return}

 const last = sticks[len-1]
 const penu = sticks[len-2]
 const price = last.close()
const open = this.openPositions()
if(open.length == 0) {


 if(last < penu ){
     //@ts-ignore
this.onBuySignal({price})
 }

}else{
if(last > penu ){
//@ts-ignore
open.foreach((p)=>this.onSellSignal({price,size:p.enter.size}))

}

}



  }
 

}