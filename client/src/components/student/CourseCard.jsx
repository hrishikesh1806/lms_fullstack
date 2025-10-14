import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {

    const { currency, calculateRating } = useContext(AppContext);
    
    // Calculate final price and original price for the display
    const finalPrice = (course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2);
    const originalPrice = course.coursePrice.toFixed(2);
    const hasDiscount = course.discount > 0;

    return (
        // 1. Overall Link (Card Container): Removed 'border border-gray-100/50'
        <Link 
            onClick={() => scrollTo(0, 0)} 
            to={'/course/' + course._id} 
            className="block rounded-xl shadow-xl bg-white 
                        transition-all duration-300 ease-in-out 
                        overflow-hidden group
                        
                        // Stronger 3D Hover Effect
                        transform hover:scale-[1.03] hover:-translate-y-2 // Stronger lift
                        
                        // Intense Golden Shadow on Hover
                        hover:shadow-3xl hover:shadow-yellow-500/70 // More intense shadow
                        " 
        >
            {/* 2. Image Container with Hover Zoom */}
            <div className="h-40 overflow-hidden rounded-t-xl">
                <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={course.courseThumbnail} 
                    alt={course.courseTitle} 
                />
            </div>

            {/* 3. Content Area - Using solid white background for strong contrast and depth perception */}
            <div className="p-4 text-left bg-white">
                
                {/* Title - Larger and more prominent */}
                <h3 className="text-xl font-extrabold text-gray-900 mb-1 line-clamp-2">
                    {course.courseTitle}
                </h3>
                
                {/* Instructor - Subtler, in gray */}
                <p className="text-sm text-gray-500 mb-2">
                    {course.educator.name}
                </p>
                
                {/* Rating - Highlighted */}
                <div className="flex items-center space-x-2 mb-3">
                    {/* Applying a slight text shadow to the rating for subtle depth */}
                    <p className="font-bold text-yellow-600 drop-shadow-sm">{calculateRating(course)}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                className="w-4 h-4" // Slightly larger stars
                                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                                alt="rating star"
                            />
                        ))}
                    </div>
                    <p className="text-gray-500 text-sm">({course.courseRatings.length})</p>
                </div>
                
                {/* Price Section - Clear Price Contrast */}
                <div className='flex items-end gap-2 mt-2'>
                    {/* Final Price: Large, Bold, and Accent Color */}
                    <p className="text-2xl font-black text-green-600">
                        {currency}{finalPrice}
                    </p>
                    
                    {/* Original Price (if discounted): Strikethrough, gray, smaller */}
                    {hasDiscount && (
                        <p className="text-sm text-gray-400 line-through mb-[2px]">
                            {currency}{originalPrice}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CourseCard;