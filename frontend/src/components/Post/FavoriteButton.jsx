import React, { useState } from "react";


const FavoriteButton = () => {
    const [isFavorite, setIsFavorite] = useState(false);
    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <div>
            <button onClick={handleFavoriteClick}>
                {isFavorite ? <b>👎 DISLIKE</b> : <b>👍 LIKE </b>}
            </button>

            
        </div>
        );
};

export default FavoriteButton;