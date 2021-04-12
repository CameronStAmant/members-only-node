var express = require('express');
var router = express.Router();
const Message = require('../models/message');

/* GET home page. */
router.get('/', (req, res, next) => {
  Message.find({}, 'title author body timestamp')
    .populate('author')
    .exec((err, list_messages) => {
      if (err) {
        return next(err);
      }
      res.render('index', {
        title: 'Welcome to the club!',
        user: req.user,
        messages: list_messages,
      });
    });
});

router.post('/', async (req, res, next) => {
  const message = await Message.findById(req.body.id).exec();
  if (message === null) {
    let err = new Error('Message not found');
    err.status = 404;
    return next(err);
  }
  Message.findByIdAndDelete(req.body.id, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
