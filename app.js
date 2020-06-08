var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/usuarios');
const mongoose = require("mongoose");
const jwt = require('express-jwt');
const cors = require("cors");
const Tokens = require("./models/tokens");
const moment = require('moment-timezone');


// const config = require("./config")
// const client = require ("twilio")(config.accountID, config.authToken)

const AuthRouter = require("./routes/auth.routes");
const PacienteRouter = require("./routes/pacientes.routes");
const SignosRouter = require("./routes/signos.routes");
const ConsultaRouter = require("./routes/consulta.routes");
const HistorialRouter = require("./routes/historial.routes");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/clinica_gameca', {useNewUrlParser: true,  useUnifiedTopology: true})
.then(() => console.log("Connectado a mongodb"))
.catch((err) => {
  console.log(err);
})

const isRevoked = (req, payload, done) => {
  const token = req.headers.authorization.split(" ")[1] || req.query.token;
  Tokens.findOne({ token: token }).exec()
  .then((token) => {
    if (!token) {
      return done();
    } else {
      return done(new Error('token blocked'));
    }
  });
};

// Funcion de Json Web Token JWT
const publicKey= "GALLO$ANGULARJS"
const jwtConfig = {
  secret: publicKey,
  isRevoked: isRevoked,
  userProperty: "payload",
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return undefined;
  }
};

app.use('/', indexRouter);

//Excepciones de token JWT
app.use(jwt(jwtConfig).unless({
  path: [{ url: "/auth/login" }, { url: "/auth/logout" }, { url: "/auth/create" }, { url: "/auth/vericarsms" },{ url: "/auth/valida" }, { url: "/auth/refreshtoken" }, { url: "/public/upload/" }]
}));

// app.use('/users', usersRouter);
app.use('/auth', AuthRouter);
app.use('/paciente', PacienteRouter);
app.use('/signos', SignosRouter);
app.use('/consulta', ConsultaRouter);
app.use('/historial', HistorialRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err.message === 'token blocked') {
    err.status = 401;
  }
  // render the error page
  res.status(err.status || 500);
  res.json({message: err.message, status: err.status});
});


module.exports = app;
