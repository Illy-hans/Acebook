

import { useState } from "react";

import './LikeButton.css';

import { updateUsersLike } from "../services/user";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const LikeButton = (props) => {
  const [numberOfLikes, setNumberOfLikes] = useState(props.likes.length);
  const [likeList, setLikeList] = useState(props.likes);
  console.log(`Like list on load: ${likeList}`);

  const handleClick = async () => {
    const token = window.localStorage.getItem("token");
    console.log(`Like list when clicked: ${likeList}`);

    if (likeList.indexOf(props.user_id) === -1) {
      setNumberOfLikes(numberOfLikes + 1);
      likeList.push(props.user_id);
      updateUsersLike(token, props.post._id, "like");
    } else {
      setNumberOfLikes(numberOfLikes - 1);
      likeList.splice(likeList.indexOf(props.user_id), 1);
      updateUsersLike(token, props.post._id, "unlike");
    }
    fetch(`${BACKEND_URL}/posts/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: props.post._id }),
    });
  };

  return (
    <div className="likeContainer">

    {likeList.indexOf(props.user_id) === -1 ? 
        <input onClick={handleClick} type="image" src="src/assets/not_liked.png" alt="Not Liked Icon" /> : 
        <input onClick={handleClick} type="image" src="src/assets/liked.png" alt="Liked Icon" />}
        <span className="countLike">{numberOfLikes} Likes</span>
</div>
  );
};

export default LikeButton;