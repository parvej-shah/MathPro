import React from "react";

interface WhatYouGetProps {
  youGetItems?: string[];
}

const WhatYouGet: React.FC<WhatYouGetProps> = ({ youGetItems = [] }) => {
  // If no items provided, don't render the component
  if (!youGetItems || youGetItems.length === 0) {
    return null;
  }

  return (
    <div className="animate-slideUp stagger-3">
      <h2 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-12">
        যা যা পাচ্ছেন
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {youGetItems.map((item, index) => (
          <div
            key={index}
            className="bg-background rounded-2xl p-8 text-center border border-border shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-16 h-16 mx-auto bg-primary text-white rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.9">
                  <path
                    d="M8.00065 14.6663C4.31865 14.6663 1.33398 11.6817 1.33398 7.99967C1.33398 4.31767 4.31865 1.33301 8.00065 1.33301C11.6827 1.33301 14.6673 4.31767 14.6673 7.99967C14.6673 11.6817 11.6827 14.6663 8.00065 14.6663ZM8.00065 13.333C9.41512 13.333 10.7717 12.7711 11.7719 11.7709C12.7721 10.7707 13.334 9.41414 13.334 7.99967C13.334 6.58519 12.7721 5.22863 11.7719 4.22844C10.7717 3.22824 9.41512 2.66634 8.00065 2.66634C6.58616 2.66634 5.22961 3.22824 4.22942 4.22844C3.22922 5.22863 2.66732 6.58519 2.66732 7.99967C2.66732 9.41414 3.22922 10.7707 4.22942 11.7709C5.22961 12.7711 6.58616 13.333 8.00065 13.333ZM7.33598 10.6663L4.50732 7.83767L5.44998 6.89501L7.33598 8.78101L11.1067 5.00967L12.05 5.95234L7.33598 10.6663Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {item.trim()}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatYouGet;
