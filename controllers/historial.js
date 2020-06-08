const Historial = require("../models/historial.js");
const mongoose = require('mongoose');

const createHistorial = (req, res) => {
    try {        
        console.log(req.body);
        const props = req.body;
        const newHistorial = new Historial(props);
    
        //guardar el Historial en la base de datos
        newHistorial.save()
        .then((historial) => {
            res.json(historial);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

//funcion para traer Historial con filtro
const getHistorial = (req, res) => {
    try {
        console.log('req', req.query._id);
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        // if (props.nombre) {
        //     props.nombre = RegExp(props.nombre, "i");
        // }
        Historial.find(props)
        .exec()
        .then((historial) => {
            res.json(historial);        
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

//actualizar paciente
const updateHistorial = (req, res) => {
    try {

        const props = req.body;
        // console.log('pac mod', props);        
        Historial.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
        .exec()
        .then((historial) => {
            res.json(historial);
            console.log('pac mod', historial);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

module.exports = {
    createHistorial,
    getHistorial,
    updateHistorial
}