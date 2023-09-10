const Post = require("../models/post");

module.exports = {
  create,
  list,
  delete: deletePost,
  new: newPost,
  showEditForm,
  update: updatePost,
  like: likePost,
};

async function create(req, res) {
  try {
    const { content } = req.body;
    if (!content) {
      throw new Error("Content is required.");
    }
    req.body.author = req.user._id;
    const post = await Post.create(req.body);
    res.redirect("/posts");
  } catch (err) {
    console.log(err);
    res.redirect("/posts/new");
  }
}

async function list(req, res) {
  try {
    const posts = await Post.find({})
      .populate({
        path: "comments",
        model: "Comment",
        populate: {
          path: "author",
          model: "User",
        },
      })
      .populate("author");
    res.render("posts/list", { posts });
  } catch (err) {
    console.log(err);
    res.render("error", { err });
    console.error("Validation errors:", err.errors);
  }
}
async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (post.author.toString() === req.user._id.toString()) {
      await Post.deleteOne({ _id: post._id });
    }
    res.redirect("/posts");
  } catch (err) {
    console.log(err);
    res.render("error", { message: err.message, error: err });
  }
}

async function newPost(req, res) {
  res.render("posts/new");
}
async function showEditForm(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.author.toString() === req.user._id.toString()) {
      res.render("posts/edit", { post });
    } else {
      throw new Error("Not authorized to edit this post.");
    }
  } catch (err) {
    console.log(err);
    res.render("error", { err });
  }
}

async function updatePost(req, res) {
  try {
    const { content } = req.body;

    if (!content) {
      throw new Error("Content is required.");
    }

    let post = await Post.findById(req.params.id);
    if (!post) {
      throw new Error("Post not found.");
    }
    if (post.author.toString() === req.user._id.toString()) {
      post.content = content;
      await post.save();
      res.redirect("/posts");
    } else {
      throw new Error("Not authorized to edit this post.");
    }
  } catch (err) {
    console.log(err);
    res.redirect(`/posts/${req.params.id}/edit`);
  }
}

async function likePost(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found.");
    }

    if (
      post.likedBy.map((id) => id.toString()).includes(req.user._id.toString())
    ) {
      post.likesCount -= 1;
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      post.likesCount += 1;
      post.likedBy.push(req.user._id);
    }

    await post.save();
    res.redirect("/posts");
  } catch (err) {
    console.log(err);
    res.render("error", { message: err.message, error: err });
  }
}
