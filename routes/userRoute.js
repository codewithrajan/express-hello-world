require('dotenv').config();
const connectDB = require('../config/db');
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const { Contact } = require('../models/Contact');
const authenticateUser = require("../middlewares/Authentication")
connectDB();
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { "title": "Login Page" });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        //  console.log(user.username);
        if (user && (await bcrypt.compare(password, user.password))) {
            // console.log(user.username);
           
            if(user.maximumdevice<process.env.MAXIMUMDEVICE)
            {
                req.session.user = user;
                const token = await user.generateAuthToken();
                res.cookie('token', token, { maxAge: 12*24*60*60*1000 }); // Expires in millisecond
                const originalUrl = req.session.originalUrl || '/';
                delete req.session.originalUrl;
                res.redirect(originalUrl);
            }
            else
            {
                res.send(`maximum ${process.env.MAXIMUMDEVICE} are allowed so please logout from other devices first`);
                
            }

            
            
        } else {
            req.flash('error', 'Invalid username or password');    //flash method give the flash method to response 
            //hrtr error is key and invalid is value we can give any name instead of error
            // req.flash('info', 'Welcome to the site!'); for success we need access messages.info
            // req.flash('success', 'Operation completed successfully');
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get(['/', '/index'], authenticateUser, (req, res) => {
    // if (req.session.user) {
    //     res.render('index', { user: req.session.user, "title":"Home Page" });
    // } else {
    //     res.redirect('/login');
    // }
    const userCookie = req.cookies.token;
    // console.log(userCookie);
    res.render('index', { "title": "Home Page" });
});

router.get('/logout', async (req, res) => {
   const ctoken = req.cookies.token;
//    console.log(ctoken);
    try {
        // console.log(req.session.user.maximumdevice);
            const user = await User.findOneAndUpdate(
            { 'tokens.token': ctoken },
            { $pull: { tokens: { token: ctoken } }, $inc: { maximumdevice: -1 } },
            { new: true } // Return the updated document
          );
        if (user) {
            res.clearCookie('token');
            // console.log('User found:', user);
        } else {
            // console.log('User not found for the provided token.');
        }
    } catch (error) {
        console.error('Error finding user by token:', error);
    }
    
    res.redirect('/login'); // Redirect to the login page or any other desired location after unsetting the cookie
});

router.get('/register', (req, res) => {
    res.render('register', { "title": "SignUp Page" });
});

router.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    try {
        if (password != confirmPassword) {
            req.flash('error', 'Passwords do not match. Please try again.');
            res.redirect('/register');
            return;
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            req.flash('error', 'Username already exists. Please choose a different one.');
            res.redirect('/register');
        } else {
            const newUser = new User({ username, password });
            await newUser.save();
            // req.session.user = newUser;
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Start server

router.get('/contact', (req, res) => {
    res.render('contact', { "title": "Contact Page" });
});
router.post('/contact', async (req, res) => {
    const { fullName, mobileNumber, email, description } = req.body;

    try {
        const newContact = new Contact({ fullName, mobileNumber, email, description });
        await newContact.save();
        res.redirect('/thankyou');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/thankyou', (req, res) => {
    res.render('thankyou');
});

router.get('/forgot', (req, res) => {
    res.render('forgot', { "title": "Forgot Page" });
});

router.post('/forgot', async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    try {
        if (password != confirmPassword) {
            req.flash('error', 'Passwords do not match. Please try again.');
            res.redirect('/register');
            return;
        }
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            existingUser.password = password;
            await existingUser.save();

            // req.flash('error', 'password updated successfully');
            res.redirect('/forgot');
        } else {

            req.flash('error', "you are not register user");
            res.redirect('/forgot');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/set-cookie', (req, res) => {
    res.cookie('user', 'john_doe', { maxAge: 24 * 60 * 60 * 1000 }); // Expires in 1 day
    res.send('Cookie set successfully!');
});

router.get('/get-cookie', (req, res) => {
    const userCookie = req.cookies.token;
    res.send(`User Cookie Value: ${userCookie}`);
});

router.get('/secret',authenticateUser,(req,res)=>{
    res.render('secret');   
})

module.exports = router;