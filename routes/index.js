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
      console.log(list_messages);
      res.render('index', {
        title: 'Express',
        user: req.user,
        messages: list_messages,
      });
    });
});

module.exports = router;
