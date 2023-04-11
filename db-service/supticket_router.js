const express = require('express');
const SupTicket = require('./supticket');
const router = express.Router();

//ничего не передаётся
router.get('/', async (req, res) => {
    let sup_tickets = await SupTicket.find().sort({Date: 1})
    if(apps.length() == 0){
        res.status(200).json({Error: "No sup tickets"})
    }
    else{
        res.status(200).json(sup_tickets[0])
    }
});

//передаётся объект класса из class_templates.js в качестве json объекта
router.post('/', async (req, res) => {
    let sup_ticket = await SupTicket.create(req.body)
    res.status(201).json(sup_ticket)
});

//передаётся айди в виде json body.id и ответ в виде body.answer
router.put('/answer', async (req, res) => {
    let sup_ticket = await SupTicket.findById(req.body.id)
    sup_ticket.Answer = req.body.answer
    sup_ticket.Closed = true
    await sup_ticket.save()
    res.status(200).json(sup_ticket)
})



module.exports = router;