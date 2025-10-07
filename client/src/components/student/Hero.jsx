import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from '../../components/student/SearchBar';

const Hero = () => {
    return (
        <div 
            className="relative flex flex-col items-center justify-center w-full min-h-[730px] md:pt-80 pt-32 px-7 md:px-0 space-y-7 text-center 
                        text-white overflow-hidden border-b-0 pb-0 mb-0" 
        >
            
            {/* 1. VIDEO BACKGROUND ELEMENT (z-10) */}
            <video 
                autoPlay 
                loop 
                muted 
                src={assets.heroVideo}
                className="absolute z-10 w-auto min-w-full min-h-full max-w-none object-cover"
            >
                Your browser does not support the video tag.
            </video>


            {/* 2. OVERLAY LAYER (z-20) */}
            {/* KEY CHANGE: Reduced darkness from bg-black/60 to bg-black/40 */}
            <div className="absolute inset-0 z-20 bg-black/40"></div>

            
            {/* 3. CONTENT (z-40) */}
            <h1 className="relative z-40 md:text-home-heading-large text-home-heading-small font-bold text-white max-w-3xl mx-auto drop-shadow-lg">
                Your knowledge journey
                <span className="text-orange-400 drop-shadow-md"> designed by you..</span>
                <img 
                    src={assets.sketch} 
                    alt="sketch" 
                    className="md:block hidden absolute -bottom-7 right-0 filter invert contrast-500" 
                />
            </h1>
            <p className="relative z-40 md:block hidden text-gray-300 max-w-2xl mx-auto">
                Unlock world-class courses and personalized learning paths tailored to your career goals, on any schedule, anywhere.
            </p>
            <p className="relative z-40 md:hidden text-gray-300 max-w-sm mx-auto">
                Unlock world-class courses and personalized learning paths tailored to your career goals, on any schedule, anywhere...
            </p>
            <SearchBar />
        </div>
    );
};

export default Hero;