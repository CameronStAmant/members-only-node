const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

exports.login_get = (req, res, next) => {
  res.render('login');
};

exports.login_post = [
  body('email', 'Please enter your email.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Please enter your password.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('login', {
        email: req.body.email,
        password: req.body.password,
        errors: errors.array(),
      });
      return;
    }
    next();
  },

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
];

exports.signup_get = (req, res, next) => {
  res.render('signup');
};

exports.signup_post = [
  body('firstName', 'First name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastName', 'Last name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'Email is required').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password is required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render('signup', {
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      User.findOne({ email: req.body.email }).exec((err, found_user) => {
        if (err) {
          return next(err);
        }
        if (found_user) {
          res.render('signup', {
            user: user,
            errors: [{ msg: 'Email already in use' }],
          });
        } else {
          user.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect('login');
          });
        }
      });
    }
  },
];
