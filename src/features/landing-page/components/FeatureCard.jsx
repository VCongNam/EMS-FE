import React from 'react';

const FeatureCard = ({ icon, title, description, iconColor = 'text-primary' }) => {
    return (
        <div className="group p-10 rounded-[40px] bg-white border border-transparent hover:border-gray-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 text-center flex flex-col items-center">
            {/* Icon Container */}
            <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center my-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <span className={`text-5xl ${iconColor}`}>{icon}</span>
            </div>

            {/* Content */}
            <h4 className="text-2xl font-bold text-text-main mb-4 font-['Outfit'] !p-2">
                {title}
            </h4>
            <p className="text-text-muted leading-relaxed text-lg !p-2 ">
                {description}
            </p>
        </div>
    );
};

export default FeatureCard;
