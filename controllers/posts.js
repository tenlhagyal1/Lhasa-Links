const Post = require('../models/post');

module.exports = {
    create,
    list,
    delete: deletePost,
    new: newPost
};

// Function to create a post
async function create(req, res) {
    try {
        // Parse the request body to get the "content" field
        const { content } = req.body;

        // Check if "content" is provided and not empty
        if (!content) {
            throw new Error('Content is required.');
        }
        // keep track of the user who created the post
        req.body.author = req.user._id;
        const post = await Post.create(req.body);
        res.redirect('/posts'); 
    } catch (err) {
        console.log(err);
        res.redirect('/posts/new'); 
    }
}

// Function to list all posts
async function list(req, res) {
    try {
        const posts = await Post.find({}).populate('author');  
        res.render('posts/list', { posts });
    } catch (err) {
        console.log(err);
        res.render('error', { err });
        console.error("Validation errors:", err.errors);
    }
}

// Function to delete a post
async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.equals(req.user._id)) { // Ensure the person deleting is the author
            await post.remove();
        }
        res.redirect('/posts');
    } catch (err) {
        console.log(err);
        res.render('error', { err });
    }
}
async function newPost(req, res) {
    res.render('posts/new');
}
