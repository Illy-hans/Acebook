// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export const login = async (email, password) => {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);
  let data = await response.json();

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    
    return data.token;
  } else {
    // let data = await response.json()
    if (data.code == 1) {
      throw new Error(
        `Received status ${response.status} when logging in. Expected 201`,
        {cause: "Email not found"}
      );
    } else if (data.code == 2) {
      throw new Error(
        `Received status ${response.status} when logging in. Expected 201`,
        {cause: "Password incorrect"}
      )
    } else {
      throw new Error(
        `Received status ${response.status} when logging in. Expected 201`,
      )
    }
  }
};

export const signup = async (username, email, password, profile_picture) => {
    const payload = {
      username: username,
      email:email,
      password: password,
      profile_picture: profile_picture.name,
    }
    
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:  JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/users`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    return;
  } else {
    throw new Error(
      `Received status ${response.status} when signing up. Expected 201`,
      {cause: "Email is already in use"}
    );
  }
};

