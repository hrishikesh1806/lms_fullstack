import React from 'react';
import { assets } from '../../assets/assets'; 

const companyData = [
    { name: 'Microsoft', logo: assets.microsoft_logo },
    { name: 'Walmart', logo: assets.walmart_logo },
    { name: 'Accenture', logo: assets.accenture_logo },
    { name: 'Adobe', logo: assets.adobe_logo },
    { name: 'PayPal', logo: assets.paypal_logo },
    { name: 'Google', logo: assets.google_logo }, 
    { name: 'Amazon', logo: assets.amazon_logo },
    { name: 'Tesla', logo: assets.tesla_logo }, 
];

const Companies = () => {
    return (
        <div 
            className="relative flex flex-col items-center justify-center w-full py-28 px-4 space-y-12 text-center 
                         bg-gray-950 text-white overflow-hidden" 
        >
            
            {/* 1. VIDEO BACKGROUND ELEMENT (z-10) */}
            <video 
                autoPlay 
                loop 
                muted 
                src={assets.companiesVideo}
                className="absolute inset-0 z-10 w-full h-full object-cover object-center"
            >
                Your browser does not support the video tag.
            </video>
            
            {/* Content remains on top (z-30) */}
            <h2 className="relative z-30 text-3xl md:text-4xl font-extrabold text-white">
                Trusted by Top <span className="text-orange-400">Industry Leaders</span>
            </h2>
            
            <div className="relative z-30 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-6xl w-full mx-auto">
                {companyData.map((company, index) => (
                    <div 
                        key={index} 
                        // ENHANCEMENTS: 
                        // 1. Increased blur (backdrop-blur-lg)
                        // 2. Added white border (border border-white/20)
                        // 3. Made background near-white on hover (hover:bg-white/90)
                        className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-lg rounded-xl transition-all duration-300
                                 hover:bg-white/90 hover:scale-[1.05] opacity-100 border border-white/20
                                 shadow-md shadow-white/50 hover:shadow-lg hover:shadow-white group" 
                    >
                        {/* Company Logo Image */}
                        {company.logo && (
                            <img 
                                src={company.logo} 
                                alt={company.name} 
                                // CHANGE: Logo opacity starts lower and goes to 100% on hover, but is BLACK on hover for contrast
                                className="h-10 md:h-12 object-contain mb-3 opacity-70 transition-opacity duration-300 group-hover:opacity-100 group-hover:filter group-hover:brightness-0" 
                            />
                        )}
                        {/* Company Name Text */}
                        {/* CHANGE: Text color changes to black on hover for readability against white background */}
                        <span className="text-xl sm:text-2xl font-bold tracking-wider text-gray-100 transition-colors duration-300 group-hover:text-gray-900">{company.name}</span>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default Companies;