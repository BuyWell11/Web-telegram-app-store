const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const { Stage } = require("telegraf/stage")
const texts_template = require('./texts')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);

let isAdmin = false
let isMod = false

bot.start((ctx) => {
    console.log(ctx.chat)
    if(!isAdmin){
        ctx.reply(texts_template.welcome_msg_for_user)
    }
});

bot.help((ctx) => {
    if(!isAdmin){
        ctx.reply(texts_template.help_msg_for_user)
    }
});

bot.command('myapps', (ctx) => {
    
})

bot.on(message('document'), async (ctx) => {
    try{
        console.log(ctx.message.document)
        let link_for_download = await bot.telegram.getFileLink(ctx.message.document.file_id)
        ctx.reply('link ' + link_for_download)
    }
    catch(err){
        ctx.reply('err ' + err.description)
    }
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
