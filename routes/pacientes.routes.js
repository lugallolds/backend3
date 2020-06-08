const Router = require('express').Router();
const PacienteController = require('../controllers/pacientes');

Router.get("/", PacienteController.getPacientes); 
Router.post("/create", PacienteController.createPaciente);
Router.put("/", PacienteController.updatePaciente);

module.exports = Router;