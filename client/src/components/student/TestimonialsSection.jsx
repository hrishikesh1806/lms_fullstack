import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
    const sectionId = "testimonial-section"; // Unique ID for CSS/Styling target

    return (
        <div 
            // MAIN SECTION CONTAINER: Tall padding retained for a strong block
            className={`relative w-full text-white overflow-hidden py-32 md:py-40 bg-gray-900 ${sectionId}`} 
            style={{
                // Using a flat dark background (gray-900) for clean professionalism
                background: 'linear-gradient(to bottom, #101627 0%, #000000 100%)',
            }}
        >
            {/* 1. VISUAL BREAK / EDGE STYLING */}
            {/* Creates a subtle glow or "cutout" effect at the top for a professional visual break */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900/0 to-gray-900/50 pointer-events-none"></div>

            {/* 2. CONTENT WRAPPER (z-30) */}
            <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                
                {/* Header Text */}
                <h2 className="text-5xl font-extrabold text-white text-center leading-tight">
                    Trusted by Experts.<br className="hidden sm:inline" />Loved by Learners.
                </h2>
                <p className="md:text-xl text-gray-400 mt-5 mb-20 text-center max-w-3xl mx-auto font-light">
                    Join thousands of professionals who have transformed their careers with our top-rated courses.
                </p>

                {/* Testimonial Cards - HORIZONTAL SCROLLING CONTAINER */}
                <div 
                    className="flex overflow-x-auto flex-nowrap gap-6 md:gap-8 pb-4" 
                >
                    {dummyTestimonial.map((testimonial, index) => (
                        <div
                            key={index}
                            className="text-base text-left border border-white/10 rounded-2xl 
                                    bg-gray-800/70 backdrop-blur-sm 
                                    shadow-2xl shadow-black/50 text-white flex-shrink-0
                                    transition-all duration-300 hover:shadow-orange-500/30 
                                    min-w-[320px] max-w-[350px] overflow-hidden" 
                        >
                            {/* Card Body (Feedback & Rating) */}
                            <div className="p-6 md:p-8">
                                <div className="flex gap-0.5 mb-4">
                                    {/* Star Rating Logic */}
                                    {[...Array(5)].map((_, i) => (
                                        <img
                                            className="h-5 w-5 invert saturate-200 brightness-125" // Invert for white, saturate/brighten for subtle glow
                                            key={i}
                                            src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                                            alt="star rating"
                                        />
                                    ))}
                                </div>
                                {/* Increased font size for main quote */}
                                <p className="text-white text-lg italic leading-relaxed">
                                    "{testimonial.feedback}"
                                </p>
                            </div>
                            
                            {/* Card Footer (User Info & Link) - Clean Separator */}
                            <div className="flex items-center gap-4 px-6 md:px-8 py-5 border-t border-white/10 bg-gray-800">
                                <img 
                                    className="h-12 w-12 rounded-full object-cover border-2 border-orange-500/50" 
                                    src={testimonial.image} 
                                    alt={testimonial.name} 
                                />
                                <div>
                                    <h1 className="text-base font-semibold text-orange-400">{testimonial.name}</h1>
                                    <p className="text-gray-400 text-sm font-light">{testimonial.role}</p>
                                </div>
                                {/* Removed "Read more" link as it often clutters testimonial cards */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;