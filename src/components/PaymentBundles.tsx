import React, { useState } from 'react';
import { BundlePurchase } from '../hooks/usePaymentHistory';

interface PaymentBundlesProps {
  bundles: BundlePurchase[];
}

const PaymentBundles: React.FC<PaymentBundlesProps> = ({ bundles }) => {
  const [expandedBundles, setExpandedBundles] = useState<Set<number>>(new Set());
  const getCourseUrl = (courseId: number) => `/course/${courseId}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-BD', {
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
    <div className="bg-background rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white mb-1">Bundle Purchases</h2>
        <p className="text-purple-foreground/80">
          {bundles.length} bundle{bundles.length !== 1 ? 's' : ''} purchased
        </p>
      </div>

      <div className="p-6">
        {bundles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Bundle Purchases</h3>
            <p className="text-muted-foreground">You haven&apos;t purchased any bundles yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bundles.map((bundle, index) => {
              const { totalIndividualPrice, savings } = calculateBundleSavings(bundle);
              const isExpanded = expandedBundles.has(bundle.id);

              return (
                <div
                  key={index}
                  className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {bundle.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>📦 Bundle Purchase</span>
                        <span>•</span>
                        <span>{bundle.courses.length} courses included</span>
                        <span>•</span>
                        <span>Purchased: {formatDate(bundle.purchase_date)}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-success">
                        {formatCurrency(bundle.paid_amount)}
                      </div>
                      {bundle.original_price !== bundle.paid_amount && (
                        <div className="text-sm text-destructive line-through">
                          {formatCurrency(bundle.original_price)}
                        </div>
                      )}
                      {savings > 0 && (
                        <div className="text-sm text-success font-medium">
                          You saved {formatCurrency(savings)}!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bundle Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <p className="font-mono text-foreground text-xs">
                        {bundle.transaction_id}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bundle URL:</span>
                      <p className="font-mono text-info text-xs">
                        /bundle/{bundle.bundle_url}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Value:</span>
                      <p className="font-medium text-foreground">
                        {formatCurrency(totalIndividualPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Courses List */}
                  <div className="mb-4">
                    <button
                      onClick={() => toggleBundleExpansion(bundle.id)}
                      className="flex items-center justify-between w-full text-left bg-muted hover:bg-muted rounded-lg p-3 transition duration-200"
                    >
                      <span className="font-medium text-foreground">
                        Included Courses ({bundle.courses.length})
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {isExpanded ? 'Hide' : 'Show'} Details
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
                                Enrolled: {formatDate(course.enrollment_date)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-foreground">
                                {formatCurrency(course.price)}
                              </span>
                              <a
                                href={getCourseUrl(course.id)}
                                className="bg-info hover:bg-info/90 text-white text-xs font-medium py-1 px-3 rounded transition duration-200"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <a
                      href={`/bundle/${bundle.bundle_id}`}
                      className="bg-purple hover:bg-purple/90 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                      View Bundle
                    </a>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(bundle.transaction_id);
                          // You could add a toast notification here
                        }}
                        className="bg-muted-foreground hover:bg-muted-foreground/90 text-white text-sm font-medium py-2 px-3 rounded-lg transition duration-200"
                      >
                        Copy ID
                      </button>
                      <a
                        href={`/bundle/${bundle.bundle_id}`}
                        className="bg-success hover:bg-success/90 text-white text-sm font-medium py-2 px-3 rounded-lg transition duration-200"
                      >
                        Start Learning
                      </a>
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
