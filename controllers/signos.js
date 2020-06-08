const Signos = require("../models/signos");
const mongoose = require('mongoose');

const createSignos = (req, res) => {
    try {        
        console.log(req.body);
        const props = req.body;
        const newSignos = new Signos(props);
    
        //guardar el Signos en la base de datos
        newSignos.save()
        .then((signos) => {
            res.json(signos);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

//funcion para traer Signos con filtro
const getSignos = (req, res) => {
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
        Signos.find(props)
        .exec()
        .then((signos) => {
            res.json(signos);  
            console.log('signo: ', signos);      
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

module.exports = {
    createSignos,
    getSignos
}