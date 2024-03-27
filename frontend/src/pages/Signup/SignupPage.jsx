import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "./SignupPage.css";
import { signup } from "../../services/authentication";
import { updateImage } from "../../services/updateUser";
import { login } from "../../services/authentication";

export const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile_picture, setProfilePicture] = useState();

  const [signUpError, setError] = useState();
  const [imageURL, setImageURL] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(username, email, password, profile_picture)
      .then(updateImage(profile_picture))
      const token = await login(email, password);
      window.localStorage.setItem("token", token);
      console.log("redirecting...:");
      navigate("/posts");
 
    } catch (err) {
      console.error(err);
      setError(err.cause)
      navigate("/signup");
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
    setImageURL(URL.createObjectURL(file));
  };

  return (

    <>

      <div className="signup-box">

        {/* TITLE */}
        <h2>Create Account</h2>

        {/* FORM */}
        <form className="content-signup" action='/upload' encType="multipart/form-data" onSubmit={handleSubmit}>

          {/* USERNAME FORM */}
          {/* <label htmlFor="username">Username:</label> */}
            <input
              className="input-sg"
              placeholder="Username"
              id="username"
              type="text"
              // value={username}
              onChange={handleUsernameChange}
            required />

            {/* EMAIL FORM */}
            {/* <label htmlFor="email">Email:</label> */}
            <input
              className="input-sg"
              placeholder="Email"
              id="email"
              type="email"
              pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
              // value={email}
              onChange={handleEmailChange}
            required />

            {/* ERROR */}
            {signUpError && <div className="invalid-signup" role="invalid-signup">{signUpError}</div>}

            {/* PASSWORD FORM */}
            {/* <label htmlFor="password">Password:</label> */}
            <input
              className="input-sg"
              placeholder="A strong password"
              id="password"
              type="password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
              // value={password}
              onChange={handlePasswordChange}
            required />

            {/* PICTURE FORM */}
            {/* <label className="label-picture"  htmlFor="profile_picture">Add Profile Picture:</label> */}
            <label className="picture" htmlFor="profile_picture">
              <input
                id="profile_picture"
                type="file"
                name="profile_picture"
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
              
              Upload Profile Picture

            </label>
            
            <div className="signup-image">
              <img className="input-image-signup" src={imageURL}/>
            </div>

            {/* BUTTON SUBMIT */}
            <input className="btn btn-signup" role="submit-button" id="submit" type="submit" value="Create!" />

        </form>

            {/* BUTTON LOGIN */}
            <hr />
            <button className="btn btn-login">
                <Link to="/login" className="btn">Log In</Link>
            </button>

      </div>
    </>

  );
};

