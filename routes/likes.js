const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/likes');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

router.post('/:id/like', isLoggedIn, likesCtrl.addLike);

router.delete('/:id/unlike', isLoggedIn, likesCtrl.removeLike);

module.exports = router;
