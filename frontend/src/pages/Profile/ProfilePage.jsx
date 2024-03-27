
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../../services/posts.js";
import { getId } from "../../services/user.js";
import "./ProfilePage.css";
import Post from "../../components/Post/Post.jsx";
import ProfileFeedSelector from "../../components/Profile/ProfileFeedSelector.jsx";
import { getAllUserInfo, getUserDataByUserId } from "../../services/user.js";



export const ProfilePage = () => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [pageUserId, setPageUserId] = useState('');
  const [activeUserId, setActiveUserId] = useState() 
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  let [feed, setFeed] = useState("Posts");
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (token) {
        getAllUserInfo(token)
            .then((data) => {
            setUser(data.user);
            setToken(data.token);
            window.localStorage.setItem("token", data.token);
            if (data.user.profile_picture) {
                fetchImage(data.user.profile_picture);
            }
            })
    .catch((err) => {
        console.error(err);
        console.log(err)
        });
    }
}, []);

  const getUsersPosts = (posts, pageUserId) => {
    console.log(pageUserId)
    return posts.filter((post) => post.user_id == pageUserId)
  }

  const getLikedPosts = async (posts, user_id) => {
    const data = await getUserDataByUserId(token, user_id);
    const user_liked_list = data.user.liked_posts
    console.log(posts)

    return posts.filter((post) => user_liked_list.includes(post._id));
  };

  useEffect(() => {
    if (token) {
      getId(token)
      .then((data) => {
        setActiveUserId(data.user_id);
        let profile_page_user_data = "";
        if (state) {
          profile_page_user_data = state.visiting_user_id;
          setPageUserId(state.visiting_user_id);
        } else {
          profile_page_user_data = data.user_id;
          setPageUserId(data.user_id);
        }
        return profile_page_user_data
      })
      .then((currentPageUserId) => {
        getPosts(token)
          .then((data) => {
            
            setToken(data.token);

            if (feed == "Posts") {
              let usersPosts = getUsersPosts(data.posts, currentPageUserId);
              console.log(usersPosts)
              setPosts(usersPosts);
            } else if (feed == "Liked") {
              getLikedPosts(data.posts, currentPageUserId)
              .then((likedPosts) => {console.log(likedPosts)
              setPosts(likedPosts)
              });
            }

            window.localStorage.setItem("token", data.token);
          });
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [feed]);

  if (!token) {
    return;
  }

  const fetchImage = async (imageName) => {
    try {
        // this makes a request to the server to fetch the image
        const response = await fetch(`http://localhost:3000/upload/${imageName}`);
        const blob = await response.blob();
        setProfilePicture(URL.createObjectURL(blob));
    } catch (error) {
        console.error('Error fetching image:', error);
    }
};

  return (
    <div className="profilepage">
      <Navbar />
      <div className="bio-box">
        <div className="bio-header"><h2>About Me</h2><div class='profile-pic-container'><img class="bio-profile-pic" src={profilePicture} /></div></div>
        <hr></hr>
        <div className="profile-bio">
          <p>
            {user.bio || "Your bio goes here!"}
          </p>
        </div>
      </div>
      {/* profile nav bar - (posts, liked_posts) */}
      <div class="feed-selector-container">
        <div class ="feed-selector-button-container"><ProfileFeedSelector feed={feed} setFeed={setFeed} />
      </div>
      <div className="feed" role="feed">
        {posts.toReversed().map((post) => (
          <Post
            post={post}
            key={post._id}
            date={post.time_of_post}
            user_id={activeUserId}
          />
        ))}
      </div>
    </div>
    <div className="credits">
      <a href="https://www.flaticon.com/free-icons/heart"></a>
    </div>
    </div>
  );
};