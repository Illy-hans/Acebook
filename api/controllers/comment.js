const Comment = require("../models/comment")
const { generateToken } = require("../lib/token")


const getAllComment = async (req, res) => {
    const comments = await Comment.find(req.comment_ids);
    const token = generateToken(req.user_id);
    res.status(200).json({ comments: comments, token: token });
};

const createComment = async (req, res) => {
    const commentObject = {
        message: req.body.message,
        user_id: req.user_id,
        time_of_comment: req.body.datetime,
        post_id: req.body.post_id
    };
    const comment = new Comment(commentObject);
    comment.save();

    const newToken = generateToken(req.user_id);
    res.status(201).json({message: "OK", token: newToken});
};

const deleteComment = async (req, res) => {
    await Comment.findByIdAndDelete(req.params.id)

    const newToken = generateToken(req.user_id);
    res.status(200).json({message: "Post sucessfully deleted", token: newToken})
}



const CommentController = {
    createComment: createComment,
    getAllComment: getAllComment,
    deleteComment: deleteComment
};


module.exports = CommentController;