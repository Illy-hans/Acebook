// require("../mongodb_helper");
const User = require("../../models/user");

jest.mock("../../models/user")

describe("A mock test to see if a user is created", () => {
    it("can save a user", async () => {
        
    User.prototype.save.mockResolvedValueOnce();

    // Mock the find method to return a user
    User.find.mockResolvedValueOnce([{
        email: "someone@example.com",
        password: "password",
        username: "Ang",
        profile_picture: null,
    }]);

    // Your test code here
    const user = new User({
        email: "someone@example.com",
        password: "password",
        username: "Ang",
        profile_picture: null,
    });

    await user.save();
    const users = await User.find();

    // Your assertions here
    expect(User.prototype.save).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    
    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password");
    expect(users[0].username).toEqual("Ang");
    expect(users[0].profile_picture).toEqual(null);
    });
});