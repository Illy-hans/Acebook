const User = (props) => {
    return (
        <>
        <div key={props.user._id}>
            <p>{props.user.username}</p>
            <img src={props.user.profile_pic} alt="Profile Picture" />
            <ul>
                {props.user.likedPosts.map((post, index) => (
                    <li key={index}>{post}</li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default User; 