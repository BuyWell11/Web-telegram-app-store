const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const superagent = require('superagent');
const texts_template = require('./texts')
let class_templates = require('./class_templates')
require('dotenv').config({path:__dirname+'/.env'})

const link = 'http://localhost:3000'


const bot = new Telegraf(process.env.BOT_TOKEN);

let isAdmin = false
let isMod = false


bot.start(async (ctx) => {
    let user = await new class_templates.User(ctx.chat.id, ctx.chat.username)
    try {
        const res = await superagent.post(link+'/user').send(user)
        console.log(res.body);
    } catch (err) {
        console.error(err);
    }
    if(!isAdmin){
        ctx.reply(texts_template.welcome_msg_for_user)
    }
});

bot.help((ctx) => {
    if(!isAdmin){
        ctx.reply(texts_template.help_msg_for_user)
    }
});

bot.command('myapps', async (ctx) => {
    let apps;
    try {
        const res = await superagent.get(link+'/user').send({Tgid: ctx.chat.id})
        console.log(res.body);
    } catch (err) {
        console.error(err);
    }
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
