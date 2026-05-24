import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface SuccessHeaderProps {
    title: string;
    type: "bundle" | "course";
}

const SuccessHeader: React.FC<SuccessHeaderProps> = ({ title, type }) => {
    return (
        <div className="text-center animate-slideUp relative z-20">
            {/* Simple Success Badge */}
            <div className="relative inline-flex items-center justify-center mb-8">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
                    <FaCheckCircle className="text-white text-4xl lg:text-5xl" />
                </div>
            </div>

            {/* Congratulations Text */}
            <h1 className="text-4xl pt-2 lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple to-teal mb-4">
                অভিনন্দন!
            </h1>
            <p className="text-xl lg:text-2xl text-foreground font-semibold mb-2">
                আপনার {type === "bundle" ? "বান্ডেল" : "কোর্স"} ক্রয় সফল হয়েছে
            </p>
            <p className="text-lg text-muted-foreground">
                {title}
            </p>
        </div>
    );
};

export default SuccessHeader;
