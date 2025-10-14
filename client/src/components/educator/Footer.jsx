import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-white w-full border-t border-orange-600/20">
            
            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 lg:gap-12">
                    
                    {/* 1. Brand Info & Socials (Col 1 & 2 on small screens, Col 1 on larger) */}
                    <div className="flex flex-col col-span-2 md:col-span-1">
                        
                        {/* *** ALIGNMENT FIX APPLIED HERE ***
                            We wrap the logo and the text in a centered container on mobile 
                            and a start-aligned container on desktop.
                        */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            
                            {/* Logo - Restored Original Animated Styling */}
                            <div 
                                className="relative w-28 lg:w-32 transition duration-500 hover:scale-[1.05] 
                                            rounded-md p-1 bg-white shadow-lg shadow-white/40 animate-pulse-slow 
                                            hover:rotate-1 hover:shadow-2xl hover:shadow-orange-400/70 mb-4" 
                            >
                                <img 
                                    src={assets.logo} 
                                    alt="Logo" 
                                    className="w-full" 
                                />
                            </div>
                            
                            <p className="mt-2 text-sm text-gray-500 font-light max-w-xs">
                                Dedicated to building a strong community through transformative learning experiences.
                            </p>
                        </div>

                        {/* Social Icons (Placeholder) - Placed outside the inner wrapper for alignment flexibility */}
                        <div className="flex space-x-4 mt-6 justify-center md:justify-start">
                            {/* Facebook (Placeholder SVG) */}
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition duration-200" title="Facebook">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-3 8h-2v2h2v2h-2v4h-2v-4h-2v-2h2V6c0-1.11.89-2 2-2h2v4z"/></svg>
                            </a>
                            {/* Twitter (Placeholder SVG) */}
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition duration-200" title="Twitter">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.34-1.6.57-2.45.65.89-.53 1.57-1.37 1.88-2.37-.8.49-1.68.85-2.61 1.04-.75-.8-1.82-1.3-3.03-1.3-2.29 0-4.16 1.86-4.16 4.16 0 .33.04.65.11.95-3.46-.17-6.53-1.83-8.58-4.33-.36.63-.57 1.37-.57 2.15 0 1.44.73 2.72 1.85 3.47-.68-.02-1.32-.21-1.88-.52v.05c0 2.02 1.44 3.7 3.35 4.09-.35.1-.72.15-1.11.15-.27 0-.53-.03-.79-.08.53 1.66 2.08 2.87 3.92 2.91-1.43 1.12-3.24 1.79-5.23 1.79-.34 0-.68-.02-1.01-.06C3.49 20.37 5.62 21 7.9 21c9.4 0 14.54-7.78 14.54-14.54 0-.22-.01-.43-.01-.65.98-.71 1.83-1.6 2.5-2.61z"/></svg>
                            </a>
                            {/* Instagram (Placeholder SVG) */}
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition duration-200" title="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.01 4.851.071 1.171.054 1.84.249 2.373.456.56.216.985.518 1.405.938.42.42.722.845.938 1.405.207.533.402 1.202.456 2.373.061 1.267.071 1.647.071 4.851s-.01 3.584-.071 4.851c-.054 1.171-.249 1.84-.456 2.373-.216.56-.518.985-.938 1.405-.42.42-.845.722-1.405.938-.533.207-1.202.402-2.373.456-1.267.061-1.647.071-4.851.071s-3.584-.01-4.851-.071c-1.171-.054-1.84-.249-2.373-.456-.56-.216-.985-.518-1.405-.938-.42-.42-.722-.845-.938-1.405-.207-.533-.402-1.202-.456-2.373-.061-1.267-.071-1.647-.071-4.851s.01-3.584.071-4.851c.054-1.171.249-1.84.456-2.373.216-.56.518-.985.938-1.405.42-.42.845-.722 1.405-.938.533-.207 1.202-.402 2.373-.456 1.267-.061 1.647-.071 4.851-.071zm0-2.163c-3.267 0-3.676.012-4.943.071-1.218.056-2.031.259-2.735.533-.77.295-1.41.745-2.052 1.387-.642.642-1.092 1.282-1.387 2.052-.274.704-.477 1.517-.533 2.735-.059 1.267-.071 1.676-.071 4.943s.012 3.676.071 4.943c.056 1.218.259 2.031.533 2.735.295.77.745 1.41 1.387 2.052.642.642 1.282 1.092 2.052 1.387.704.274 1.517.477 2.735.533 1.267.059 1.676.071 4.943.071s3.676-.012 4.943-.071c1.218-.056 2.031-.259 2.735-.533.77-.295 1.41-.745 2.052-1.387.642-.642 1.092-1.282 1.387-2.052.274-.704.477-1.517.533-2.735.059-1.267.071-1.676.071-4.943s-.012-3.676-.071-4.943c-.056-1.218-.259-2.031-.533-2.735-.295-.77-.745-1.41-1.387-2.052-.642-.642-1.092-1.282-1.387-2.052-.704-.274-1.517-.477-2.735-.533-1.267-.059-1.676-.071-4.943-.071zm0 3.863a8.137 8.137 0 100 16.274A8.137 8.137 0 0012 5.95zm0 13.274a5.137 5.137 0 110-10.274 5.137 5.137 0 010 10.274zM18.89 3.84a1.082 1.082 0 10-2.164 0 1.082 1.082 0 002.164 0z"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* 2. Grouped Link Columns (Platform, Company, Legal & Help) */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">All Projects</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">Pricing Plans</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">Student Success</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">Affiliate Program</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">About Us</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">Team</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">Careers</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">Contact</a></li>
                        </ul>
                    </div>
                    
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-4">Legal & Help</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">FAQ</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition duration-200">Accessibility</a></li>
                        </ul>
                    </div>

                    {/* 3. Newsletter CTA (Compact) */}
                    <div className="flex flex-col col-span-2 md:col-span-1 border-t md:border-t-0 border-gray-800 pt-6 md:pt-0">
                        <h3 className="text-lg font-semibold text-orange-400 mb-4">
                            Subscribe for 10% Off
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Get instant access to our welcome discount and free resources.
                        </p>
                        <input 
                            className="border border-gray-700 bg-gray-800 text-white placeholder-gray-500 
                                       outline-none h-10 px-3 rounded-lg text-sm 
                                       focus:border-orange-500 transition duration-200 mb-3" 
                            type="email" 
                            placeholder="Email address" 
                        />
                        <button 
                            className="px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 
                                       transition duration-300 text-white font-semibold text-sm shadow-lg shadow-orange-600/30"
                        >
                            Sign Up
                        </button>
                    </div>

                </div>
            </div>
            
            {/* Copyright Bar */}
            <div className="bg-gray-900 py-4">
                 <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
                    © 2025 Aparaitech . All Rights Reserved. | Made with 🧡 for the future of learning.
                </p>
            </div>
        </footer>
    );
};

export default Footer;