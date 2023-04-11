const express = require('express');
const User = require('./user');
const App = require('./app');
const router = express.Router();

//передаётся айди телеграмма в body.id
router.get('/', async (req, res) => {
  let user = await User.findOne({Tgid: req.body.id})
  console.log(user)
  res.status(200).json(user)
});

//передаётся объект класса из class_templates.js в виде объекта json
router.post('/', async (req, res) => {
  let user = await User.findOne({Tgid: req.body.Tgid})
  if(user != null){
    console.log(user)
    res.status(200).json({Error: "Already exist"})
  }
  else{
    user = await User.create(req.body)
    console.log(user)
    res.status(201).json(user)
  }
});

//добавляет в приложение в приложения пользователя после того как его(приложение) одобрила модерация и обновляет статус приложения
//в качестве реквеста передаётся объект класса из class_templates.js в виде объекта json
router.post('/ownapps', async (req, res) => {
  let user = await User.findById(req.body.OwnerID)
  let app = await App.findOne(req.body)
  app.OnMarket == true
  await app.save()
  user.OwnApps.push(app._id)
  await user.save
  res.status(201).json({user: user, app: app})
});

//передаётся айди приложения в json body.app_id и телеграмм айди юзера в json body.user_id
router.post('/followapp', async (req, res) => {
  let user = await User.findOne({Tgid: req.body.user_id})
  let app = await App.findById(req.body.app_id)
  user.FollowApps.push(app._id)
  await user.save
  res.status(201).json(user)
});

//передаётся айди приложения в json body.app_id и телеграмм айди юзера в json body.user_id
router.delete('/followapp', async (req, res) => {
  let user = await User.findOne({Tgid: req.body.user_id})
  let app = await App.findById(req.body.app_id)
  let app_index = user.FollowApps.indexOf(app._id)
  user.FollowApps.splice(app_index, app_index)
  await user.save
  res.status(200).json(user)
});

module.exports = router;