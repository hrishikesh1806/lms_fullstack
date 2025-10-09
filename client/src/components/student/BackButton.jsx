// File: src/components/student/BackButton.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    // The useNavigate hook is from react-router-dom, used to navigate
    const navigate = useNavigate();

    const handleBack = () => {
        // navigate(-1) goes back to the previous route in history (the Course List page)
        navigate(-1); 
        // Optional: Scroll to the top of the new page
        window.scrollTo(0, 0); 
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-base 
                       bg-indigo-600 text-white font-medium rounded-lg 
                       shadow-lg hover:bg-indigo-700 transition-all duration-200 
                       transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Project List
        </button>
    );
};

export default BackButton;