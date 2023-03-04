const express = require("express");
const User = require("../models/Users.js");
const router = express.Router();
const { body, validationResult } = require("express-validator");
// const { default: userEvent } = require("@testing-library/user-event");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = "Thisisjwtsecretkey";
// const JWT_SECRET = process.env.JWT_SECRET;


// ROUTE 1: Create a User using:POST "/api/auth". Doesn't Require Auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid password").isEmail(),
    body("password", "Password must be atleast 8 characters long").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with a this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create New User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      //   console.log(jwtData)
      res.send({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ error: error.message });
    }
  }
);

// ROUTE 2: Authenticate a user using: POST: "api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid password").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error: "Please try to login with correct credentiala"})

      }
      const passwordcampare = await bcrypt.compare(password, user.password);
      if(!passwordcampare){
        return res.status(400).json({error: "Please try to login with correct credentiala"})
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.send({authtoken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
)

// ROUTE 3: Get LoggedIn user details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser ,async (req, res) => {
    try {
      const userid = req.user.id;
      const user = await User.findById(userid).select("-password");
      res.send(user)
    } catch (error) {
      console.error(error.message)
      res.status(500).send("Internal Server Error");
    }
 }
)


module.exports = router;
