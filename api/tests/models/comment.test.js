require("../mongodb_helper")

const Comment = require("../../models/comment");

describe("Comment model", () => {
    beforeEach(async () =>{
        await Comment.deleteMany({});
    })

    it("has a comment", () => {
        const comment = new Comment({message: "Comment", user_id: "1",
            time_of_comment: "30/01/2024, 13:04:09"})
        expect(comment.message).toEqual("Comment")
        expect(comment.time_of_comment).toEqual("30/01/2024, 13:04:09")
    })

    it("can find empyt list of comments", async() => {
        const posts = await Comment.find()
        expect(posts).toEqual([])
    })

    it("can find comment", async () => {
        const comment = new Comment({message: "Comment", user_id: "1",
            time_of_comment: "30/01/2024, 13:04:09"})
        
        await comment.save()
        const posts = await Comment.find()
        expect(posts[0].message).toEqual("Comment")
    })

    it("can find multipe comments", async () => {
        const comment_1 = new Comment({message: "Comment 1", user_id: "1",
            time_of_comment: "30/01/2024, 13:04:09"})
        const comment_2 = new Comment({message: "Comment 2", user_id: "2",
            time_of_comment: "30/01/2024, 13:05:09"})
        const comment_3 = new Comment({message: "Comment 3", user_id: "3",
            time_of_comment: "30/01/2024, 13:06:09"})
        
        await comment_1.save()
        await comment_2.save()
        await comment_3.save()
        const posts = await Comment.find()
        expect(posts[0].message).toEqual("Comment 1")
        expect(posts[1].message).toEqual("Comment 2")
        expect(posts[2].message).toEqual("Comment 3")
    })
});
