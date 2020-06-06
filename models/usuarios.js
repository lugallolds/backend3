const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const crypto = require('crypto');
const path = require('path');
// const fs = require('fs');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');

const usuarioSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'Nombre es requerido'] },
    lastName: { type: String , required: [true, 'Apellido es requerido'] },
    email: { type: String },
    phone: { type: String },
    gender: { type: String, enum: ["m", "f"] },
    refreshToken: String,
    hash: String,
    salt: String,
    username: { type: String, unique: true, required: [true, 'username es requerido'] },
    password: String,
    fullName: String,
    enabled: { type: Boolean, default: true },
    roles:   { type: String, enum: ['medico', 'enfermera', 'laboratorio', 'administrador']},
    auth: {
        token: String,
        exp: Date,
        refreshToken: String
    },
    
}, { timestamps: true });



usuarioSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha1").toString("hex");
    return this;
};


usuarioSchema.pre("save", function save(next) {
    const usuario = this;
    if (usuario.isModified("firstName") || usuario.isModified("lastName")) {
        usuario.fullName = `${usuario.firstName} ${usuario.lastName}`;
    }
    if (!usuario.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(usuario.password, salt, undefined, (err, hash) => {
            if (err) { return next(err); }
            usuario.password = hash;
            next();
        });
    });
});

usuarioSchema.methods.isValidPassword = function (password, cb) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha1").toString("hex");
    cb(undefined, hash === this.hash);
};

usuarioSchema.methods.generateJwt = (usuarioModel) => {
    const usuario = usuarioModel.toJSON();
    delete usuario.password;
    delete usuario.hash;
    delete usuario.salt;
    const usuario_ = {
        _id: usuario._id.toString(),
        username: usuario.username,
        celular: usuario.celular
    };
    const privateKey = "GALLO$ANGULARJS";
    return jwt.sign({ usuario: usuario_ }, privateKey, { expiresIn: "2d" });
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;