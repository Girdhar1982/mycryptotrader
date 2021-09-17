export class Position{
  //@ts-ignore
constructor(order){
//@ts-ignore
//@ts-ignore
this.id=order.id;this.price=order.price;this.datetime=order.datetime;
//@ts-ignore
this.amount=order.amount;this.status=order.status;this.side=order.side
} 
}

export class positions{
private _postions=[];
//@ts-ignore
addPosition(position){
  const validate=this.GetPositionWithId(position.id)
  if(validate){console.log('Position already present in the List ');return}
    //@ts-ignore
    this._postions.push(position)
    return new Promise((resolve,reject)=>{     
      console.log('New Position Added...');resolve('true')
      });
  }

  GetPositionWithId(id:any){
    let position=null
    if(this._postions.length !== 0 ){    
       position = this._postions.map((fobj)=>{
        //@ts-ignore
         if (fobj.id === id) {
          //@ts-ignore
          return fobj;
         }
        })
    }  
    return position ;
  }
  

  positionsNotEmpty(){
    if(this._postions.length !== 0 ){return true}
    return false;
    }


  GetPosition(){
    if(this._postions.length === 0){console.log('No trades ');return null};
    return this._postions ;
    }


}
export const Positions= new positions();