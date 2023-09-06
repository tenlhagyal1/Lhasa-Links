const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/likes');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

// POST route to add a like to a post
router.post('/:id/like', isLoggedIn, likesCtrl.addLike);

// DELETE route to remove a like from a post
router.delete('/:id/unlike', isLoggedIn, likesCtrl.removeLike);

module.exports = router;
