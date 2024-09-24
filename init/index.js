const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main().then(()=>{
    console.log('Connection Established');
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
async function initDB(){
await Listing.deleteMany({});
initData.data = initData.data.map((obj)=>({
    ...obj,owner : "66dde0de6da687083ab25457"
}));
await Listing.insertMany(initData.data).then(()=>{
console.log('Data Inserted');
});
}

initDB();
