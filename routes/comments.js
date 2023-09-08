const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

// POST route to add a comment to a post
router.post('/:postId/comment', isLoggedIn, commentsCtrl.addComment);

// DELETE route to remove a comment from a post
router.delete(':/comment/commentId', isLoggedIn, commentsCtrl.deleteComment);


module.exports = router;
