import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, colorClass = "text-purple" }) => {
    // Map the input color class to gradient and shadow styles
    const getStyles = (color: string) => {
        // Use arbitrary values to ensure gradients work even if tailwind palette is overridden
        if (color.includes('purple')) {
            return {
                // Using the custom purple #B153E0 and mixing with a vibrant violet
                gradient: 'from-[#B153E0] to-[#7C3AED]',
                shadow: 'shadow-purple-200 dark:shadow-purple-900/30',
                text: 'text-[#B153E0] dark:text-[#D8B4FE]',
                bg: 'bg-purple-50 dark:bg-purple-900/20'
            };
        }
        if (color.includes('teal')) {
            return {
                // Using the custom teal #107B61 and mixing with a brighter teal/emerald
                gradient: 'from-[#107B61] to-[#2DD4BF]',
                shadow: 'shadow-teal-200 dark:shadow-teal-900/30',
                text: 'text-[#107B61] dark:text-[#5EEAD4]',
                bg: 'bg-teal-50 dark:bg-teal-900/20'
            };
        }
        if (color.includes('orange')) {
            return {
                gradient: 'from-orange-400 to-red-500',
                shadow: 'shadow-orange-200 dark:shadow-orange-900/30',
                text: 'text-orange-600 dark:text-orange-400',
                bg: 'bg-orange-50 dark:bg-orange-900/20'
            };
        }
        // Default fallback
        return {
            gradient: 'from-gray-500 to-gray-600',
            shadow: 'shadow-gray-200 dark:shadow-gray-900/30',
            text: 'text-muted-foreground',
            bg: 'bg-muted'
        };
    };

    const styles = getStyles(colorClass);

    return (
        <div className="relative overflow-hidden bg-background p-6 rounded-2xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            {/* Decorative Background Icon */}
            <div className={`absolute -right-6 -bottom-6 text-[10rem] opacity-5 transform rotate-12 group-hover:scale-110 transition-transform duration-500 ${styles.text}`}>
                {icon}
            </div>

            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <p className="text-base font-medium text-muted-foreground mb-2">{title}</p>
                    <h4 className="text-4xl font-bold text-heading dark:text-darkHeading tracking-tight">{value}</h4>
                </div>

                <div className={`p-4 rounded-2xl bg-gradient-to-br ${styles.gradient} text-white shadow-lg ${styles.shadow} transform group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-3xl">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
