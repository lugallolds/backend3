const mongoose = require("mongoose");

const pacienteSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'Nombre es requerido'] },
    lastName: { type: String , required: [true, 'Apellido es requerido'] },
    identidad: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: ["m", "f"] },
    dateBirth: { type: Date }, 
    rhType: { type: String },
    maritalStatus: { type: String },
    aseguradora: { type: String },
    poliza: { type: String },
    certificado: { type: String },
    empresa: { type: String },
 
    fullName: String,
    enabled: { type: Boolean, default: true },
    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },
    
}, { timestamps: true });

const Paciente = mongoose.model("Paciente", pacienteSchema);

module.exports = Paciente;