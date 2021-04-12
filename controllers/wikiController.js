const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

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
  body('passwordConfirmation', 'The two passwords do not match.')
    .exists()
    .custom((value, { req }) => value === req.body.password),

  (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        membershipStatus: false,
        adminStatus: false,
      });

      if (!errors.isEmpty()) {
        res.render('signup', {
          user: user,
          password: req.body.password,
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
    });
  },
];

exports.join_club_get = (req, res, next) => {
  res.render('join_club');
};

exports.join_club_post = [
  body('joinCode').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('join_club');
      return;
    } else {
      if (req.body.joinCode === 'join') {
        User.findOne({ _id: req.user._id }).exec((err, user) => {
          if (err) {
            return next(err);
          }
          if (user) {
            const user = new User({
              firstName: req.user.firstName,
              lastName: req.user.lastName,
              email: req.user.email,
              password: req.user.password,
              _id: req.user._id,
              membershipStatus: true,
              adminStatus: req.user.adminStatus,
            });
            User.findByIdAndUpdate(
              req.user._id,
              user,
              {},
              (err, updatedUser) => {
                if (err) {
                  return next(err);
                }
                res.redirect('/');
              }
            );
          }
        });
      } else {
        res.render('join_club');
      }
    }
  },
];

exports.create_message_get = (req, res, next) => {
  res.render('message_form', { user: req.user });
};

exports.create_message_post = [
  body('title', 'Title is required').trim().isLength({ min: 1 }).escape(),
  body('body', 'Body is required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      body: req.body.body,
      author: req.user.id,
    });
    if (!errors.isEmpty()) {
      res.render('message_form', {
        message: message,
        errors: errors.array(),
      });
    } else {
      message.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    }
  },
];

exports.add_admin_get = (req, res, next) => {
  res.render('add_admin', { user: req.user });
};

exports.add_admin_post = [
  body('adminCode').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-admin');
      return;
    } else {
      if (req.body.adminCode === 'upgrade') {
        User.findOne({ _id: req.user._id }).exec((err, user) => {
          if (err) {
            return next(err);
          }
          if (user) {
            const user = new User({
              firstName: req.user.firstName,
              lastName: req.user.lastName,
              email: req.user.email,
              password: req.user.password,
              _id: req.user._id,
              membershipStatus: req.user.membershipStatus,
              adminStatus: true,
            });
            User.findByIdAndUpdate(
              req.user._id,
              user,
              {},
              (err, updatedUser) => {
                if (err) {
                  return next(err);
                }
                res.redirect('/');
              }
            );
          }
        });
      } else {
        res.render('add-admin');
      }
    }
  },
];

exports.logout_get = (req, res, next) => {
  req.logout();
  res.redirect('/');
};
