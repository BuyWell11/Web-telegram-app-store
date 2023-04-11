const mongoose = require("mongoose")

const AppSchema = new mongoose.Schema({
    OwnerID: Number,// айди из телеги
    Name: String,
    Description: String,
    Version: String,
    Downloads: {type: Number, default: 0},
    ReleasDate: {type: Date, default: Date.now()},
    ApkFile: String,
    Icon: String,
    Link: {type: String, default: null},
    Reviews: {type: Array, default: []},
    OnMarket: {type: Boolean, default: false},
    LastUpdate: {type: Date, default: Date.now()}
})

module.exports = mongoose.model("App", AppSchema)