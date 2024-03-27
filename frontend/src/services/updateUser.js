const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 

export const updateUserInfo = async (username, email, password, profile_picture, token) => {
    
    const payload = {
        username: username,
        email: email,
        password: password,
        profile_picture: null,
    };
        if (profile_picture) {
            payload.profile_picture = profile_picture.name
        }

    const requestOptions = {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    };
    console.log(JSON.stringify(payload));

    const response = await fetch(`${BACKEND_URL}/users`, requestOptions);

    if (response.status === 200) {
        return;
    } else {
        throw new Error(
            `Received status ${response.status} when updating details. Expected 200`,
            );
        }
}

// This function async adds the image to the server 
export const updateImage = async (profile_picture) => {

    const formData = new FormData();
    formData.append('profile_picture', profile_picture);

    const requestOptions = {
        method: "POST",
        body: formData,
        }
    console.log(formData)

    const response = await fetch(`${BACKEND_URL}/upload/profile`, requestOptions);

    if (response.status !== 200) {
        // If profile picture upload fails, throw an error
        throw new Error(`Received status ${response.status} when uploading profile picture. Expected 200`);
    }
}