import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsChevronRight, BsBook, BsGift } from 'react-icons/bs';
import { FaRupeeSign } from 'react-icons/fa';

interface BundleCourse {
  id: number;
  title: string;
  price: number;
  url: string;
}

interface Bundle {
  id: number;
  title: string;
  price: number;
  url: string;
  courses: BundleCourse[];
  course_count: number;
  purchased?: boolean;
}

interface BundleCardProps {
  bundle: Bundle;
  showPurchaseButton?: boolean;
  compact?: boolean;
  onPurchaseClick?: (bundleId: number) => void;
  duplicateWarning?: {
    hasDuplicates: boolean;
    duplicateCount: number;
    recommendation: string;
  };
}

export default function BundleCard({ 
  bundle, 
  showPurchaseButton = true, 
  compact = false,
  onPurchaseClick,
  duplicateWarning
}: BundleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  const calculateTotalOriginalPrice = (courses: BundleCourse[]) => {
    return courses.reduce((total, course) => total + course.price, 0);
  };

  const calculateDiscount = (bundlePrice: number, originalTotal: number) => {
    return Math.round(((originalTotal - bundlePrice) / originalTotal) * 100);
  };

  const originalTotal = calculateTotalOriginalPrice(bundle.courses);
  const discount = calculateDiscount(bundle.price, originalTotal);
  const savings = originalTotal - bundle.price;

  return (
    <div className={`bg-background rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-border ${compact ? 'h-auto' : ''}`}>
      {/* Bundle Header */}
      <div className="relative bg-gradient-to-br from-purple to-teal p-4">
        <div className="absolute top-4 right-4 bg-yellow text-white px-3 py-1 rounded-full text-sm font-bold">
          {discount}% ছাড়
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <BsGift className="text-white text-lg" />
          </div>
          <div>
            <h4 className="text-white font-bold">Bundle Deal</h4>
            <p className="text-white/80 text-sm">{bundle.course_count}টি কোর্স একসাথে</p>
          </div>
        </div>
      </div>

      {/* Bundle Content */}
      <div className="p-4">
        {/* Bundle Title */}
        <h3 className={`font-bold text-heading dark:text-darkHeading mb-3 line-clamp-2 group-hover:text-purple transition-colors ${compact ? 'text-lg' : 'text-xl'}`}>
          {bundle.title}
        </h3>

        {/* Courses Preview */}
        <div className="mb-4">
          <p className="text-sm text-paragraph dark:text-darkParagraph mb-2">
            এই Bundle এ যা যা আছে:
          </p>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {bundle.courses.slice(0, compact ? 2 : 3).map((course) => (
              <div key={course.id} className="flex items-center gap-2 text-sm">
                <BsBook className="text-teal text-xs flex-shrink-0" />
                <span className="text-paragraph dark:text-darkParagraph line-clamp-1">
                  {course.title}
                </span>
              </div>
            ))}
            {bundle.courses.length > (compact ? 2 : 3) && (
              <div className="text-sm text-purple font-medium">
                + আরো {bundle.courses.length - (compact ? 2 : 3)}টি কোর্স
              </div>
            )}
          </div>
        </div>

        {/* Bundle Stats */}
        <div className={`grid gap-4 mb-4 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div className="flex items-center gap-2 text-sm">
            <BsBook className="text-teal" />
            <span className="text-paragraph dark:text-darkParagraph">
              {bundle.course_count}টি কোর্স
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <FaRupeeSign className="text-yellow" />
            <span className="text-paragraph dark:text-darkParagraph">
              {formatPrice(savings)} সাশ্রয়
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-heading dark:text-darkHeading ${compact ? 'text-lg' : 'text-2xl'}`}>
                {formatPrice(bundle.price)}
              </span>
              <span className={`text-muted-foreground line-through ${compact ? 'text-sm' : 'text-lg'}`}>
                {formatPrice(originalTotal)}
              </span>
            </div>
          </div>
          <p className="text-success font-semibold text-sm">
            আপনি সাশ্রয় করবেন {formatPrice(savings)}
          </p>
        </div>

        {/* Duplicate Warning */}
        {duplicateWarning?.hasDuplicates && (
          <div className="mb-3 p-3 bg-yellow/10 border border-yellow/30 rounded-lg">
            <p className="text-xs text-paragraph dark:text-darkParagraph">
              ⚠️ আপনার {duplicateWarning.duplicateCount}টি কোর্স আছে
            </p>
          </div>
        )}

        {/* Action Button */}
        {showPurchaseButton && (
          <Link href={`/bundle/${bundle.id}`}>
            <button className="w-full bg-gradient-to-r from-purple to-teal text-white py-3 px-4 rounded-lg font-semibold hover:from-teal hover:to-purple transition-all duration-300 flex items-center justify-center gap-2 group">
              Bundle দেখুন
              <BsChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
