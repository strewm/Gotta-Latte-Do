const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const db = require("../db/models");
const { csrfProtection, asyncHandler, handleValidationErrors } = require("../utils");
const { loginUser, logoutUser } = require("../auth");

const router = express.Router();

const userValidators = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a username")
    .isLength({ max: 50 })
    .withMessage("Username cannot be more than 50 characters long"),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide an email address")
    .isLength({ max: 255 })
    .withMessage("Email Address must not be more than 255 characters long")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .custom((value) => {
      return db.User.findOne({ where: { email: value } }).then(
        (user) => {
          if (user) {
            return Promise.reject(
              "The provided email address is already in use by another account"
            );
          }
        }
      );
    }),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password")
    .isLength({ max: 50 })
    .withMessage("Password must not be more than 50 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
    .withMessage(
      'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
    ),
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please provide your password again")
    .isLength({ max: 50 })
    .withMessage("Password must not be more than 50 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  console.log(userId, '------------------------------')
  const userInfo = await db.User.findByPk(userId);
  console.log(userInfo, '!!!!!!!!!!!!!!!!!!!!!!!!')
  res.status(201).json({userInfo})
}))

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
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const user = await db.User.build({
        username,
        email
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashedPassword = hashedPassword;
      await user.save();
      loginUser(req, res, user);
      res.redirect("/");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('user-signup', {
        title: 'Register',
        user,
        errors,
        csrfToken: req.csrfToken(),
    });
  }
}));


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
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    let errors = [];
    const validatorErrors = validationResult(req);

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
      } else {
        errors = validatorErrors.array().map((error) => error.msg);
      }
      //errors.push("Login failed for the provided email address and password");
      res.render("user-login", {
        title: "Login",
        email,
        errors,
        csrfToken: req.csrfToken(),
      });
  }));



router.post("/logout", (req, res) => {
  logoutUser(req, res);
  res.redirect("/");
});


router.post('/demo', asyncHandler(async (req, res) => {
  const user = await db.User.findByPk(4);
  loginUser(req, res, user);
  res.redirect('/app');
}))


router.get('/current', asyncHandler(async (req, res) => {
  const userId = res.locals.userId;
  const user = await db.User.findByPk(userId);
  res.json({ user });
}))

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
