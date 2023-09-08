const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

router.get('/', postsCtrl.list);

router.get('/new', isLoggedIn, postsCtrl.new);
router.post('/', isLoggedIn, postsCtrl.create);
router.get('/:id/edit', isLoggedIn, postsCtrl.showEditForm);
router.post('/:id/edit', isLoggedIn, postsCtrl.update);
router.post('/:id/like', isLoggedIn, postsCtrl.like);
router.delete('/:id', isLoggedIn, postsCtrl.delete);

module.exports = router;