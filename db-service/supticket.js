const mongoose = require("mongoose")

const SupTicketSchema = new mongoose.Schema({
    UserID: Number, // айди из телеги
    ResponderId: {type: Number, default: null}, // айди из телеги
    Text: String,
    Answer: {type: String, default: null},
    Date: {type: Date, default: Date.now()},
    Closed: {type: Boolean, default: false}
})

module.exports = mongoose.model("SupTicket", SupTicketSchema)