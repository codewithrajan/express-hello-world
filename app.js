// require('dotenv').config();  //at the time of production we will delete this line
const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const hbs = require('hbs');
const cookieParser=require('cookie-parser')
const app = express();
const userRouter = require('./routes/userRoute');
const productRoutes = require('./routes/productRoutes');
// const {authenticateUser}=require("./middlewares/Authentication")


const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({secret: 'rajankumar',resave: true,saveUninitialized: true,cookie: { maxAge: 12*24*60*60*1000 },}));  //miniseconds
app.use(flash());
app.use(express.json());
app.use(cookieParser());
// Set up HBS
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
const partialpath = path.join(__dirname, "./views/layouts")
hbs.registerPartials(partialpath);

//Route for User
app.use('/',userRouter);
app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports=app;