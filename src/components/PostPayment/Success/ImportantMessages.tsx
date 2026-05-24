import React from "react";

interface ImportantMessagesProps {
    messages: string[];
}

const ImportantMessages: React.FC<ImportantMessagesProps> = ({ messages }) => {
    if (!messages || messages.length === 0) return null;

    return (
        <div className="animate-slideUp stagger-1 max-w-4xl mx-auto w-full">
            <div className="bg-purple dark:bg-purple/90 rounded-2xl p-8 lg:p-10 shadow-lg">
                <h2 className="text-2xl lg:text-3xl font-bold text-center text-white mb-8">
                    Important Messages
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-white/15 backdrop-blur-sm border border-white/20 p-5 rounded-xl hover:bg-white/25 transition-colors"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-white text-purple rounded-lg flex items-center justify-center font-bold text-lg">
                                {index + 1}
                            </div>
                            <p className="text-base lg:text-lg text-white font-medium leading-relaxed">
                                {message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImportantMessages;
