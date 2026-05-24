import React from 'react';
import { Transaction } from '../hooks/usePaymentHistory';
import { useLmsPreference } from '@/hooks/useLmsPreference';
import { isLmsPreferenceCourse, getCpLmsUrlForCourse } from '@/constants/lmsPreference';

interface PaymentTransactionsProps {
  transactions: Transaction[];
}

const PaymentTransactions: React.FC<PaymentTransactionsProps> = ({ transactions }) => {
  const { lmsPreference } = useLmsPreference();
  const getCourseHref = (itemType: string, courseId?: number, bundleId?: number) => {
    if (itemType === 'course' && courseId != null)
      return lmsPreference === 'locked' && isLmsPreferenceCourse(courseId)
        ? getCpLmsUrlForCourse(courseId)
        : `/course/${courseId}`;
    if (itemType === 'bundle' && bundleId != null) return `/bundle/${bundleId}`;
    return '#';
  };
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (itemType: string) => {
    return itemType === 'course' ? '📚' : '📦';
  };

  const getTransactionColor = (itemType: string) => {
    return itemType === 'course' 
      ? 'bg-info/15 text-info border-info/30' 
      : 'bg-purple/15 text-purple border-purple/30';
  };

  return (
    <div className="bg-background rounded-xl shadow-lg overflow-hidden">
      <div className="bg-muted px-6 py-4">
        <h2 className="text-2xl font-bold text-white mb-1">All Transactions</h2>
        <p className="text-muted-foreground">
          Complete history of your purchases ({transactions.length} transactions)
        </p>
      </div>

      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Transactions Found</h3>
            <p className="text-muted-foreground">You haven&apos;t made any purchases yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getTransactionIcon(transaction.item_type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {transaction.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getTransactionColor(transaction.item_type)}`}
                        >
                          {transaction.item_type.toUpperCase()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {transaction.purchase_type === 'individual' ? 'Individual Purchase' : 'Bundle Purchase'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-success">
                      {formatCurrency(transaction.paid_amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.original_price !== transaction.paid_amount && (
                        <span className="line-through text-destructive">
                          {formatCurrency(transaction.original_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Transaction Date:</span>
                    <p className="font-medium text-foreground">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <p className="font-mono text-foreground text-xs">
                      {transaction.transaction_id}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Enrollment Date:</span>
                    <p className="font-medium text-foreground">
                      {formatDate(transaction.enrollment_date || transaction.purchase_date || transaction.transaction_date)}
                    </p>
                  </div>
                </div>

                {/* Bundle Courses */}
                {transaction.item_type === 'bundle' && transaction.courses && transaction.courses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Included Courses ({transaction.courses.length}):
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {transaction.courses.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="flex items-center justify-between bg-muted rounded-lg p-2"
                        >
                          <span className="text-sm font-medium text-foreground">
                            {course.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatCurrency(course.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-border flex justify-end space-x-2">
                  <a
                    href={getCourseHref(
                      transaction.item_type,
                      transaction.course_id,
                      transaction.bundle_id
                    )}
                    className="bg-info hover:bg-info/90 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    View Details
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.transaction_id);
                      // You could add a toast notification here
                    }}
                    className="bg-muted-foreground hover:bg-muted-foreground/90 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    Copy Transaction ID
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTransactions;
