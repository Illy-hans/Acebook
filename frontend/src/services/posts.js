// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getPosts = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
};

export const deletePost = async (token, post_id) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/${post_id}`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to find posts");
  }

  const data = await response.json();
  return data;
}
  
// posts the posts image to the server 
export const uploadPostImage = async (image) => {

  const formData = new FormData();
  formData.append('image', image);

  const requestOptions = {
      method: "POST",
      body: formData,
      }
  console.log(formData)

  const response = await fetch(`${BACKEND_URL}/upload/image`, requestOptions);

  if (response.status !== 200) {
      // If profile picture upload fails, throw an error
      throw new Error(`Received status ${response.status} when uploading profile picture. Expected 200`);
  }
}
