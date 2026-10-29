const mongoose = require('mongoose')

const planetSchema = new mongoose.Schema({
    name:{
        type:String
    },
    inSolarSystem:{
        type: Boolean
    }
},{timestamps: true})

const Planet = mongoose.model('Planet', planetSchema)

module.exports = Planet