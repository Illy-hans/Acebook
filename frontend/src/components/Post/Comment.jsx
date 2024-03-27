import './Comment.css';
import { useEffect, useState } from "react";
import { getUserDataByUserId } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { deleteComment } from "../../services/comments";


const Comments = (props) => {
    const [token, setToken] = useState(window.localStorage.getItem("token"))
    const [username, setUsername] = useState()
    const navigate = useNavigate();


    const handleClickOnComment = async () => {
        const data = await getUserDataByUserId(token, props.comment.user_id)
        const user = data.user
        console.log(user)
        navigate(`/profilepage/${user.username}`, 
            {state: {
            visiting_user_id: user._id,
            visiting_username: user.username, 
            visiting_profile_picture: user.profile_picture, 
            visiting_liked_posts: user.liked_posts}})
        window.location.reload(true)
    }

    const handleClickDelete = async () => {
        await deleteComment(token, props.comment._id)
        window.location.reload(true)
    }

    useEffect(() => {
        if (token) {
            getUserDataByUserId(token, props.comment.user_id)
              .then((data) => {
                setUsername(data.user.username)
              })
        }
    })

    return (
        <>
    <br/>
        <div className='boxComment'>
            <div className='commentSpace'>
                {/* {check css for spantext} */}
                {/*{props.user_id == props.comment.user_id && <button onClick={handleClickDelete}>deleee</button>}
                {props.user_id == props.post.user_id && 
                    <input onClick={handleClickDelete} type="image" src="src/assets/menu.png" alt="Menu icon" multiple/>  } */}
                <img style={{height: "40px"}} src="src/assets/profile.png" onClick={handleClickOnComment}/>
                <div className='spanText'>
                    <span onClick={handleClickOnComment}>{username}</span>
                </div>
                <p className="messageComment">
                    <span key={props.comment._id}>{props.comment.message}</span>
                </p>
                <p className="dateComment">
                    <span>{props.date}</span>
                </p>           
            </div>
        </div>
    </>
    );
};

export default Comments;
