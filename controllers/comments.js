const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = {
    createComment,
    deleteComment
};

// Function to create a comment for a specific post
async function createComment(req, res) {
    try {
        req.body.author = req.user._id;
        req.body.post = req.params.postId;
        
        // Create the comment
        const comment = await Comment.create(req.body);
        
        // Push the comment's ID to the post's comments array
        const post = await Post.findById(req.params.postId);
        post.comments.push(comment._id);
        await post.save();

        res.redirect(`/posts/${req.params.postId}`);
    } catch (err) {
        console.log(err);
        res.redirect('/error');
    }
}

// Function to delete a comment
async function deleteComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.commentId);

        // Ensure the person deleting is the author of the comment
        if (comment.author.equals(req.user._id)) {
            await comment.remove();
            
            // Remove comment's ID from the post's comments array
            const post = await Post.findById(comment.post);
            const index = post.comments.indexOf(comment._id);
            if (index !== -1) {
                post.comments.splice(index, 1);
                await post.save();
            }
        }

        res.redirect(`/posts/${comment.post}`);
    } catch (err) {
        console.log(err);
        res.redirect('/error');
    }
}
