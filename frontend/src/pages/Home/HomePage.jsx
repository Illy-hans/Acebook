
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

import "./HomePage.css";

export const HomePage = () => {
  return (

    <>
    <div className="bodyHome">

    
        {/* Left Column */}
        <div className="content-info">
          <h1>Welcome to Acebook!</h1>
          <h3>Acebook helps you connect and share with the people in your life.</h3>
        </div>
         {/* Right Column */}
        <div className="content-login">
            <div className="buttons-box">

              <div className="btn-login">
                <Link to="/login" className="btn-login-link">Log In</Link>
              </div>


              <div className="btn-signup">
                <Link to="/signup" className="btn-signup-link">Create new account</Link>
              </div>

            </div>

        </div>

        </div>


    </>

  );
};
