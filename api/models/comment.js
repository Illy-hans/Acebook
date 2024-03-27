const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    message: {type: String, require: true},
    user_id: {type: String, require: true},
    time_of_comment: {type: String, require: false},
    // String array of user_id's
    likes: {type: Array},
    post_id: {type: String, require: true},
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;