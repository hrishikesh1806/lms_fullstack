import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from '../../components/student/SearchBar';

const Hero = () => {
    return (
        // KEY CHANGE: Removed md:pt-80 pt-32 from the main container.
        // It now serves only as the relative container for the absolute children.
        <div
            className="relative flex flex-col items-center justify-start w-full min-h-[730px]
                       px-7 md:px-0 text-white overflow-hidden border-b-0 pb-0 mb-0"
        >

            {/* 1. BACKGROUND LAYERS WRAPPER (VIDEO & OVERLAY) */}
            {/* This wrapper ensures the video and overlay start at the absolute top of the Hero div (i.e., the viewport)
                and are covered by the fixed Navbar (z-50) */}
            <div className="absolute inset-0 z-10">
                {/* 1.1 VIDEO BACKGROUND ELEMENT (z-10) */}
                <video
                    autoPlay
                    loop
                    muted
                    src={assets.heroVideo}
                    // Use inset-0 for full coverage of the parent (the new z-10 div)
                    className="absolute inset-0 w-auto min-w-full min-h-full max-w-none object-cover"
                >
                    Your browser does not support the video tag.
                </video>


                {/* 1.2 OVERLAY LAYER (z-20) */}
                {/* Ensure the overlay covers the video completely */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            
            {/* 2. CONTENT WRAPPER (z-40) */}
            {/* The content wrapper must be relative and have the top padding to push the text down below the Navbar */}
            <div className="relative z-40 flex flex-col items-center justify-center w-full md:pt-80 pt-32 space-y-7 text-center">
                <h1 className="md:text-home-heading-large text-home-heading-small font-bold text-white max-w-3xl mx-auto drop-shadow-lg">
                    Your knowledge journey
                    <span className="text-orange-400 drop-shadow-md"> designed by you..</span>
                    <img 
                        src={assets.sketch} 
                        alt="sketch" 
                        className="md:block hidden absolute -bottom-7 right-0 filter invert contrast-500" 
                    />
                </h1>
                <p className="md:block hidden text-gray-300 max-w-2xl mx-auto">
                    Unlock world-class projects and personalized learning paths tailored to your career goals, on any schedule, anywhere.
                </p>
                <p className="relative z-40 md:hidden text-gray-300 max-w-sm mx-auto">
                    Unlock world-class projects and personalized learning paths tailored to your career goals, on any schedule, anywhere...
                </p>
                <SearchBar />
            </div>
        </div>
    );
};

export default Hero;