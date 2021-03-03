const express = require("express");
const router = express.Router();

const UserModel = require("./../model/User");
// const uploader = require("./../config/cloudinary");
const protectAdminRoute = require("./../middlewares/protectAdminRoute");
const bcrypt = require("bcrypt");

//ALL following routes are prefixed with auth

router.get("/signin", (req, res, next) => {
  res.render("auth/signin.hbs");
});

router.post("/signin", async (req, res, next) => {
  try {
    console.log("hey");

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    console.log(user);

    if (!user) {
      console.log("this user does not exists");
      res.redirect("/auth/signin");
    } else {
      const isSamePassword = bcrypt.compareSync(password, user.password);
      if (!isSamePassword) {
        console.log("faux baby");
        res.redirect("/auth/signin");
      } else {
        const userObject = user.toObject();
        delete userObject.password; // remove password before saving user in session
        // console.log(req.session, "before defining current user");
        req.session.currentUser = userObject;
        res.redirect("/dashboard");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

///

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", async (req, res, next) => {
  console.log("signup");
  try {
    const newUser = { ...req.body };
    const foundUser = await UserModel.findOne({ email: newUser.email });
    if (foundUser) {
      res.redirect("/auth/signup");
      console.log("Already exists");
    } else {
      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      await UserModel.create(newUser);
      res.redirect("/auth/signin");
      console.log(newUser);
    }
  } catch (err) {
    // res.redirect('/auth/signup');
    //next(err);
    console.log(err);
  }
});

///

router.get("/signout", (req, res, next) => {
  req.session.destroy(function (error) {
    res.redirect("/auth/signin");
  });
});

module.exports = router;
