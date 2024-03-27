// docs: https://github.com/motdotla/dotenv#%EF%B8%8F-usage
const UsersController = require("./controllers/users.js");

if (process.env.NODE_ENV != "test") {
  require("dotenv").config();
} else {
  const dotenv = require("dotenv");
  dotenv.config({ path: "./.env.test" });
  UsersController.clearTestData()
}

const app = require("./app.js");
const { connectToDatabase } = require("./db/db.js");

const listenForRequests = () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("Now listening on port", port);
  });
};

connectToDatabase().then(() => {
  listenForRequests();
});
