const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
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
describe("/users", () => {
    beforeAll(async () => {
        const user = new User({
            username: "Test user",
            email: "Test email",
            password: "12345678",
            profile_picture: null,
            liked_posts: ["post1", "post2"],
        });
        await user.save();
        token = createToken(user.id);
    });

    describe("GET, when a token is present", () => {
        test("responds with a 200", async () => {
            const response = await request(app)
                .get("/users")
                .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toEqual(200);
        });

        test("returns all the information for the user", async () => {
            const response = await request(app)
            .get("/users")
            .set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(200);
            const user1 = response.body.user;
            console.log(`I should be an object: ${user1}`)

            expect(user1.username).toEqual("Test user");
            expect(user1.email).toEqual("Test email");
            expect(user1.liked_posts).toEqual(["post1", "post2"])
        })

        test("a new token is returned", async () => {
            const response = await request(app)
                .get("/users")
                .set("Authorization", `Bearer ${token}`);
            
            const newToken = response.body.token;
            const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
            const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
            expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
        });
    })

    // added a test here for a missing token. 
    describe("GET, when a token is missing", () => {
        test("the reponse code is 401", async () => {
            const response = await request(app).get("/users");
            
            expect(response.status).toEqual(401);
        })
    })
})


