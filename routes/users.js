const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");

const db = require("../db/models");
const { csrfProtection, asyncHandler, handleValidationErrors } = require("../utils");
const { loginUser, logoutUser } = require("../auth");

const router = express.Router();

const userValidators = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Username")
    .isLength({ max: 50 })
    .withMessage("First Name must not be more than 50 characters long"),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Email Address")
    .isLength({ max: 255 })
    .withMessage("Email Address must not be more than 255 characters long")
    .isEmail()
    .withMessage("Email Address is not a valid email")
    .custom((value) => {
      return db.User.findOne({ where: { email: value } }).then(
        (user) => {
          if (user) {
            return Promise.reject(
              "The provided Email Address is already in use by another account"
            );
          }
        }
      );
    }),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password")
    .isLength({ max: 50 })
    .withMessage("Password must not be more than 50 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
    .withMessage(
      'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
    ),
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Confirm Password")
    .isLength({ max: 50 })
    .withMessage("Confirm Password must not be more than 50 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password does not match Password");
      }
      return true;
    }),
];


router.get("/signup", csrfProtection, asyncHandler(async (req, res) => {
  const user = db.User.build();
  res.render("user-signup", {
    title: "Register",
    user,
    csrfToken: req.csrfToken(),
  });
}));


router.post(
  "/signup",
  csrfProtection,
  userValidators,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const user = await db.User.build({
        username,
        email
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;

    await user.save();
    // const defaultLists = QueryInterface.bulkInsert('Lists', [{

    // }])

    const defaultList = await db.List.bulkCreate([{
      userId: user.id,
      title: 'All tasks',
    }, {
      userId: user.id,
      title: 'Today'
    }, {
      userId: user.id,
      title: 'Tomorrow'
    }, {
      userId: user.id,
      title: 'Personal'
    }, {
      userId: user.id,
      title: 'Work'
    }, {
      userId: user.id,
      title: 'Given to Others / Given to Me'
    }, {
      userId: user.id,
      title: 'Overdue'
    }, {
      userId: user.id,
      title: 'Incomplete'
    }, {
      userId: user.id,
      title: 'Complete'
    }
  ])

    loginUser(req, res, user);

    res.redirect("/");
  })
);


router.get("/login", csrfProtection, (req, res) => {
  res.render("user-login", {
    title: "Login",
    csrfToken: req.csrfToken(),
  });
});

const loginValidators = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Email Address"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password"),
];

router.post(
  "/login",
  csrfProtection,
  loginValidators,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    let errors = [];
      if (user !== null) {

        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword.toString()
        );

        if (passwordMatch) {
          loginUser(req, res, user);
          return res.redirect("/app");
        }

        errors.push("Login failed for the provided email address and password");
        res.render("user-login", {
          title: "Login",
          email,
          errors,
          csrfToken: req.csrfToken(),
        });
      }
  }));



router.post("/logout", (req, res) => {
  logoutUser(req, res);
  res.redirect("/");
});




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
