import express from 'express';
import helmet from  'helmet';
import {json } from 'body-parser';
import 'express-async-errors';  
import cookieSession from 'cookie-session';
import {receiveAlert} from './routes/index';
//import {createSlotRouter} from './routes/new'; 
const app = express();
app.use(helmet());
app.set('trust proxy',true); //because traffic is being proxied in our case through ingix 
                            //-- proxied https connection wont be supported if not trusted
app.use(json());
app.use(cookieSession({
signed:false, 
secure: process.env.NODE_ENV !== 'test' 
}));

app.use(receiveAlert);
//signed false doesn't let cookie to encrypt
//secure:true makes sure connection is https
//app.use(createSlotRouter);
app.all('*',(req)=>{console.log('Path not found');
console.log(req.originalUrl)}
);
//app.use(errorHandler);
export{app};