const Router = require('express').Router();
const SignosController = require('../controllers/signos');

Router.get("/", SignosController.getSignos);
Router.post("/create", SignosController.createSignos);

module.exports = Router;