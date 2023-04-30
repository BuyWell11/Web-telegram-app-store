const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    Tgid: Number,
    TelegramUserName: String,
    Mod: {type: Boolean, default: false},
    Admin: {type: Boolean, default: false},
    FollowApps: {type: Array, default: []},
    OwnApps: {type: Array, default: []}
})

module.exports = mongoose.model("User", UserSchema)