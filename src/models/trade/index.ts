export class Trade{
  //@ts-ignore
constructor(order){
console.log('Creating Trade Object ' , order.id)
//@ts-ignore
    this.id=order.id;this.price=order.price;this.datetime=order.datetime;
  //@ts-ignore
  this.amount=order.amount;this.status=order.status;this.side=order.side
}
}
class trades{
private _trades=[];
//@ts-ignore
removeTrade(id){
  const validate=this.GetTradeWithId(id)   
  if(!validate){console.log('trade does not exist in tradelist ');return}
  //@ts-ignore
  this._trades = this._trades.filter((td)=>{
//@ts-ignore
if(td.id !== id){ return td}})
return new Promise((resolve,reject)=>{ 
  console.log('Trade Deleted...');resolve('true')
  });
}

tradesNotEmpty(){
if(this._trades.length !== 0 ){return true}
return false;
}

//@ts-ignore
addTrade({trade}){
const validate=this.GetTradeWithId(trade.id)
if(validate){console.log('duplicate trade ');return}
  //@ts-ignore
  this._trades.push(trade)
  return new Promise((resolve,reject)=>{     
    console.log('New Trade Added...');resolve('true')
    });
}

GetTrade(){
if(this._trades.length === 0){
console.log('No trades ');return null};return this._trades 
}

GetTradeWithId(id:any){
  let trade=null
  if(this._trades.length !== 0 ){    
     trade = this._trades.map((fobj)=>{
      //@ts-ignore
       if (fobj.id === id) {
        //@ts-ignore
        return fobj;
       }
      })
  }  
  return trade ;
}

}
export const  Trades= new trades();