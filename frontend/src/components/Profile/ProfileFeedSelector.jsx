const ProfileFeedSelector = (props) => {

    const handlePostFeedClick = () => {
        props.setFeed("Posts")
    }

    const handleLikedFeedClick = () => {
        props.setFeed("Liked")
    }

    return (
        <>
            <div class='feed-selector-button'><h4><a class="feed-selector-link" onClick={handlePostFeedClick}>Posts</a></h4></div>
            <div class='feed-selector-button'><h4><a class="feed-selector-link" onClick={handleLikedFeedClick}>Liked</a></h4></div>
        </>
    )
}

export default ProfileFeedSelector