// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getComment = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(`${BACKEND_URL}/comments`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch comments");
    }

    const data = await response.json();
    return data;
};

export const deleteComment = async (token, comment_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await fetch(`${BACKEND_URL}/comments/${comment_id}`, requestOptions);
  
    if (response.status !== 200) {
      throw new Error("Unable to find comment");
    }
  
    const data = await response.json();
    return data;
  }