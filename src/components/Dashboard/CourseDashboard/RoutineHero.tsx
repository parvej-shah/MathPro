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
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden mb-8 bg-muted animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-muted-foreground">Loading routine...</div>
                </div>
            </div>
        );
    }
    const handleDownload = async () => {
        if (!routineDownloadUrl) return;

        try {
            // Fetch the image
            const response = await fetch(routineDownloadUrl);
            const blob = await response.blob();
            
            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary anchor element and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = `${courseTitle}-Routine.jpg`;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // Fallback: open in new tab
            window.open(routineDownloadUrl, '_blank');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden mb-8 group shadow-xl border border-border"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img
                src={routineImage}
                alt={`${courseTitle} - Weekly Routine`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
                        Module {currentModule} of {totalModules}
                    </h2>
                    <p className="text-white/90 text-sm md:text-base max-w-xl">
                        Stay on track with your learning schedule. Check your progress and upcoming lessons.
                    </p>
                </div>

                {routineDownloadUrl && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-primary/85 hover:bg-primary backdrop-blur-md text-primary-foreground px-5 py-3 rounded-full transition-all duration-300 border border-primary/40 shadow-lg shadow-primary/20"
                    >
                        <BsDownload className="text-lg" />
                        <span className="font-medium">Download Routine</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
};
