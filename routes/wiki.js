const express = require('express');
const router = express.Router();

const wiki_controller = require('../controllers/wikiController');

router.get('/login', wiki_controller.login_get);

router.post('/login', wiki_controller.login_post);

router.get('/signup', wiki_controller.signup_get);

router.post('/signup', wiki_controller.signup_post);

module.exports = router;
