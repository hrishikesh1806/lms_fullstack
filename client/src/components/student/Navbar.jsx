import React, { useContext, useCallback } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
// Import necessary methods from Clerk
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'; 
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {

    const location = useLocation();

    const { backendUrl, isEducator, setIsEducator, navigate, getToken } = useContext(AppContext);

    // Destructure necessary functions from useClerk
    const { openSignIn, openSignUp, signOut } = useClerk(); 
    const { isSignedIn } = useUser(); // use isSignedIn for cleaner checks

    const becomeEducator = useCallback(async () => {
        // ... (existing logic remains unchanged)
        try {
            if (isEducator) {
                navigate('/educator');
                return;
            }
            const token = await getToken();
            const apiUrl = backendUrl + '/api/educator/update-role';
            
            const { data } = await axios.get(apiUrl, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            if (data.success) {
                toast.success(data.message);
                setIsEducator(true);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role.');
        }
    }, [isEducator, navigate, getToken, backendUrl, setIsEducator]);

    // This link/button style is used for all orange primary actions
    const orangeButtonBaseClass = "bg-orange-500 hover:bg-orange-600 transition duration-300 text-white font-semibold rounded-full";
    
    // Specific styles for logged-in navigation links/buttons (compact)
    const navButtonClass = `${orangeButtonBaseClass} px-3 py-1 text-sm`;
    
    // Specific style for the unauthenticated sign-in button (larger)
    const signInButtonClass = `${orangeButtonBaseClass} px-5 py-2 text-sm shadow-lg hover:shadow-orange-400/50 hover:scale-[1.05]`;
    
    // Style for the secondary action buttons (Login/Logout/Create Account)
    const secondaryAuthButtonClass = "bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold rounded-full px-3 py-2 text-sm";


    return (
        <> 
            {/* NAVBAR CONTAINER */}
            <div className={`fixed top-0 z-50 w-full flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-pink-700 py-2 
                             bg-gray-900 
                             bg-gradient-to-l from-gray-950 to-blue-700 
                             shadow-2xl ring-1 ring-white/10`}>
                
                {/* Logo Wrapper (Static) */}
                <div 
                    onClick={() => navigate('/')} 
                    className="relative z-10 w-28 lg:w-32 cursor-pointer transition duration-500 hover:scale-[1.05] active:scale-[0.98] 
                                  rounded-md p-1 bg-white shadow-lg shadow-white/40" 
                >
                    <img 
                        src={assets.logo} 
                        alt="Logo" 
                        className="w-full" 
                    />
                </div>
                
                {/* Desktop Navigation (z-10) */}
                <div className="relative z-10 md:flex hidden items-center gap-5">

                    {/* Left side actions (Educator / Enrollments) - Only visible when signed in */}
                    {isSignedIn && (
                        <div className="flex items-center gap-5">
                            <button 
                                type="button" 
                                onClick={becomeEducator}
                                className={navButtonClass} 
                            >
                                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                            </button>
                            <span className="text-white/50">|</span> 
                            <Link 
                                to='/my-enrollments' 
                                className={location.pathname === '/my-enrollments' ? `${navButtonClass} bg-orange-600` : navButtonClass}
                            >
                                My Enrollments
                            </Link>
                        </div>
                    )}
                    
                    {/* User Authentication Status */}
                    <div className='flex items-center gap-3'>
                        {!isSignedIn 
                            ? (
                                // Logged OUT: Show Create Account and Login buttons
                                <>
                                    <button 
                                        type="button" 
                                        onClick={() => openSignUp()} 
                                        className={secondaryAuthButtonClass} // Secondary button style
                                    >
                                        Create Account
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => openSignIn()} 
                                        className={signInButtonClass} // Primary button style
                                    >
                                        Login
                                    </button>
                                </>
                            )
                            : (
                                // Logged IN: Show Logout button and User Avatar
                                <>
                                    <button
                                        type="button"
                                        onClick={() => signOut()}
                                        className={secondaryAuthButtonClass} // Secondary button style
                                    >
                                        Logout
                                    </button>
                                    <UserButton 
                                        appearance={{ 
                                            elements: { 
                                                userButtonAvatarBox: "w-10 h-10 ring-2 ring-orange-400 transition duration-300 hover:ring-white" 
                                            } 
                                        }} 
                                    />
                                </>
                            )
                        }
                    </div>
                </div>
                
                {/* Mobile Navigation (z-10) */}
                <div className='relative z-10 md:hidden flex items-center gap-2 sm:gap-5'>
                    
                    {/* Logged-In User Buttons (Mobile) */}
                    {isSignedIn && (
                        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
                            <button 
                                type="button" 
                                onClick={becomeEducator} 
                                className={navButtonClass}
                            >
                                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                            </button>
                            <span className="text-white/50">|</span>
                            <Link 
                                to='/my-enrollments' 
                                className={location.pathname === '/my-enrollments' ? `${navButtonClass} bg-orange-600` : navButtonClass}
                            >
                                My Enrollments
                            </Link>
                        </div>
                    )}
                    
                    {/* User Authentication Status (Mobile) */}
                    {isSignedIn
                        ? (
                            // Logged In: Show Logout icon and User Profile Button
                            <>
                                <button 
                                    type="button" 
                                    onClick={() => signOut()} 
                                    aria-label="Logout"
                                    className="transition duration-300 hover:scale-110 active:scale-90"
                                >
                                    {/* You need a logout icon here, or just show the user button */}
                                    <img src={assets.logout_icon} alt="Logout icon" className="w-6 h-6 filter invert" /> 
                                </button>
                                <UserButton 
                                    appearance={{ 
                                        elements: { 
                                            userButtonAvatarBox: "w-8 h-8 ring-2 ring-orange-400 transition duration-300 hover:ring-white" 
                                        } 
                                    }} 
                                />
                            </>
                        )
                        : (
                            // Logged Out: Show Mobile Sign In Icon Button (Keep it unified on mobile for space)
                            <button 
                                type="button" 
                                onClick={() => openSignIn()} 
                                aria-label="Log In / Create Account"
                                className="transition duration-300 hover:scale-110 active:scale-90"
                            >
                                <img src={assets.user_icon} alt="User icon" className="w-6 h-6 filter invert" /> 
                            </button>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default Navbar;