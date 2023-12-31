const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports = {
  addComment,
  deleteComment,
};

async function addComment(req, res) {
  try {
    console.log("ADD COMMENT FUNCTION FIRING");
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found.");
    }

    const comment = await Comment.create({
      content: req.body.content,
      author: req.user._id,
      post: postId,
    });
    console.log(comment);
    post.comments.push(comment._id);
    await post.save();

    res.redirect("/posts");
  } catch (err) {
    console.log(err);
    res.render("error", { message: err.message, error: err });
  }
}

// Function to delete a comment
async function deleteComment(req, res) {
  req.params.commentId;
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment.author.toString() === req.user._id.toString()) {
      await Comment.deleteOne({ _id: comment._id });
      const post = await Post.findById(comment.post);
      const index = post.comments.indexOf(comment._id);
      if (index !== -1) {
        post.comments.splice(index, 1);
        await post.save();
      }
    }

    res.redirect(`/posts`);
  } catch (err) {
    console.log(err);
    res.render("error", { message: err.message, error: err });
  }
}
