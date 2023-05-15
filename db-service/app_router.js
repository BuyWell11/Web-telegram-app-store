const express = require('express');
const User = require('./user');
const App = require('./app');
require('dotenv').config({path:__dirname+'/.env'})
const router = express.Router();

//в качестве реквеста передаётся айди в json body.id
router.get('/', async (req, res) => {
    let app = await App.findById(req.body.id)
    res.status(200).json(app)
});

//ничего не передаётся
router.get('/all', async (req, res) => {
    let apps = await App.find({OnMarket: true})
    if(apps.length == 0){
        res.status(200).json({err: "No apps"})
    }
    else{
        res.status(200).json(apps)
    }
});

//ничего не передаётся
router.get('/datesorted', async (req, res) => {
    let apps = await App.find({OnMarket: true}).sort({ReleasDate: -1})
    if(apps.length == 0){
        res.status(200).json({err: "No apps"})
    }
    else{
        res.status(200).json(apps)
    }
});

//ничего не передаётся
router.get('/downloadsorted', async (req, res) => {
    let apps = await App.find({OnMarket: true}).sort({Downloads: -1})
    if(apps.length == 0){
        res.status(200).json({err: "No apps"})
    }
    else{
        res.status(200).json(apps)
    }
});

//передаётся имя приложения в json body.name
router.get('/checkname', async (req, res) => {
    let app = await App.find({Name: req.body.name})
    if(!app.length == 0){
        res.status(200).json({err: "The name is already in use"})
    }
    else{
        res.status(200).json(app)
    }
});

//ничего не передаётся
router.get('/notonmarket', async (req, res) => {
    let apps = await App.find({OnMarket: false}).sort({ReleasDate: -1})
    if(apps.length == 0){
        res.status(200).json({err: "No not released apps"})
    }
    else{
        res.status(200).json(apps[0])
    }
});

//передаётся объект класса из class_templates.js в качестве json объекта
router.post('/', async (req, res) => {
    let app = await App.create(req.body)
    res.status(201).json(app)
});

//передаётся айди в виде json body.id и объект класса из class_templates.js в виде json body.app
router.post('/update', async (req, res) => {
    let app_id = await App.findById(req.body.id)._id
    let app = await App.findOneAndUpdate({_id: app_id}, req.body.app)
    res.status(200).json(app)
});

//в качестве реквеста передаётся айди в json body.id и объект класса из class_templates.js в виде json body.review
router.post('/review', async (req, res) => {
    let app = await App.findById(req.body.id)
    let in_review = false
    for (let review in app.Reviews){
        if (review.Username == req.body.review.Username){
            in_review = true
            break
        }
    }
    if(in_review){
        res.status(200).json({err: "Already have review"})
    }
    else{
        app.Reviews.push(req.body.review)
        await app.save()
        res.status(201).json(app)
    }
});

//в качестве реквеста передаётся айди в json body.id и ссылка в body.link
router.post('/link', async (req, res) => {
    let app = await App.findOne(req.body);
    app.Link = process.env.WEB_LINK + '/' + app.Name.replace(' ', '');
    app.OnMarket = !app.OnMarket
    await app.save()
    res.status(201).json(app)
});

//в качестве реквеста передаётся айди в json body.id
router.delete('/', async (req, res) => {
    let app = await App.findById(req.body.id)
    let user = await User.findOne({Tgid: app.OwnerID})
    let app_index = user.OwnApps.indexOf(app._id)
    user.OwnApps.splice(app_index, app_index)
    await user.save()
    await App.findOneAndDelete(req.body)
    res.status(200).json(app)
});

router.delete('/norelease', async (req, res) => {
    let app = await App.findOneAndDelete(req.body)
    res.status(200).json(app)
});

module.exports = router;