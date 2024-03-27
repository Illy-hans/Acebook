import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, vi } from "vitest";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


import CommentForm from "../../src/components/Post/CommentForm";

vi.mock("react-router-dom", () => {
    const navigateMock = vi.fn();
    const useNavigateMock = () => navigateMock; 
    return { useNavigate: useNavigateMock };
});

const resetTestData = async () => {
    const requestOptions = {
        method: "DELETE",
        
    };

    const response = await fetch(`${BACKEND_URL}/comments`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch comments");
    }

    const data = await response.json();
    return data;
};

const submitComment = async () => {

    const user = userEvent.setup();

    const commentInputEl = screen.getByLabelText("Comment:")
    const submitEl = screen.getByRole("submit-button")

    await user.type(commentInputEl, "First");
    await user.click(submitEl)

}

describe("Comment Form", () => {
  
  // beforeAll(async () => {
  //   resetTestData()
  // })


  it("sends a post requestion when form is sent", () => {
    render(<CommentForm />);

    submitComment()

    const article = screen.getByRole("article");
    expect(article.textContent).toBe("test comment");
  });
});
