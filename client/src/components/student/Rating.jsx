import React, { useState, useEffect } from 'react';

const Rating = ({ initialRating, onRate }) => {

    const [rating, setRating] = useState(initialRating || 0);
    const [hoverRating, setHoverRating] = useState(0); 

    const handleRating = (value) => {
        setRating(value);
        if (onRate) onRate(value);
    };

    useEffect(() => {
        if (initialRating) {
            setRating(initialRating);
        }
    }, [initialRating]);
    
    // Determine the color based on hover state (if rating is active) or current rating
    const getStarColor = (starValue) => {
        // If hovering, show the yellow up to the hovered star
        if (hoverRating > 0) {
            return starValue <= hoverRating ? 'text-yellow-400' : 'text-gray-300';
        }
        // Otherwise, show the persistent rating
        return starValue <= rating ? 'text-yellow-500' : 'text-gray-400';
    };

    return (
        // Enhanced Container: Using white background, border, stronger shadow, and fine-tuned padding
        <div 
            className="flex gap-1.5 bg-white border border-gray-200 p-2 rounded-xl shadow-md ring-1 ring-gray-100/70"
            onMouseLeave={() => setHoverRating(0)}
        > 
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                return (
                    <span
                        key={index}
                        className={`
                            text-2xl sm:text-3xl         // Slightly larger stars for emphasis
                            cursor-pointer 
                            transition-all duration-150 
                            ${getStarColor(starValue)} 
                            hover:scale-110             // Scale up slightly on hover
                            active:scale-90             // Scale down slightly on click/tap
                        `}
                        onClick={() => handleRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)} 
                    >
                        &#9733;
                    </span>
                );
            })}
        </div>
    );
};

export default Rating;