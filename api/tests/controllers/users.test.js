const request = require("supertest");
const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const app = require("../../app");
const User = require("../../models/user");
const Post = require("../../models/post")

require("../mongodb_helper");

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

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when username, email and password are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({ username:"Kora", email: "poppy@email.com", password: "1234", profile_picture: null });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({ username:"Kora", email: "scarconstt@email.com", password: "1234", profile_picture: null });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
      expect(newUser.username).toEqual("Kora")
      expect(newUser.profile_picture).toEqual(null)
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "1234" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("PATCH /like route", () => {
    beforeEach(async () => {
      await User.deleteMany({});
      await Post.deleteMany({});
    });

    it("adds post id to users liked_post array, when request is sent with a status='liked' is send", async () => {
      await request(app)
        .post("/users")
        .send({ username:"Cat", email: "mrcat@email.com", password: "12345678", profile_picture: null });
      let user = await User.find()

      const token = createToken(user[0]._id)
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "I'm liked!" });


      
      const post = await Post.find()

      await request(app)
        .patch("/users/like")
        .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
        .send({post_id: post[0]._id, status: "like"})
        .expect(201)

      user = await User.find()

      expect(user[0].liked_posts).toHaveLength(1)
      expect(user[0].liked_posts).toEqual([post[0]._id.toString()])

    })

    it("adds multiple post id to users liked_post array", async () => {
      await request(app)
        .post("/users")
        .send({ username:"Cat", email: "mrcat@email.com", password: "12345678", profile_picture: null });
      let user = await User.find()

      const token = createToken(user[0]._id)
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "I'm liked!" });

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "I'm another liked post!" });

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "They liked me too!" });

      
      const post = await Post.find()

      for (let i = 0; i < post.length; i++) {
        await request(app)
          .patch("/users/like")
          .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
          .send({post_id: post[i]._id, status: "like"})
          .expect(201)
      }

      user = await User.find()

      expect(user[0].liked_posts).toHaveLength(3)
      expect(user[0].liked_posts).toEqual([post[0]._id.toString(), post[1]._id.toString(), post[2]._id.toString()])

    })

    it("removes post from liked_posts array when a post is unliked", async () => {
      await request(app)
        .post("/users")
        .send({ username:"Cat", email: "mrcat@email.com", password: "12345678", profile_picture: null });
      let user = await User.find()

      const token = createToken(user[0]._id)
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "I'm liked!" });


      
      const post = await Post.find()

      await request(app)
        .patch("/users/like")
        .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
        .send({post_id: post[0]._id, status: "like"})
        .expect(201)

      await request(app)
        .patch("/users/like")
        .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
        .send({post_id: post[0]._id, status: "unlike"})
        .expect(201)

      user = await User.find()

      expect(user[0].liked_posts).toHaveLength(0)
      expect(user[0].liked_posts).toEqual([])

    })

    test("when there are multiple posts in liked_posts array, unliking one post removes selected post only", async () => {
      await request(app)
        .post("/users")
        .send({ username:"Cat", email: "mrcat@email.com", password: "12345678", profile_picture: null });
      let user = await User.find()

      const token = createToken(user[0]._id)
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "I'm liked!" });

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "I'm another liked post!" });

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "They liked me too!" });

      
      const post = await Post.find()

      for (let i = 0; i < post.length; i++) {
        await request(app)
          .patch("/users/like")
          .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
          .send({post_id: post[i]._id, status: "like"})
          .expect(201)
      }

      await request(app)
          .patch("/users/like")
          .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
          .send({post_id: post[1]._id, status: "unlike"})
          .expect(201)

      user = await User.find()


      expect(user[0].liked_posts).toHaveLength(2)
      expect(user[0].liked_posts).toEqual([post[0]._id.toString(), post[2]._id.toString()])

    })

    test("when there are multiple posts are liked then unliked", async () => {
      await request(app)
        .post("/users")
        .send({ username:"Cat", email: "mrcat@email.com", password: "12345678", profile_picture: null });
      let user = await User.find()

      const token = createToken(user[0]._id)
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "I'm liked!" });

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "I'm another liked post!" });

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "They liked me too!" });

      const post = await Post.find()

      for (let i = 0; i < post.length; i++) {
        await request(app)
          .patch("/users/like")
          .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
          .send({post_id: post[i]._id, status: "like"})
          .expect(201)
      }

      for (let i = 0; i < post.length; i++) {
        await request(app)
          .patch("/users/like")
          .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
          .send({post_id: post[i]._id, status: "unlike"})
          .expect(201)
      }

      user = await User.find()

      expect(user[0].liked_posts).toHaveLength(0)
      expect(user[0].liked_posts).toEqual([])

    })

    test("when a post is liked and unliked multiple times", async () => {
      await request(app)
        .post("/users")
        .send({ username:"Cat", email: "mrcat@email.com", password: "12345678", profile_picture: null });
      let user = await User.find()

      const token = createToken(user[0]._id)
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "I'm liked!" });

      const post = await Post.find()

      for (let i = 0; i < 4; i++) {
        await request(app)
          .patch("/users/like")
          .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
          .send({post_id: post[0]._id, status: "like"})
          .expect(201)
    
        await request(app)
          .patch("/users/like")
          .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
          .send({post_id: post[0]._id, status: "unlike"})
          .expect(201)
      }

      await request(app)
          .patch("/users/like")
          .set({"Content-Type": "application/json", "Authorization": `Bearer ${token}`})
          .send({post_id: post[0]._id, status: "like"})
          .expect(201)

      user = await User.find()

      expect(user[0].liked_posts).toHaveLength(1)
      expect(user[0].liked_posts).toEqual([post[0]._id.toString()])

    })
  })
});
