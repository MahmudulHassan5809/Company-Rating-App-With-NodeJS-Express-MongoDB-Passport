const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const validator = require('express-validator');
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');
const morgan = require('morgan');
const flash = require('express-flash');
const ejs = require('ejs');
const engine = require('ejs-mate');
const passport = require('passport');
const _ = require('underscore');
const moment = require('moment');


const app = express();



//DB Config
const db = require('./config/database');
//Map Gloabal Promise -get rid of warning
mongoose.Promise = global.Promise;
//Connect To Mongoose
mongoose.connect(db.mongoURI,{
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(() => { console.log('mongodb Connected');})
.catch(err => console.log(err));


// Mongo Store
const MongoStore = connectMongo(session);

//passport config
require('./config/passport')(passport);
require('./config/passportGoogle')(passport);

//secret config
require('./config/secret');

//Static Folder
app.use(express.static(__dirname + '/public'));

//Morgan MiddleWare
app.use(morgan('dev'));


//EJS MiddleWare
app.engine('ejs',engine);
app.set('view engine','ejs');

//Body parser MiddleWare
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cookie parser MiddleWare
app.use(cookieParser());

// Express Validator
app.use(validator());

//Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
  	mongooseConnection: mongoose.connection
  })
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session())



//Flash
app.use(flash());



//Global Variable
app.use((req,res,next) => {
	res.locals.user = req.user;
  res.locals._ = _;
  res.locals.moment = moment;
  next();
});



//Load Routes
const pages = require('./routes/pages');
const users = require('./routes/users');
const companies = require('./routes/companies');
const reviews = require('./routes/reviews');
const messages = require('./routes/messages');
const auth = require('./routes/auth');

//Pages Routes
app.use('/',pages);
//Users Routes
app.use('/users',users);
//Company Routes
app.use('/company',companies);
//Review Routes
app.use('/review',reviews);
//Message Routes
app.use('/message',messages);
//Google Auth Routes
app.use('/auth',auth);

const port = process.env.PORT || 3000;
app.listen(port,() => {
	console.log(`Sever Started on port ${port}`);
});
