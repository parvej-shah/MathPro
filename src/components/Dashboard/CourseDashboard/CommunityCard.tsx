import React, { useState } from 'react';
import { BsFacebook, BsTelegram } from 'react-icons/bs';
import { FaCopy, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface CommunityCardProps {
    communityLink?: string;
    accessCode?: string;
    telegramLink?: string; // enrolled-only, frontend-guide-user.md §5
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ communityLink, accessCode, telegramLink }) => {
    const [copied, setCopied] = useState(false);

    // No Facebook group link from the API → hide the whole section (no hardcoded fallback).
    if (!communityLink) {
        return null;
    }

    const copyAccessCode = () => {
        if (accessCode) {
            navigator.clipboard.writeText(accessCode);
            setCopied(true);
            toast.success('Access Code কপি হয়েছে!');
            setTimeout(() => setCopied(false), 2000);
        }
    };
    return (
        <div className="bg-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-border text-center relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#1877F2]/10 rounded-full blur-2xl group-hover:bg-[#1877F2]/20 transition-all"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

            <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#1877F2] text-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-blue-500/30">
                    <BsFacebook className="text-2xl sm:text-3xl" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-[#1877F2] mb-1.5 sm:mb-2">
                    প্রাইভেট ফেসবুক গ্রুপে যোগ দাও!
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 px-1 sm:px-4">
                    তোমার প্রশ্ন, কনফিউশন এবং যেকোনো প্রবলেম সলভ করতে অবশ্যই যুক্ত হয়ে যাও! এখানে কোর্সের সকল আপডেট ও তুমি পেয়ে যাবে!
                </p>

                {/* Access Code Section */}
                {accessCode && (
                    <div className="mb-4 sm:mb-6 bg-background rounded-xl p-3 sm:p-4 border border-[#1877F2]/20">
                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">
                            Access Code
                        </p>
                        <div
                            onClick={copyAccessCode}
                            className="flex items-center justify-between bg-muted border border-border rounded-lg p-3 cursor-pointer hover:border-[#1877F2]/50 transition-all group"
                        >
                            <code className="text-sm font-mono font-bold text-foreground tracking-wide">
                                {accessCode}
                            </code>
                            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-sm border border-border group-hover:scale-110 transition-transform">
                                {copied ? (
                                    <FaCheck className="text-success text-sm" />
                                ) : (
                                    <FaCopy className="text-[#1877F2] text-sm" />
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            গ্রুপে যোগ দেওয়ার সময় এই কোড ব্যবহার করো
                        </p>
                    </div>
                )}

                <a
                    href={communityLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#1877F2] text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-[#166fe5] transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
                >
                    গ্রুপে যোগ দাও
                </a>

                {telegramLink && (
                    <a
                        href={telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 w-full bg-[#229ED9] text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-[#1e8dc1] transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transform hover:-translate-y-0.5"
                    >
                        <BsTelegram className="text-lg sm:text-xl" />
                        Telegram গ্রুপে যোগ দাও
                    </a>
                )}
            </div>
        </div>
    );
};
