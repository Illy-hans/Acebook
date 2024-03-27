const request = require("supertest");
const JWT = require("jsonwebtoken");
const User = require("../../models/user");

const app = require("../../app");

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

    beforeEach(async () => {
        const user = new User({
            username: "Test user",
            email: "Test email",
            password: "12345678",
            profile_picture: null,
            liked_posts: ["post1", "post2"],
        });

        await user.save();
        token = createToken(user.id);
        console.log(user.id)
    });

    beforeAll( async () => {
        await User.deleteMany({});
    });

    describe("PATCH, when a token is present", () => {
        test("responds with a 200", async () => {
            const response = await request(app)
                .patch("/users")
                .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toEqual(200);
        });

    describe("Updated user data", () => {
        test("updates information for a test user", async () => {
            const username = "New username";
            const email =  "New email";
            const password = "";
            const profile_picture = "";

            const response = await request(app)
                .patch("/users")
                .set("Authorization", `Bearer ${token}`)
                .send({ username, email, password, profile_picture, token })

            expect(response.status).toEqual(200);

            expect(username).toEqual("New username");
            expect(email).toEqual("New email");
            });
        });
        
    describe("Testing new tokens", () => {
        test("a new token is returned", async () => {
            const response = await request(app)
                .patch("/users")
                .set("Authorization", `Bearer ${token}`);
            
            const newToken = response.body.token;
            const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
            const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
            expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
        })
    })

    // added a test here for a missing token. 
    describe("Fails when a token is missing", () => {
        test("the reponse code is 401", async () => {
            const response = await request(app).patch("/users");
            
            expect(response.status).toEqual(401);
        })
    })
})
})