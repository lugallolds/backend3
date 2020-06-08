const mongoose = require("mongoose");

const historialSchema = new mongoose.Schema({
    paciente: { type: mongoose.Types.ObjectId, ref: 'Paciente' },
    consulta: { type: String },    
    motivoConsulta: { type: String },
    historiaActual: { type: String },
    antePerPato: { type: String },
    antePerFam: { type: String },
    anteInmu: { type: String }, 
    anteHosTrauQui: { type: String },
    anteGineObs: { type: String },

    apariencia: { type: String },
    cabeza: { type: String },
    bocaFaringe: { type: String },
    cuello: { type: String },
    mamas: { type: String },
    corazon: { type: String },
    pulmones: { type: String }, 
    abdomen: { type: String },
    genitales: { type: String },
    extremidades: { type: String },
    examenes: { type: String },
    diagnostico1: { type: String },
    diagnostico2: { type: String },
    plan: { type: String },
    color: { type: String },
    comentario: { type: String },

    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },
    
}, { timestamps: true });

const Historial = mongoose.model("Historial", historialSchema);

module.exports = Historial;