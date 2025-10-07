import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t bg-indigo-900 text-white">
      <div className='flex items-center gap-4'>
        {/* Logo remains on the left */}
        <img className="relative z-10 w-28 lg:w-32 cursor-pointer transition duration-500 hover:scale-[1.05] active:scale-[0.98] 
                         rounded-md p-1 bg-white shadow-lg shadow-white/40 animate-pulse-slow 
                         hover:rotate-1 hover:shadow-2xl hover:shadow-orange-400/70" 
             src={assets.logo} 
             alt="logo" />
        
        <div className='hidden md:block h-7 w-px bg-white/60'></div> 
        
        <p className="py-4 text-center text-xs md:text-sm text-white/80">
          Copyright 2025 © GreatStack. All Right Reserved.
        </p>
      </div>
      
      {/* Social Media Icons Container */}
      <div className='flex items-center gap-3 max-md:mt-4'>
        
        {/* Facebook Icon Styling (Blue) */}
        <a 
          href="#" 
          className="p-2 rounded-full bg-[#3b5998] hover:scale-110 transition duration-300" // Facebook blue
          aria-label="Facebook" // Good for accessibility
        >
          <img src={assets.facebook_icon} alt="facebook_icon" className="w-5 h-5" />
        </a>
        
        {/* Twitter Icon Styling (Light Blue - modern X logo is black/dark, but traditional Twitter is blue) */}
        <a 
          href="#" 
          className="p-2 rounded-full bg-[#00acee] hover:scale-110 transition duration-300" // Twitter blue
          aria-label="Twitter"
        >
          <img src={assets.twitter_icon} alt="twitter_icon" className="w-5 h-5" />
        </a>
        
        {/* Instagram Icon Styling (Gradient effect or a base purple) */}
        {/* For a true Instagram gradient, you'd need custom CSS. Here's a prominent purple. */}
        <a 
          href="#" 
          className="p-2 rounded-full bg-[#C13584] hover:scale-110 transition duration-300" // Instagram purple/pink
          aria-label="Instagram"
        >
          <img src={assets.instagram_icon} alt="instagram_icon" className="w-5 h-5" />
        </a>
        
      </div>
    </footer>
  );
};

export default Footer;