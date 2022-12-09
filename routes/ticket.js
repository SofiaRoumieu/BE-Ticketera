const express = require('express')
const router = express.Router()
const TicketController = require('../controllers/ticket.controller');

router.get('/', TicketController.findAll);

router.get('/listarDesperfectos', TicketController.listarDesperfectos);

router.get('/cantTicketsSinResolverLoc', TicketController.cantTicketsSinResolverLoc);

router.get('/operacSopTecLanBanAvell', TicketController.operacSopTecLanBanAvell);

router.get('/ticketsZona1', TicketController.ticketsZona1);

router.get('/ticketsCombateDeLosPozos', TicketController.ticketsCombateDeLosPozos);

router.get('/ticketsBanfieldLanus', TicketController.ticketsBanfieldLanus);

router.get('/todosMenosBanfieldLanus', TicketController.todosMenosBanfieldLanus);

module.exports = router