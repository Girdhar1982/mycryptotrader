'use strict'
if(process.env.Node_ENV==='production'){
module.exports = {
apiKey: process.env.API_KEY,
apiSecret:process.env.API_SECRET
}
}else{
  module.exports = require('./develop.json');
}