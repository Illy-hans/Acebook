const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/comment")

const logReq = (req) => {
    console.log(req);
}

router.get("/", CommentController.getAllComment);
router.post("/", CommentController.createComment);
router.delete("/:id", CommentController.deleteComment)

module.exports = router