const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

router.post('/:postId', isLoggedIn, commentsCtrl.addComment);

router.delete('/:commentId', isLoggedIn, commentsCtrl.deleteComment);


module.exports = router;
