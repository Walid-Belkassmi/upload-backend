const express = require("express");
const { body, validationResult } = require("express-validator");
const { upload, directory } = require("../config/multer");
const { User } = require("../models/index");
const app = express();

app.post(
  "/signup",
  body("lastname").exists().withMessage("Required"),
  body("firstname").exists().withMessage("Required"),
  body("email").isEmail().withMessage("Email isn't valid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password is too short min 8 characters"),
  body("password")
    .isLength({ max: 12 })
    .withMessage("Password is too long max 12 characters"),

  async (req, res) => {
    const { errors } = validationResult(req);
    console.log(req.body);
    const { lastname, firstname, email, password } = req.body;
    if (errors.length > 0) {
      res.status(400).json(errors);
    } else {
      const user = await User.create({
        lastname,
        firstname,
        email,
        password,
      });
      res.json(user);
    }
  }
);

app.post("/:id/profile_picture", upload.single("photo"), async (req, res) => {
  try {
    await User.update(
      {
        profile_picture: `http://localhost:5000/images/${req.file.filename}`,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const userUpdated = await User.findByPk(req.params.id);

    res.json(userUpdated);
  } catch (e) {
    res.json(e);
  }
});

module.exports = app;
