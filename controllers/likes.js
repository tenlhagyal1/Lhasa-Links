const Post = require('../models/post')
const Like = require('../models/like')

module.exports = {
    addLike,
    removeLike
}

async function addLike(req, res) {
    const existingLike = await Like.findOne({ post: req.params.id, user: req.user._id })

    if(!existingLike) {
        await Like.create({
            post: req.params.id,
            user: req.user._id
        })
    }
    
    res.redirect(`/posts/${req.params.id}`);
}

async function removeLike(req, res) {
    await Like.findOneAndRemove({ post: req.params.id, user: req.user._id})
    res.redirect(`/posts/${req.params.id}`);
}