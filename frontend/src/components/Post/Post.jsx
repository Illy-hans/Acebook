
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getComment } from "../../services/comments";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { ViewCommentButton } from "./ViewCommentButton";
import LikeButton from "../LikeButton";
import { getAllUserInfo } from "../../services/user";
import './Post.css';
import { getId, getUserDataByUserId } from "../../services/user";
import { deletePost } from "../../services/posts";


export const Post = (props) => {
  const [comments, setComments] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [viewComment, setCommentSection] = useState(false);
  const [likes, setLikes] = useState(props.post.likes);
  const [username, setUsername] = useState()
  const [image, setImage] = useState();
  const [profilePicture, setProfilePicture] = useState();
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const getPostById = (data, post_id) => {
    const comments = data.comments.filter((comment) => comment.post_id == post_id)
    setComments(comments)
  }

  const handleClickOnPost = async () => {
    
    const data = await getUserDataByUserId(token, props.post.user_id)
    const user = data.user
    navigate(`/profilepage/${user.username}`, 
    {state: {
      visiting_user_id: user._id,
      visiting_username: user.username, 
      visiting_profile_picture: user.profile_picture, 
      visiting_liked_posts: user.liked_posts}})
      window.location.reload(true)
  }

  const handleClickDelete = async () => {
    await deletePost(token, props.post._id)
    window.location.reload(true)
  }

  useEffect(() => {
    if (token) {
      getUserDataByUserId(token, props.post.user_id)
        .then((data) => {
          setUsername(data.user.username)
          if (data.user.profile_picture) {
              fetchProfileImage(data.user.profile_picture);
          }
        })


      getComment(token)
        .then((data) => {
          getPostById(data, props.post._id)
          setToken(data.token);
          window.localStorage.setItem("token", data.token);
          if (props.post.image) {
            fetchPostImage(props.post.image)
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      navigate("/posts");
    }
  }, []);

//   useEffect(() => {
//     if (token) {
//         getAllUserInfo(token)
//             .then((data) => {
//             setUser(data.user);
//             setToken(data.token);
//             window.localStorage.setItem("token", data.token);
//             if (data.user.profile_picture) {
//                 fetchProfileImage(data.user.profile_picture);
//             }
//             })
//     .catch((err) => {
//         console.error(err);
//         console.log(err)
//         });
//     }
// }, []);

  const fetchPostImage = async (imageName) => {
    try {
        // this makes a request to the server to fetch the image
        const response = await fetch(`http://localhost:3000/upload/${imageName}`);
        const blob = await response.blob();
        setImage(URL.createObjectURL(blob));
    } catch (error) {
        console.error('Error fetching image:', error);
    }
  };

  const fetchProfileImage = async (imageName) => {
    try {
        // this makes a request to the server to fetch the image
        const response = await fetch(`http://localhost:3000/upload/${imageName}`);
        const blob = await response.blob();
        setProfilePicture(URL.createObjectURL(blob));
    } catch (error) {
        console.error('Error fetching image:', error);
    }
};


  if (!token) {
    return;
  }

  return (
  <>
  <br/>
  
  <div className="messageBox">  


    <div className="feedPostSingle">

      <div className="profilePhoto">
        <img className="profileIconFeed" src={profilePicture} onClick={handleClickOnPost}/>
      <div/>
      {/* {props.user_id == props.post.user_id && <button onClick={handleClickDelete}>delet</button> }
      {props.user_id == props.post.user_id && 
      <input onClick={handleClickDelete} type="image" src="src/assets/menu.png" alt="Menu icon" multiple/>  } */}

      
      <div className="username-date-added">
      <div className="spanText">
        
          <span className="userName" onClick={handleClickOnPost}> {username} </span>
        
        
          <span className="datePost"> {props.date} </span>
        
        </div>
      </div>

    </div>


        <p className="messagePost">
            <span key={props.post._id}>{props.post.message}</span>
        </p>
        <div><img className="post-image" src={image} /></div>


    </div>  

  <div className="actions">

    <div className="actionSingle">
      <LikeButton likes={likes} post={props.post} user_id={props.user_id}/>
    </div>

    <div className="actionSingle">
      <ViewCommentButton setCommentSection={setCommentSection} viewComment={viewComment}/>
    </div>

  </div>
  
  <div className="commentsOpen">
    {viewComment && <div className="comment_section" role="comment_section">
      <CommentForm role="new-comment" post_id={props.post._id}/>
      <div className="comment" role="comment">
          {comments.toReversed().map((comment) => (
          <Comment comment={comment} key={comment._id} date={comment.time_of_comment} user_id={props.user_id}/>
          ))}

    </div>
    </div>}
  </div>
  </div>
      
  </>
  )

};

export default Post;
