const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');
const path = require("node:path");

// API Routes
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const authenticationRouter = require("./routes/authentication");
const commentRouter = require("./routes/comment");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// Allow requests from any client
// docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// docs: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json());

app.use("/users", usersRouter, tokenChecker);
app.use("/posts", tokenChecker, postsRouter);
app.use("/tokens", authenticationRouter);
app.use("/comments", tokenChecker, commentRouter);

const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, 'public/Images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer ({
  storage: storage 
})

app.post('/upload/profile', upload.single('profile_picture'), (res, req ) => {
  console.log("I am the profile_picture file:", req.file)
})

app.post('/upload/image', upload.single('image'), (res, req) => {
  console.log("I am the post image:", file)
})

// serves images from the back-end
app.get('/upload/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public', 'images', imageName);
  res.sendFile(imagePath);
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = app;
