const express = require("express");
const router = express.Router();

const UserModel = require("./../model/User");
// const uploader = require("./../config/cloudinary");
const protectAdminRoute = require("./../middlewares/protectAdminRoute");
const bcrypt = require('bcrypt');


//ALL following routes are prefixed with auth

router.get('/signin', (req, res, next) => {
    res.render('auth/signin.hbs');
})

router.post('/signin', (req, res, next) => {
    //
})

///

router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs');
})

router.post('/signup', async (req, res, next) => {
    console.log("signup")
    try {
        const newUser = {... req.body}
        const foundUser = await UserModel.findOne({email : newUser.email})
        if (foundUser) {
            res.redirect('/auth/signup')
            console.log('Already exists')
        }
        else {
            const hashedPassword = bcrypt.hashSync(newUser.password, 10)
            newUser.password = hashedPassword ;
            await UserModel.create(newUser)
            res.redirect('/auth/signin')
            console.log(newUser)
        }
    }
    catch (err) {
        // res.redirect('/auth/signup');
        //next(err);
        console.log(err);
    }
})

///

router.get('/signout', (req, res, next) => {
    res.redirect('/signin');
})



module.exports = router