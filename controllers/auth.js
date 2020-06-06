const passport = require("../utils/passport");
const moment = require("moment-timezone");
const User = require("../models/usuarios");
const mongoose = require("mongoose");
const randtoken = require("rand-token");
const path = require("path");
const fs = require("fs");
const Tokens = require('../models/tokens');
const _ = require('lodash');
// const fsPromises = fs.promises;
// const config = require("../config")
// const client = require ("twilio")(config.accountID, config.authToken)



const login = (req, res, next) => {
  try {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(403).json({ error: true, message: err });
      }

      if (!user) {
        return res.status(401).json(info);
      }

      if (user.auth && user.auth.token) {
        new Tokens({ token: user.auth.token, refreshToken: user.auth.refreshToken, user: user._id }).save();
      }
      user.auth = {
        ...user.auth,
        token: user.generateJwt(user),
        refreshToken: randtoken.uid(256),
        exp: moment()
          .add(2, "days")
          .toDate()
      };
      user
        .save()
        .then(savedUser => {
          const user_ = { ...savedUser.toJSON() };
          delete user_.hash;
          delete user_.salt;
          delete user_.password;

          res.json(user_);
        })
        .catch(err => {
          return res
            .status(403)
            .json({ error: true, message: err.message || err });
        });
    })(req, res, next);
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

//DOBLE FACTOR DE AUTENTICACION
//funcion para realizar el envio de codigo de verificación a un numero del Celular
const dfa = (req , res, next) => {
  console.log('Hola es Prueba', req.body.celular);
  client
        .verify
        .services(config.serviceID)
        .verifications
        .create({
          to: `+${req.body.celular}`,   //req.query.celular,
           channel:'sms' //req.query.channel
        })
        .then ((data) => {
         res.status(200).send(data)

        })
      };
  

const verificarSms = (req, res) =>{
  //recibimos la verificacion del codigo
  console.log('Hola es Prueba', req.query.codigo);
  client
        .verify
        .services(config.serviceID)
        .verificationChecks
        .create({
          to: `+${req.query.celular}`,   //req.query.celular,
          code : req.query.codigo
          // channel: req.body.codigo
          
        })
        .then ((data)=> {
          res.status (200).send(data)
        })

};


// CREACION DE USUARIOS
const createUser = (req, res, next) => {
  try {
    const params = req.body;
    const user = new User(params);
    const token = user.generateJwt(user);
    const credentials = user.setPassword(user.password);
    user.auth = {
      token: token,
      refreshToken: randtoken.uid(256),
      exp: moment()
        .add(2, "days")
        .toDate()
    };
    user
      .save()
      .then(savedUser => {
        const user_ = { ...savedUser.toJSON() };
        delete user_.hash;
        delete user_.salt;
        delete user_.password;

        res.json(user_);
      })
      .catch(err => res.status(403).json({ err: err.toString() }));
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

// FUNCIONES SALIR
const logout = (req, res, next) => {
  try {
    const params = req.body;
    const user = req.payload && req.payload.user ? req.payload.user : undefined;

    User.findOne(
      { 'auth.refreshToken': params.refreshToken }
    ).exec()
    .then(user => {
      if(!user) {
        return Promise.resolve(true);
      }
        new Tokens({
          token: user.auth.token,
          refreshToken: user.auth.refreshToken,
          user: user._id
        }).save()
      return User.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(user._id) },
          { $set: { auth: {} } }
        ).exec();
      })
      .then((result) => {
        res.json({ logout: true });
      })
      .catch(err => {
        res.status(403).json({ logout: false, error: err.toString() });
      });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

// RENOVAR EL TOKEN DE SESION
const refreshToken = (req, res, next) => {
  try {
    if (!req.body.refreshToken) {
      return res.status(403).json({ error: "refreshToken is required" });
    }
    const refreshToken = req.body.refreshToken;
    User.findOne({ "auth.refreshToken": refreshToken })
      .exec()
      .then(user => {
        if (!user) {
          throw Error("invalid refreshtoken");
        }
        const token = user.generateJwt(user);
        const refreshToken = randtoken.uid(256);
        user.auth = {
          token: token,
          refreshToken: refreshToken,
          exp: moment()
            .add(2, "days")
            .toDate()
        };
        return user.save();
      })
      .then(userWithNewToken => {
        const user_ = { ...userWithNewToken.toJSON() };
        delete user_.hash;
        delete user_.salt;
        delete user_.password;
        res.json(user_);
      })
      .catch(err => {
        res.status(401).json({ error: true, message: err.message || err });
      });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};


module.exports = {
  login,
  createUser,
  logout,
  refreshToken,
  dfa,
  verificarSms,
};
