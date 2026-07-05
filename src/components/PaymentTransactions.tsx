import React from 'react';
import Link from 'next/link';
import { Transaction } from '../hooks/usePaymentHistory';
import { toast } from 'react-hot-toast';
import { englishToBanglaNumbers } from '@/helpers';

interface PaymentTransactionsProps {
  transactions: Transaction[];
}

const PaymentTransactions: React.FC<PaymentTransactionsProps> = ({ transactions }) => {
  const getDetailsHref = (transaction: Transaction) => {
    if (transaction.item_type === 'course' && transaction.course_id != null) {
      return `/courses/${transaction.course_url || transaction.course_id}`;
    }
    if (transaction.item_type === 'bundle' && transaction.bundle_id != null) {
      return `/combos/${transaction.bundle_url || transaction.bundle_id}`;
    }
    if (transaction.item_type === 'book' && transaction.book_id != null) {
      return `/books/${transaction.book_id}`;
    }
    return '#';
  };

  const formatCurrency = (amount: number) => {
    return `৳${englishToBanglaNumbers(Math.round(amount))}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionLabel = (itemType: string) => {
    if (itemType === 'course') return 'কোর্স';
    if (itemType === 'book') return 'বই';
    return 'কম্বো';
  };

  const getTransactionColor = (itemType: string) => {
    if (itemType === 'course') return 'bg-info/15 text-info border-info/30';
    if (itemType === 'book') return 'bg-warning/15 text-warning border-warning/30';
    return 'bg-accent/15 text-accent border-accent/30';
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="bg-linear-to-r from-primary to-primary/85 px-4 py-5 sm:px-6 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">সকল ট্রানজেকশন</h2>
        <p className="text-sm sm:text-base text-primary-foreground/85 break-words">
          তোমার সকল কেনাকাটার বিস্তারিত ইতিহাস ({englishToBanglaNumbers(transactions.length)} টি ট্রানজেকশন)
        </p>
      </div>

      <div className="p-4 sm:p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">কোনো ট্রানজেকশন পাওয়া যায়নি</h3>
            <p className="text-muted-foreground">তুমি এখনো কিছু কেনো নি।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-3">
                  <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground break-words">
                        {transaction.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getTransactionColor(transaction.item_type)}`}
                        >
                          {getTransactionLabel(transaction.item_type)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {transaction.purchase_type === 'individual' ? 'ইন্ডিভিজুয়াল ক্রয়' : 'কম্বো ক্রয়'}
                        </span>
                      </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-lg sm:text-xl font-bold text-primary">
                      {formatCurrency(transaction.paid_amount)}
                    </div>
                    {transaction.original_price !== transaction.paid_amount && (
                      <div className="text-sm text-destructive line-through">
                        {formatCurrency(transaction.original_price)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-sm">
                  <div className="min-w-0">
                    <span className="text-muted-foreground">ট্রানজেকশনের তারিখ:</span>
                    <p className="font-medium text-foreground break-words">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-muted-foreground">ট্রানজেকশন আইডি:</span>
                    <p className="font-mono text-foreground text-xs break-all">
                      {transaction.transaction_id}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-muted-foreground">এনরোলমেন্টের তারিখ:</span>
                    <p className="font-medium text-foreground break-words">
                      {formatDate(transaction.enrollment_date || transaction.purchase_date || transaction.transaction_date)}
                    </p>
                  </div>
                </div>

                {transaction.item_type === 'bundle' && transaction.courses && transaction.courses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      অন্তর্ভুক্ত কোর্স ({englishToBanglaNumbers(transaction.courses.length)} টি):
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {transaction.courses.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between bg-muted rounded-lg p-3"
                        >
                          <span className="text-sm font-medium text-foreground break-words">
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

                <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 gap-2 md:flex md:flex-wrap md:justify-end">
                  <Link
                    href={getDetailsHref(transaction)}
                    className="inline-flex items-center justify-center w-full md:w-auto min-h-11 bg-info hover:bg-info/90 text-white text-sm font-medium py-3 px-4 rounded-lg transition duration-200"
                  >
                    বিস্তারিত দেখো
                  </Link>
                  <Link
                    href={`/billing/invoice/${transaction.transaction_id}`}
                    className="inline-flex items-center justify-center w-full md:w-auto min-h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-3 px-4 rounded-lg transition duration-200"
                  >
                    ইনভয়েস দেখো
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.transaction_id);
                      toast.success('ট্রানজেকশন আইডি কপি হয়েছে!');
                    }}
                    className="inline-flex items-center justify-center w-full md:w-auto min-h-11 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium py-3 px-4 rounded-lg border border-border transition duration-200"
                  >
                    ট্রানজেকশন আইডি কপি করো
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
