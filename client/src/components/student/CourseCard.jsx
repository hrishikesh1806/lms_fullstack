import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  const finalPrice = (course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2);
  const originalPrice = course.coursePrice.toFixed(2);
  const hasDiscount = course.discount > 0;

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={'/course/' + course._id}
      className="block rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm
                 transition-all duration-300 ease-in-out overflow-hidden group
                 transform hover:scale-[1.03] hover:-translate-y-2
                 hover:shadow-[0_25px_50px_-12px_rgba(0,0,80,0.4)]"
    >
      {/* Image with Hover Zoom */}
      <div className="h-44 overflow-hidden rounded-t-2xl">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={course.courseThumbnail}
          alt={course.courseTitle}
        />
      </div>

      {/* Content */}
      <div className="p-5 text-left">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 line-clamp-2">
          {course.courseTitle}
        </h3>

        <p className="text-sm text-gray-500 mb-2">
          {course.educator ? course.educator.name : 'Unknown Educator'}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <p className="font-semibold text-yellow-600">
            {calculateRating(course)}
          </p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                className="w-4 h-4"
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                alt="rating star"
              />
            ))}
          </div>
          <p className="text-gray-400 text-xs">({course.courseRatings.length})</p>
        </div>

        {/* Pricing */}
        <div className="flex items-end gap-2 mt-2">
          <p className="text-2xl font-black text-indigo-700">
            {currency}{finalPrice}
          </p>
          {hasDiscount && (
            <p className="text-sm text-gray-400 line-through mb-[2px]">
              {currency}{originalPrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
