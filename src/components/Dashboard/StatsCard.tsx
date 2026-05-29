import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, colorClass = "text-primary" }) => {
    // Map the input color class to gradient and shadow styles
    const getStyles = (color: string) => {
        // Use arbitrary values to ensure gradients work even if tailwind palette is overridden
        if (color.includes('primary') || color.includes('purple')) {
            return {
                gradient: 'from-primary to-teal',
                shadow: 'shadow-primary/25 dark:shadow-primary/30',
                text: 'text-primary',
                bg: 'bg-primary/10'
            };
        }
        if (color.includes('teal')) {
            return {
                gradient: 'from-teal to-primary',
                shadow: 'shadow-teal/25 dark:shadow-teal/30',
                text: 'text-teal',
                bg: 'bg-teal/10'
            };
        }
        if (color.includes('accent') || color.includes('orange')) {
            return {
                gradient: 'from-accent to-warning',
                shadow: 'shadow-accent/25 dark:shadow-accent/30',
                text: 'text-accent',
                bg: 'bg-accent/10'
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
        <div className="relative overflow-hidden bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            {/* Decorative Background Icon */}
            <div className={`absolute -right-6 -bottom-6 text-[10rem] opacity-5 transform rotate-12 group-hover:scale-110 transition-transform duration-500 ${styles.text}`}>
                {icon}
            </div>

            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <p className="text-base font-medium text-muted-foreground mb-2">{title}</p>
                    <h4 className="text-4xl font-bold text-foreground tracking-tight">{value}</h4>
                </div>

                <div className={`p-4 rounded-2xl bg-gradient-to-br ${styles.gradient} text-primary-foreground shadow-lg ${styles.shadow} transform group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-3xl">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
