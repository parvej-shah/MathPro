import React from 'react';
import { BsDownload } from 'react-icons/bs';
import { motion } from 'framer-motion';

interface RoutineHeroProps {
    routineImage: string;
    courseTitle: string;
    currentModule: number;
    totalModules: number;
    routineDownloadUrl?: string;
    loading?: boolean;
}

export const RoutineHero: React.FC<RoutineHeroProps> = ({
    routineImage,
    courseTitle,
    currentModule,
    totalModules,
    routineDownloadUrl,
    loading = false
}) => {
    if (loading) {
        return (
            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 bg-muted animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-muted-foreground">রুটিন লোড হচ্ছে...</div>
                </div>
            </div>
        );
    }
    const handleDownload = async () => {
        const downloadUrl = routineDownloadUrl || routineImage;
        if (!downloadUrl) return;

        try {
            const response = await fetch(downloadUrl, { mode: 'cors' });
            if (!response.ok) throw new Error('fetch failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${courseTitle}-Routine.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch {
            // CORS blocked — use a hidden image + canvas to force download
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                canvas.getContext('2d')!.drawImage(img, 0, 0);
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/jpeg', 0.95);
                link.download = `${courseTitle}-Routine.jpg`;
                link.click();
            };
            img.onerror = () => {
                // Last resort — open in new tab so user can long-press to save
                window.open(downloadUrl, '_blank');
            };
            img.src = downloadUrl;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 group shadow-xl border border-border"
        >
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />

            <button
                onClick={handleDownload}
                className="absolute top-3 right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition-all active:scale-95"
                aria-label="রুটিন ডাউনলোড করো"
            >
                <BsDownload className="text-sm sm:text-base" />
            </button>
            <img
                src={routineImage}
                alt={`${courseTitle} - Weekly Routine`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8 z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
                <div>
                    <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                        Module {currentModule} / {totalModules}
                    </h2>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-xl">
                        তোমার শেখার রুটিন মেনে চলো। অগ্রগতি ও আসন্ন পাঠ দেখো।
                    </p>
                </div>

                {routineDownloadUrl && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 sm:gap-2 bg-primary/85 hover:bg-primary backdrop-blur-md text-primary-foreground px-3 sm:px-5 py-2 sm:py-3 rounded-full text-sm sm:text-base transition-all duration-300 border border-primary/40 shadow-lg shadow-primary/20"
                    >
                        <BsDownload className="text-base sm:text-lg" />
                        <span className="font-medium">রুটিন ডাউনলোড করো</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
};
