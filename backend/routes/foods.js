const express = require("express");
const { body, validationResult } = require("express-validator");
const { set } = require("mongoose");
const fetchuser = require("../middleware/fetchuser.js");
const Foods = require("../models/Foods.js");
const Food = require("../models/Foods.js");
const router = express.Router();

// ROUTE 1: GET req to add food at: GET /api/food/getrandom  //Login nots required
router.get("/getrandomfood", async (req, res) => {
  //If there are errors, return bad request and the errors
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  try {
    let food = await Food.find();
    console.log(food);
    let ri = getRandomInt(food.length);
    let rf = food[ri];
    res.send({ rf });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

// ROUTE 2: POST req to add food at: POST /api/food/getfood. Login Required
router.post(
  "/addfood",
  [body("name", "name cannot be null").exists()],
  fetchuser,
  async (req, res) => {
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const name = req.body.name;
      const userid = req.user.id;
      let food = await Food.create({
        user: userid,
        name: name,
      });
      console.log(food);
      res.send({ food });
    } catch (error) {
      console.error(errors.message);
      res.status(500).send({ error: error.message });
    }
  }
);

// ROUTE 3: GET req to get all  food at: GET /api/food/getfood
router.get("/getfood", fetchuser, async (req, res) => {
  //If there are errors, return bad request and the errors
  try {
    const userid = req.user.id;

    let food = await Food.find({ userid });
    console.log(food);
    res.send({ food });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

// ROUTE 4: put req to update food at: PUT /api/food/updatefood
router.put("/updatefood/:_id", fetchuser, async (req, res) => {
  //If there are errors, return bad request and the errors
  try {
    let f = await Foods.findById(req.params._id);
    let newFood = {name: req.body.name}
    if (!f) {
      res.status(404).send("Not Found");
    }
    if (f.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    // const userid = req.user.id;

    let food = await Food.findByIdAndUpdate(
      req.params._id,
      { $set: newFood },
      { new: true }
    );
    console.log(food);
    res.send({ food });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: error.message });
  }
});


// ROUTE 5: DELETE req to delete food at: DELETE /api/food/deletefood
router.delete("/deletefood/:_id", fetchuser, async (req, res) => {
  //If there are errors, return bad request and the errors
  try {
    let f = await Foods.findById(req.params._id);
    if (!f) {
      res.status(404).send("Not Found");
    }
    if (f.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    // const userid = req.user.id;

    let food = await Food.findByIdAndDelete(
      req.params._id,
    );
    console.log(food);
    res.send({ food });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
