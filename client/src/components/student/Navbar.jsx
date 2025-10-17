import React, { useContext, useCallback, useState, useRef, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'; 
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {

    const [showLoginOptions, setShowLoginOptions] = useState(null); 
    const dropdownRef = useRef(null);
    const location = useLocation();
    const { backendUrl, isEducator, setIsEducator, navigate, getToken } = useContext(AppContext);
    const { openSignIn, openSignUp, signOut } = useClerk(); 
    const { isSignedIn } = useUser(); 

    // Handle outside clicks to close the dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLoginOptions(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    // Role-Specific Authentication Handlers
    const handleAuth = (type, rolePath) => {
        setShowLoginOptions(null); 
        const redirectPath = `${window.location.origin}${rolePath}`; 
        
        if (type === 'login') {
            openSignIn({ redirectUrl: redirectPath });
        } else if (type === 'signup') {
            openSignUp({ redirectUrl: redirectPath });
        }
    };


    const becomeEducator = useCallback(async () => {
        try {
            if (!isSignedIn) {
                 toast.error('Please log in first to become an educator.');
                 return;
            }
            if (isEducator) {
                navigate('/educator');
                return;
            }
            
            // This entire block is now functionally redundant if the button is hidden from students.
            // However, we keep the role update logic in case you add another link elsewhere later.
            const token = await getToken();
            const apiUrl = backendUrl + '/api/educator/update-role';
            
            const { data } = await axios.get(apiUrl, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            if (data.success) {
                toast.success(data.message);
                setIsEducator(true); 
                navigate('/educator');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role.');
        }
    }, [isEducator, navigate, getToken, backendUrl, setIsEducator, isSignedIn]);

    // Style variables
    const orangeButtonBaseClass = "bg-orange-500 hover:bg-orange-600 transition duration-300 text-white font-semibold rounded-full";
    const navButtonClass = `${orangeButtonBaseClass} px-3 py-1 text-sm`;
    const signInButtonClass = `${orangeButtonBaseClass} px-5 py-2 text-sm shadow-lg hover:shadow-orange-400/50 hover:scale-[1.05]`;
    const secondaryAuthButtonClass = "bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold rounded-full px-3 py-2 text-sm";


    return (
        <> 
            {/* NAVBAR CONTAINER */}
            <div className={`fixed top-0 z-50 w-full flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-pink-700 py-2 
                             bg-gray-900 
                             bg-gradient-to-l from-gray-950 to-blue-700 
                             shadow-2xl ring-1 ring-white/10 
                             shadow-[-5px_15px_15px_-5px_rgba(0,0,0,0.6)]`}
            >
                
                {/* Logo Wrapper (Static) */}
                <div 
                    onClick={() => navigate('/')} 
                    className="relative z-10 w-28 lg:w-32 cursor-pointer transition duration-500 hover:scale-[1.05] active:scale-[0.98] 
                                 rounded-md p-1 bg-white shadow-lg shadow-white/40" 
                >
                    <img src={assets.logo} alt="Logo" className="w-full" />
                </div>
                
                {/* Desktop Navigation (z-10) */}
                <div className="relative z-10 md:flex hidden items-center gap-5">

                    {/* Left side actions (Educator / Enrollments) - Only visible when signed in */}
                    {isSignedIn && (
                        <div className="flex items-center gap-5">
                            
                            {/* NEW LOGIC: ONLY SHOW IF THE USER IS ALREADY AN EDUCATOR */}
                            {isEducator && (
                                <>
                                    <button 
                                        type="button" 
                                        onClick={becomeEducator} // This will now only navigate to /educator
                                        className={navButtonClass} 
                                    >
                                        Educator Dashboard
                                    </button>
                                    <span className="text-white/50">|</span> 
                                </>
                            )}
                            {/* END NEW LOGIC */}
                            
                            <Link 
                                to='/my-enrollments' 
                                className={location.pathname === '/my-enrollments' ? `${navButtonClass} bg-orange-600` : navButtonClass}
                            >
                                My Enrollments
                            </Link>
                        </div>
                    )}
                    
                    {/* User Authentication Status (Login/Logout buttons remain correct) */}
                    <div className='flex items-center gap-3'>
                        {!isSignedIn 
                            ? (
                                // Logged OUT
                                <div className='relative' ref={dropdownRef}>
                                    <div className='flex items-center gap-3'>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowLoginOptions(showLoginOptions === 'signup' ? null : 'signup')} 
                                            className={secondaryAuthButtonClass} 
                                        >
                                            Create Account
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowLoginOptions(showLoginOptions === 'login' ? null : 'login')} 
                                            className={signInButtonClass} 
                                        >
                                            Login
                                        </button>
                                    </div>
                                    {/* ROLE SELECTION DROPDOWN */}
                                    {showLoginOptions && (
                                        <div className='absolute right-0 mt-3 w-48 bg-gray-800 rounded-md shadow-xl overflow-hidden z-20 border border-orange-500 transition-opacity duration-300 animate-in fade-in-0 zoom-in-95'>
                                            <div className='p-2 text-white/80 font-bold border-b border-white/10'>
                                                {showLoginOptions === 'login' ? 'Login As' : 'Create Account As'}
                                            </div>
                                            <div className='flex flex-col gap-1 p-2'>
                                                <button
                                                    onClick={() => handleAuth(showLoginOptions, '/')}
                                                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-orange-600 rounded-md transition duration-200"
                                                >
                                                    {showLoginOptions === 'login' ? 'Student Login' : 'Student Account'}
                                                </button>
                                                <button
                                                    onClick={() => handleAuth(showLoginOptions, '/educator')}
                                                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-orange-600 rounded-md transition duration-200"
                                                >
                                                    {showLoginOptions === 'login' ? 'Educator Login' : 'Educator Account'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                            : (
                                // Logged IN
                                <>
                                    <button
                                        type="button"
                                        onClick={() => signOut()}
                                        className={secondaryAuthButtonClass} 
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
                    
                    {isSignedIn && (
                        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
                            
                            {/* NEW LOGIC: Mobile - ONLY SHOW IF THE USER IS ALREADY AN EDUCATOR */}
                            {isEducator && (
                                <>
                                    <button 
                                        type="button" 
                                        onClick={becomeEducator} 
                                        className={navButtonClass}
                                    >
                                        Educator
                                    </button>
                                    <span className="text-white/50">|</span>
                                </>
                            )}
                            {/* END NEW LOGIC */}
                            
                            <Link 
                                to='/my-enrollments' 
                                className={navButtonClass}
                            >
                                Enrollments
                            </Link>
                        </div>
                    )}
                    
                    {isSignedIn
                        ? (
                            // Logged In
                            <>
                                <button 
                                    type="button" 
                                    onClick={() => signOut()} 
                                    aria-label="Logout"
                                    className="transition duration-300 hover:scale-110 active:scale-90"
                                >
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
                            // Logged Out
                            <button 
                                type="button" 
                                onClick={() => openSignIn({ redirectUrl: `${window.location.origin}/` })} 
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