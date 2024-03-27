import { render, screen } from "@testing-library/react";

import User from "../../../frontend/src/components/User/User"

describe("User", () => {
    test("displays user information", () => {
        const testUser = {
        _id: "123", 
        username: "test user",
        profile_pic: "/path/to/profile_pic.jpg",
        likedPosts: ["Post 1", "Post 2"],
        };

        render(<User user={testUser} />);
        
        const username = screen.getByText("test user");
        const image = screen.getByAltText("Profile Picture")
        const likedpost1 = screen.getByText("Post 1")
        const likedpost2 = screen.getByText("Post 2")
        
        expect(image.textContent).toEqual("")
        expect(username.textContent).toEqual("test user"); 
        expect(likedpost1.textContent).toEqual("Post 1");
        expect(likedpost2.textContent).toEqual("Post 2")
        
        });
});
