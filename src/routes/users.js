const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserController = require('../controllers/users');
const Auth = require('../controllers/auth');
const multer = require('multer');

const upload = multer();

// frontend implemented:
router.post('/signup', UserController.user_signup);

router.post('/login', Auth.isLoggedOut, passport.authenticate('local'), (req, res, next) => {
    console.log("successful");
    res.status(200).json({
        success: true,
        username: req.body.username
    })
});

router.post('/steam/delete', Auth.isLoggedIn, UserController.user_delete_openid);

router.get('/steam/add', passport.authenticate('steam'));

router.get('/steam/login', Auth.isLoggedOut, passport.authenticate('steam'));

router.get('/steam/login/return', passport.authenticate('steam', {failureRedirectL: '/login'}), (req, res, next) => {
    res.redirect('http://localhost:4200');
});

router.post('/logout', Auth.isLoggedIn, UserController.user_logout);

router.get('/roles', UserController.user_get_roles);

router.get('/eexists', UserController.user_email_exists);

router.get('/uexists', UserController.user_username_exists);

// frontend not implemented:

router.patch('/', Auth.isLoggedIn, upload.any(), UserController.user_update);

router.get('/info/:username', UserController.user_get_info);

router.get('/avatar/:username', UserController.get_avatar);


router.get('/teams/:userId', UserController.user_get_teams);

router.get('/invites', Auth.isLoggedIn, UserController.user_get_invites);

router.get('/confirm/:key', UserController.user_confirm_email);

module.exports = router;
