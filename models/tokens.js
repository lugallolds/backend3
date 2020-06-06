const mongoose = require("mongoose");

const TokensSchema = new mongoose.Schema({
    token: String,
    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },
    refreshToken: String
}, { timestamps: true});

const Tokens = mongoose.model("Token", TokensSchema);

module.exports = Tokens;