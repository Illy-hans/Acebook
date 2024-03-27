const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Comment = require("../../models/comment");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

const createToken = (userId) => {
    return JWT.sign(
    {
        user_id: userId,
        // Backdate this token of 5 minutes
        iat: Math.floor(Date.now() / 1000) - 5 * 60,
        // Set the JWT token to expire in 10 minutes
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
    );
};

let token;
describe("/comments", () => {
    beforeAll(async () => {
        const user = new User({
        username: "newUser",
        email: "comment-test@test.com",
        password: "12345678",
        });
        await user.save();
        await Comment.deleteMany({});
        token = createToken(user.id);
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Comment.deleteMany({});
    });

    describe("make POST request, when a valid token is present", () => {
        test("responds with a 201", async () => {
            const response = await request(app)
            .post("/comments")
            .set("Authorization", `Bearer ${token}`)
            .send({ message: "First comment!" });
            expect(response.status).toEqual(201);
        });

        test("creates a new comment", async () => {
            await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${token}`)
                .send({ message: "First comment!!"});
        
            const posts = await Comment.find();
            expect(posts.length).toEqual(1);
            expect(posts[0].message).toEqual("First comment!!");
        });
    
        test("returns a new token", async () => {
            const testApp = request(app);
            const response = await testApp
                .post("/comments")
                .set("Authorization", `Bearer ${token}`)
                .send({ message: "First comment" });
    
            const newToken = response.body.token;
            const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
            const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);
    
            // iat stands for issued at
            expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
        });
    })

    describe("POST, when token is missing", () => {
        test("responds with a 401", async () => {
            const response = await request(app)
            .post("/comments")
            .send({ message: "Post a comment" });
    
            expect(response.status).toEqual(401);
        });
    
        test("a post is not created", async () => {
            const response = await request(app)
            .post("/comment")
            .send({ message: "Post a comment" });
    
            const posts = await Comment.find();
            expect(posts.length).toEqual(0);
        });
    
        test("a token is not returned", async () => {
            const response = await request(app)
            .post("/comments")
            .send({ message: "hello again world" });
    
            expect(response.body.token).toEqual(undefined);
        });
    });
})