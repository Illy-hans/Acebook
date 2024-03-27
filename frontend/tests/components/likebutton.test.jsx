import { render, screen } from "@testing-library/react";

import LikeButton from "../../src/components/LikeButton";
import Post from "../../src/components/Post/Post";

describe("LikeButton", () => {
  test("displays the number of likes on post", () => {
    const testPost = { _id: "123", message: "", likes: ['1','2','sdfs'] };
    render(<Post post={testPost} />);

    const button = screen.getByText("3 Likes");
    expect(button.textContent).toBe("3 Likes");
  });
});
