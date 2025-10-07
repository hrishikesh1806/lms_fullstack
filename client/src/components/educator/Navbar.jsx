import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation for potential future use
import { AppContext } from '../../context/AppContext';
import { UserButton, useUser } from '@clerk/clerk-react';

// NOTE: Assumes 'animate-pulse-slow' and 'animate-books-scroll' are defined in tailwind.config.js

// Renamed the component to avoid confusion if used in the same project as the Student one,
// but keeping the original name if you are replacing the file content.
const EducatorNavbar = ({ bgColor }) => {

    const location = useLocation(); // Useful if you add Educator-specific links later
    const { isEducator, navigate } = useContext(AppContext); // Added navigate for logo click
    const { user } = useUser();

    // Re-using the active/default link classes for consistency, though currently only one link exists
    const activeLinkClass = "text-orange-400 font-semibold";
    const defaultLinkClass = "text-white bg-white/10 hover:bg-white/20 transition duration-300 px-3 py-1 rounded-full border border-white/20";
    
    // Fallback bgColor is only used if isEducator is false, but we use the isEducator check in the return
    // We will ignore bgColor and enforce the dark style for the animated look.

    return isEducator && user && (
        // Start of Fragment to include the custom style tag
        <> 
            {/* Custom CSS for the attractive, high-contrast background animation */}
            <style jsx>{`
                @keyframes cosmic-shift {
                    /* Added blur for a deeper, volumetric shift effect */
                    0% { background-position: 0% 50%; filter: blur(0.5px); }
                    33% { background-position: 50% 100%; filter: blur(0px); }
                    66% { background-position: 100% 0%; filter: blur(0.5px); }
                    100% { background-position: 0% 50%; filter: blur(0px); }
                }
                .animate-cosmic-shift {
                    animation: cosmic-shift 30s ease-in-out infinite; /* Faster and more dramatic */
                }
            `}</style>
            
            {/* NAVBAR CONTAINER: Same dark, animated styling as the student navbar */}
            <div className={`relative flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-pink-700 py-2 bg-skyblue-950/90 shadow-2xl backdrop-blur-sm ring-1 ring-white/10
                             transition duration-700 hover:shadow-orange-500/50`}>
                
                {/* 1. NEW ANIMATED BACKGROUND LAYER (z-[1]) - Nebula Glow */}
                <div 
                    className="absolute inset-0 z-[1] opacity-90 mix-blend-lighten animate-cosmic-shift" 
                    style={{
                        backgroundImage: 'radial-gradient(circle at 10% 90%, rgba(236, 72, 153, 0.5) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(37, 99, 235, 0.5) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)',
                        backgroundSize: '500% 500%',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#030712' 
                    }}
                />

                {/* 2. EXISTING Books Scroll Layer (z-2) - Ensures book lines are on top of the nebula */}
                <div 
                    className="absolute inset-0 z-[2] opacity-20 mix-blend-screen animate-books-scroll" 
                    style={{
                        backgroundImage: `repeating-linear-gradient(90deg, 
                            rgba(255, 255, 255, 0.07) 0, rgba(255, 255, 255, 0.07) 1px, 
                            transparent 1px, transparent 40px)`,
                        backgroundSize: '80px 100%', 
                        backgroundRepeat: 'repeat',
                    }}
                />

                {/* Logo Wrapper (z-10) */}
                <div 
                    onClick={() => navigate('/')} // Added navigation on logo click
                    className="relative z-10 w-28 lg:w-32 cursor-pointer transition duration-500 hover:scale-[1.05] active:scale-[0.98] 
                                rounded-md p-1 bg-white shadow-lg shadow-white/40 animate-pulse-slow 
                                hover:rotate-1 hover:shadow-2xl hover:shadow-orange-400/70" 
                >
                    <img 
                        src={assets.logo} 
                        alt="Logo" 
                        className="w-full" 
                    />
                </div>
                
                {/* Educator Info and User Button (z-10) */}
                <div className="relative z-10 flex items-center gap-5">
                    {/* Simplified for Educator: Only Home/Student link */}
                    <Link 
                        to='/' 
                        className={defaultLinkClass} 
                        // The button for becoming an educator is replaced by a link back to the student homepage
                    >
                        Go to Student Site
                    </Link>

                    {/* Educator Greeting */}
                    <p className="hidden md:block text-white/80 font-medium">Hi! {user.fullName}</p>
                    
                    {/* User Profile Button */}
                    <UserButton 
                        appearance={{ 
                            elements: { 
                                userButtonAvatarBox: "w-10 h-10 ring-2 ring-orange-400 transition duration-300 hover:ring-white" 
                            } 
                        }} 
                    />
                </div>
            </div>
        </>
    );
};

export default EducatorNavbar;