import { render, screen } from "@testing-library/react";

import Comment from "../../src/components/Post/Comment";

describe("Comment", () => {
  test("displays the message as an article", () => {
    const testComment = { _id: "123", message: "test comment" };
    render(<Comment comment={testComment} />);

    const article = screen.getByRole("article");
    expect(article.textContent).toBe("test comment");
  });
});
