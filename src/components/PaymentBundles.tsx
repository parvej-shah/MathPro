import React, { useState } from 'react';
import Link from 'next/link';
import { BundlePurchase } from '../hooks/usePaymentHistory';
import { englishToBanglaNumbers } from '@/helpers';

interface PaymentBundlesProps {
  bundles: BundlePurchase[];
}

const PaymentBundles: React.FC<PaymentBundlesProps> = ({ bundles }) => {
  const [expandedBundles, setExpandedBundles] = useState<Set<number>>(new Set());

  const formatCurrency = (amount: number) => {
    return `৳${englishToBanglaNumbers(Math.round(amount))}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const toggleBundleExpansion = (bundleId: number) => {
    const newExpanded = new Set(expandedBundles);
    if (newExpanded.has(bundleId)) {
      newExpanded.delete(bundleId);
    } else {
      newExpanded.add(bundleId);
    }
    setExpandedBundles(newExpanded);
  };

  const calculateBundleSavings = (bundle: BundlePurchase) => {
    const totalIndividualPrice = bundle.courses.reduce((sum, course) => sum + course.price, 0);
    const savings = totalIndividualPrice - bundle.paid_amount;
    return { totalIndividualPrice, savings };
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="bg-linear-to-r from-primary to-primary/85 px-6 py-6">
        <h2 className="text-2xl font-bold text-primary-foreground mb-1">কম্বো</h2>
        <p className="text-primary-foreground/85">
          {englishToBanglaNumbers(bundles.length)} টি কম্বো কেনা হয়েছে
        </p>
      </div>

      <div className="p-6">
        {bundles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">কোনো কম্বো কেনা হয়নি</h3>
            <p className="text-muted-foreground">তুমি এখনো কোনো কম্বো কেনো নি।</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bundles.map((bundle, index) => {
              const { totalIndividualPrice, savings } = calculateBundleSavings(bundle);
              const isExpanded = expandedBundles.has(bundle.id);

              return (
                <div
                  key={index}
                  className="border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {bundle.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="px-2 py-1 rounded-full text-xs font-medium border bg-accent/15 text-accent border-accent/30">
                          কম্বো
                        </span>
                        <span>{englishToBanglaNumbers(bundle.courses.length)} টি কোর্স অন্তর্ভুক্ত</span>
                        <span>•</span>
                        <span>কেনার তারিখ: {formatDate(bundle.purchase_date)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(bundle.paid_amount)}
                      </div>
                      {bundle.original_price !== bundle.paid_amount && (
                        <div className="text-sm text-destructive line-through">
                          {formatCurrency(bundle.original_price)}
                        </div>
                      )}
                      {savings > 0 && (
                        <div className="text-sm text-success font-medium">
                          {formatCurrency(savings)} সাশ্রয় হয়েছে!
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">ট্রানজেকশন আইডি:</span>
                      <p className="font-mono text-foreground text-xs">
                        {bundle.transaction_id}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">কম্বো লিংক:</span>
                      <p className="font-mono text-info text-xs">
                        /combos/{bundle.bundle_url || bundle.bundle_id}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">মোট মূল্য:</span>
                      <p className="font-medium text-foreground">
                        {formatCurrency(totalIndividualPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <button
                      onClick={() => toggleBundleExpansion(bundle.id)}
                      className="flex items-center justify-between w-full text-left bg-muted hover:bg-muted/80 rounded-lg p-3 transition duration-200"
                    >
                      <span className="font-medium text-foreground">
                        অন্তর্ভুক্ত কোর্স ({englishToBanglaNumbers(bundle.courses.length)})
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {isExpanded ? 'লুকাও' : 'দেখাও'}
                        </span>
                        <div className={`transform transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}>
                          ▼
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2">
                        {bundle.courses.map((course, courseIndex) => (
                          <div
                            key={courseIndex}
                            className="flex items-center justify-between bg-background border border-border rounded-lg p-3"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">
                                {course.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                এনরোলমেন্ট: {formatDate(course.enrollment_date)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-foreground">
                                {formatCurrency(course.price)}
                              </span>
                              <Link
                                href={`/courses/${course.url || course.id}`}
                                className="bg-info hover:bg-info/90 text-white text-xs font-medium py-1 px-3 rounded transition duration-200"
                              >
                                দেখো
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border">
                    <Link
                      href={`/combos/${bundle.bundle_url || bundle.bundle_id}`}
                      className="bg-info hover:bg-info/90 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                      বিস্তারিত দেখো
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(bundle.transaction_id);
                        }}
                        className="bg-muted hover:bg-muted/80 text-foreground text-sm font-medium py-2 px-3 rounded-lg border border-border transition duration-200"
                      >
                        আইডি কপি করো
                      </button>
                      <Link
                        href={`/dashboard/bundle/${bundle.bundle_id}`}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-3 rounded-lg transition duration-200"
                      >
                        শেখা চালিয়ে যাও
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentBundles;
