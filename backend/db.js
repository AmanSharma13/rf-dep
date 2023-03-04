const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/foodapi'

const connectToMongo = () =>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to mongodb succesfully")
    })
}


module.exports = connectToMongo;