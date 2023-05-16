const { Telegraf, session, Scenes: {WizardScene, Stage}, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
const fs = require('fs');
const superagent = require('superagent');
const texts_template = require('./texts')
let class_templates = require('./class_templates')
const path = require('path');
require('dotenv').config({path:__dirname+'/.env'})

const link = process.env.LINK || 'http://localhost:3000'

const bot = new Telegraf(process.env.BOT_TOKEN);

const nameHandler = Telegraf.on(message('text'), async (ctx) => {
    console.log(ctx.message.text)
    let res = null;
    try {
        res = await superagent.get(link+'/app/checkname').send({name: ctx.message.text})
        console.log(res.body);
    } catch (err) {
        console.log(err);
        ctx.scene.leave();
    }
    if(res.body.hasOwnProperty('err')){
        ctx.sendMessage("Извини, но это имя занято.\nПридумай другое.", Markup.removeKeyboard());
        ctx.scene.leave();
    }
    ctx.scene.state.name = ctx.message.text;
    ctx.sendMessage('Теперь напиши описание своего приложения.');
    return ctx.wizard.next()
});

const descriptionHandler = Telegraf.on(message('text'), async (ctx) => {
    ctx.scene.state.desc = ctx.message.text;
    ctx.sendMessage('Отправь иконку приложения');
    ctx.wizard.next()
});

const iconHandler = Telegraf.on(message('photo'), async (ctx) => {
    let link = null;
    try {
        link = await bot.telegram.getFileLink(ctx.message.photo[0].file_id);
    } catch (err) {
        console.log(err);
        return;
    }
    ctx.scene.state.icon = link.href;
    ctx.sendMessage('Отправь apk файл своего приложения.')
    return ctx.wizard.next()
});

const apkFileHandler = Telegraf.on(message('document'), async (ctx) => {
    let link = null;
    try{
        link = await bot.telegram.getFileLink(ctx.message.document.file_id);
    }
    catch(err){
        ctx.reply('err ' + err.description);
        return;
    }
    ctx.scene.state.apk = link.href;
    ctx.sendMessage('Отправь версию приложения.')
    return ctx.wizard.next()
});

const versionHandler = Telegraf.on(message('text'), async (ctx) => {
    ctx.scene.state.vers = ctx.message.text;
    let app = new class_templates.App(ctx.chat.id, ctx.scene.state.name, ctx.scene.state.desc, ctx.scene.state.vers, ctx.scene.state.apk, ctx.scene.state.icon);
    try {
        res = await superagent.post(link+'/app').send(app)
        console.log(res.body);
    } catch (err) {
        console.log(err);
        ctx.scene.leave();
    }
    ctx.sendMessage('Ваше приложение отправлено на обработку.\nОтвет будет ближайшее время.', Markup.removeKeyboard());
    return ctx.scene.leave()
});

const checkApp = Telegraf.on(message('text'), async (ctx) => {
    if(ctx.message.text == 'approve'){
        let check = await superagent.post(link+'/user/ownapps').send(ctx.scene.state.app)
        console.log(check.body)
        check = await superagent.post(link+'/app/link').send(ctx.scene.state.app)
        console.log(check.body)
        await bot.telegram.sendMessage(ctx.scene.state.app.OwnerID, `Ваше приложение ${ctx.scene.state.app.Name} одобрено.`)
        await ctx.sendMessage('Спасибо за работу!', Markup.removeKeyboard())
        return ctx.scene.leave()
    }
    else if(ctx.message.text == 'disapprove'){
        await ctx.sendMessage('Напиши причину, почему приложение не может быть опубликовано.')
        await superagent.delete(link+'/app/norelease').send(ctx.scene.state.app)
        return ctx.wizard.next()
    }
})

const notApprove = Telegraf.on(message('text'), async (ctx) => {
    let reason = ctx.message.text;
    await bot.telegram.sendMessage(ctx.scene.state.app.OwnerID, `Ваше приложение ${ctx.scene.state.app.Name} не было опубликовано.\nПричина: ${reason}`)
    await ctx.sendMessage('Спасибо за работу!', Markup.removeKeyboard())
    return ctx.scene.leave()
})

const cancelMarkup = Markup.keyboard(['отмена']).oneTime()

const appUploadScene = new WizardScene('appUploadScene', nameHandler, descriptionHandler, iconHandler, apkFileHandler, versionHandler)
appUploadScene.enter(async (ctx) => ctx.sendMessage('Придумай название приложения', cancelMarkup))
const appApprove = new WizardScene('appApprove', checkApp, notApprove)
appApprove.enter(async (ctx) => ctx.sendMessage('Внимательно изучи приложение и если всё хорошо, то напиши "approve", иначе "disapprove"', cancelMarkup))

const stage = new Stage([appUploadScene, appApprove])

stage.hears('отмена', async (ctx) => {
    ctx.sendMessage('Отменил', Markup.removeKeyboard())
    ctx.scene.leave()
})

bot.use(session(), stage.middleware())

bot.start(async (ctx) => {
    let user = new class_templates.User(ctx.chat.id, ctx.chat.username, true, true)
    try {
        const res = await superagent.post(link+'/user').send(user)
        console.log(res.body);
    } catch (err) {
        console.error(err);
    }
    ctx.reply(texts_template.welcome_msg_for_user)
});

bot.help((ctx) => {
    ctx.reply(texts_template.help_msg_for_user)
});

bot.command('deleteme', async (ctx) => {
    try {
        await superagent.delete(link+'/user').send({id: ctx.chat.id})
    } catch (err) {
        console.error(err);
    }
})

bot.command('myapps', async (ctx, next) => {
    let app_ids;
    let apps;
    let inline_keyboard;
    try {
        const res = await superagent.get(link+'/user').send({id: ctx.chat.id})
        if(res.body.OwnApps.lenght == 0){
            ctx.sendMessage('У вас нет приложений.');
            return;
        }
        app_ids = res.body.OwnApps;
        [inline_keyboard, apps] = await makeInlineKeyboard(app_ids)
        ctx.state.apps = apps;
        bot.telegram.sendMessage(ctx.chat.id, 'Ваши приложения',
        {
            reply_markup: {
                inline_keyboard: inline_keyboard
            }
        })
    } catch (err) {
        console.error(err);
    }
});

bot.command('followlist', async (ctx) => {
    try {
        const res = await superagent.get(link+'/user').send({Tgid: ctx.chat.id})
        if(res.body.FollowApps.lenght == 0){
            ctx.sendMessage('У вас нет зафоловленных приложений.');
            return;
        }
        let apps = [];
        for(let app of res.body.FollowApps){
            let app = await superagent.get(link+'/app').send({id: app_ids[i].toString()});
            apps.push(app.body.Name);
        }
        ctx.sendMessage('Зафоловленные приложения:\n'+apps.join('\n'))
    } catch (err) {
        console.error(err);
    }
});

bot.command('newapp', async (ctx) => {
    ctx.scene.enter('appUploadScene')
});

bot.command('deleteapp', async (ctx) => {
    try {
        const res = await superagent.get(link+'/user').send({Tgid: ctx.chat.id})
        console.log(res.body);
    } catch (err) {
        console.error(err);
    }
});

bot.command('getwork', async (ctx) => {
    let user = await superagent.get(link+'/user').send({id: ctx.chat.id})
    console.log(user.body)
    if(!user.body.Admin || !user.body.Mod){
        return;
    }
    try {
        const res = await superagent.get(link+'/app/notonmarket').send()
        console.log(res.body)
        if(res.body.hasOwnProperty('err')){
            ctx.sendMessage(res.body.err);
            return;
        }
        let icon_link = res.body.Icon
        let app_link = res.body.Icon
        await downloadFile(icon_link, '/icon.png')
        await downloadFile(app_link, '/app.apk')
        ctx.scene.enter('appApprove')
        await ctx.sendMessage(`Name: ${res.body.Name}\nDescription: ${res.body.Description}`)
        await bot.telegram.sendPhoto(ctx.chat.id,{source: 'icon.png'})
        await bot.telegram.sendDocument(ctx.chat.id, {source: 'app.apk'})
        fs.unlinkSync('icon.png')
        fs.unlinkSync('app.apk')
        ctx.scene.state.app = res.body
    } catch (err) {
        console.error(err);
    }
});

bot.launch();



async function downloadFile(link, path){
    let download = superagent.get(link).send()
    let fileWriter = fs.createWriteStream(__dirname + path)
    download.pipe(fileWriter)
    await delay(1000)
}

function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

async function makeInlineKeyboard(app_ids){
    let inline_keyboard = [[]];
    let apps = new Array();
    let temp_arr = new Array();
    let count = Math.ceil(app_ids.length/3);
    for(let i = 0; i < app_ids.length; i++){
        let app = await superagent.get(link+'/app').send({id: app_ids[i].toString()});
        temp_arr.push({text: app.body.Name, url: app.body.Link});
        apps.push(app.body)
    }
    for(let i = 0; i < count; i++){
        let count = 0;
        for(let j = 0; j < temp_arr.length; j++){
            if(count == 2){
                count = 0;
            }
            inline_keyboard[i].push(temp_arr[j]);
            count++;
        }
    }
    return [inline_keyboard, apps];
}
