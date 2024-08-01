const express = require('express');
const router = express.Router();
const passport = require('passport');
const profileController = require('../controllers/profileController');

// @route GET api/profiles
// @desc Get current user's profile
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  profileController.getProfile
);

// @route POST api/profiles
// @desc Create or update user profile
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  profileController.createOrUpdateProfile
);

module.exports = router;
