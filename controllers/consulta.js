const Consulta = require("../models/consulta.js");
const mongoose = require('mongoose');

const createConsulta = (req, res) => {
    try {        
        console.log(req.body);
        const props = req.body;
        const newConsulta = new Consulta(props);
    
        //guardar el Consulta en la base de datos
        newConsulta.save()
        .then((consulta) => {
            res.json(consulta);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

//funcion para traer Consulta con filtro
const getConsulta = (req, res) => {
    try {
        console.log('req', req.query._id);
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.paciente) {
            props.paciente = mongoose.Types.ObjectId(props.paciente);
        }
        // if (props.nombre) {
        //     props.nombre = RegExp(props.nombre, "i");
        // }
        Consulta.find(props)
        .exec()
        .then((consulta) => {
            res.json(consulta);        
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

module.exports = {
    createConsulta,
    getConsulta
}