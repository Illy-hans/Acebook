import './ViewCommentButton.css';
export const ViewCommentButton = (props) => {

    const handleClick = (event) => {
        event.preventDefault();
        props.setCommentSection(!props.viewComment)
    }

    return (
        <div className='boxButtonComment'>
            <button className="commentButton" type="button" onClick={handleClick}>Comments</button>
        </div>
    )
}