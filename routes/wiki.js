const express = require('express');
const router = express.Router();

const wiki_controller = require('../controllers/wikiController');

router.get('/login', wiki_controller.login_get);

router.post('/login', wiki_controller.login_post);

router.get('/signup', wiki_controller.signup_get);

router.post('/signup', wiki_controller.signup_post);

router.get('/join-club', wiki_controller.join_club_get);

router.post('/join-club', wiki_controller.join_club_post);

router.get('/create-message', wiki_controller.create_message_get);

router.post('/create-message', wiki_controller.create_message_post);

router.get('/add-admin', wiki_controller.add_admin_get);

router.post('/add-admin', wiki_controller.add_admin_post);

router.get('/');

module.exports = router;
