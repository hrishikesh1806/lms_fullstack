import React from 'react';
import { assets } from '../../assets/assets';

const CallToAction = () => {
    return (
        <div 
            className='relative overflow-hidden flex flex-col items-center 
                         bg-gray-950 text-white 
                         // KEY CHANGE: Increased min-h to 700px and padding to py-60
                         min-h-[700px] py-60 mt-[-2px] w-full' 
        >
            
            {/* -------------------------------------------------------- */}
            {/* 1. VIDEO BACKGROUND ELEMENT (z-0) */}
            <video 
                autoPlay 
                loop 
                muted 
                src={assets.getstartedVideo}
                className="absolute inset-0 z-0 w-full h-full object-cover object-center"
            >
                Your browser does not support the video tag.
            </video>

            {/* -------------------------------------------------------- */}
            {/* 2. OVERLAY LAYER (z-10) */}
            <div className="absolute inset-0 z-10 bg-black/50"></div> 
            
            {/* 3. Main Content Wrapper (z-20) */}
            <div className="relative z-20 flex flex-col items-center max-w-screen-lg px-4 sm:px-6 lg:px-8 mx-auto">
                <h1 className='md:text-5xl text-3xl text-white font-bold text-center leading-tight mt-0 mb-3'>
                    Build anything, anytime, anywhere
                </h1>
                <p className='text-gray-300 sm:text-lg max-w-xl text-center mb-6'>
                    An infinite canvas for builders and innovators worldwide.
Discover, share, and launch your imagination into reality..
                </p>
                <div className='flex items-center font-medium gap-6'>
                    <button className='px-6 py-3 rounded-md bg-orange-500 hover:bg-orange-600 transition duration-300 text-white font-semibold inline-block'>
                        Get started
                    </button>
                    <button className='flex items-center gap-2 text-white hover:text-blue-400 transition-colors group'>
                        Learn more
                        <img 
                            src={assets.arrow_icon} 
                            alt="arrow_icon" 
                            className='w-4 h-4 filter invert transition-transform group-hover:translate-x-1' 
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CallToAction;