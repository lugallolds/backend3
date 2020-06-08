const Paciente = require("../models/pacientes");
const mongoose = require('mongoose');

const createPaciente = (req, res) => {
    try {        
        console.log(req.body);
        const props = req.body;
        const newPaciente = new Paciente(props);
        newPaciente.fullName = `${newPaciente.firstName} ${newPaciente.lastName}`;

        //guardar el paciente en la base de datos
        newPaciente.save()
        .then((paciente) => {
            res.json(paciente);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

//funcion para traer pacientes con filtro
const getPacientes = (req, res) => {
    try {
        const props = req.query;

        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.fullName) {
            props.fullName = RegExp(props.fullName, "i");
        }
        Paciente.find(props)
        .exec()
        .then((paciente) => {
            res.json(paciente);
            console.log('pac', paciente);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

//actualizar paciente
const updatePaciente = (req, res) => {
    try {

        const props = req.body;
        console.log('pac mod', props);        
        props.fullName = `${props.firstName} ${props.lastName}`;
        Paciente.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
        .exec()
        .then((paciente) => {
            res.json(paciente);
            console.log('pac mod', paciente);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}


module.exports = {
    createPaciente,
    getPacientes,
    updatePaciente
}