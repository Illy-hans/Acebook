const Post = require("../models/post");
const Comment = require("../models/comment")
const { generateToken } = require("../lib/token");

const getAllPosts = async (req, res) => {
  const posts = await Post.find();
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
};

const createPost = async (req, res) => {
  const postObject = {
    message: req.body.message, 
    image: req.body.image, 
    time_of_post: req.body.datetime, 
    user_id: req.user_id}
  const post = new Post(postObject);
  post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "OK", token: newToken });
};

const likePost = async (req, res) => {
const post = await Post.findById(req.body.id);

 if (post.likes.indexOf(req.user_id) === -1) {
  console.log('liking...');
  post.likes.push(req.user_id);
  post.save();
 } else {
  console.log('unliking...');
  post.likes.splice(post.likes.indexOf(req.user_id), 1);
  post.save();
 }

 console.log(post.likes);

 const newToken = generateToken(req.user_id);
 res.status(201).json({message: "OK, liked.", token: newToken});
};

const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id)
  await Comment.deleteMany({post_id: req.params.id})

  const newToken = generateToken(req.user_id);
  res.status(200).json({message: "Post sucessfully deleted", token: newToken})
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  likePost: likePost,
  deletePost: deletePost
};

module.exports = PostsController;
