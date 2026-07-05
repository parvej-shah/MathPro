import React from 'react';
import Link from 'next/link';
import { BookPurchase } from '../hooks/usePaymentHistory';
import { englishToBanglaNumbers } from '@/helpers';

interface PaymentBooksProps {
  books: BookPurchase[];
}

const FULFILLMENT_LABELS: Record<BookPurchase['fulfillment_status'], string> = {
  pending: 'প্রসেসিং',
  shipped: 'পাঠানো হয়েছে',
  delivered: 'পৌঁছে গেছে',
  cancelled: 'বাতিল হয়েছে',
};

const FULFILLMENT_CLASSES: Record<BookPurchase['fulfillment_status'], string> = {
  pending: 'bg-warning/15 text-warning border-warning/30',
  shipped: 'bg-info/15 text-info border-info/30',
  delivered: 'bg-success/15 text-success border-success/30',
  cancelled: 'bg-destructive/15 text-destructive border-destructive/30',
};

const PaymentBooks: React.FC<PaymentBooksProps> = ({ books }) => {
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

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="bg-linear-to-r from-primary to-primary/85 px-6 py-6">
        <h2 className="text-2xl font-bold text-primary-foreground mb-1">বই</h2>
        <p className="text-primary-foreground/85">
          {englishToBanglaNumbers(books.length)} টি বই কেনা হয়েছে
        </p>
      </div>

      <div className="p-6">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">কোনো বই কেনা হয়নি</h3>
            <p className="text-muted-foreground">তুমি এখনো কোনো বই কেনো নি।</p>
          </div>
        ) : (
          <div className="space-y-6">
            {books.map((book, index) => (
              <div
                key={index}
                className="border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{book.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${FULFILLMENT_CLASSES[book.fulfillment_status]}`}
                      >
                        {FULFILLMENT_LABELS[book.fulfillment_status]}
                      </span>
                      <span>•</span>
                      <span>কেনার তারিখ: {formatDate(book.purchase_date)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(book.paid_amount)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">ট্রানজেকশন আইডি:</span>
                    <p className="font-mono text-foreground text-xs">{book.transaction_id}</p>
                  </div>
                  {book.ship_address && (
                    <div>
                      <span className="text-muted-foreground">পাঠানোর ঠিকানা:</span>
                      <p className="font-medium text-foreground text-xs">
                        {book.ship_address}
                        {book.ship_city ? `, ${book.ship_city}` : ''}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 pt-4 border-t border-border md:flex md:flex-wrap md:items-center md:justify-between">
                  <Link
                    href={`/books/${book.book_id}`}
                    className="inline-flex items-center justify-center w-full md:w-auto min-h-11 bg-info hover:bg-info/90 text-white text-sm font-medium py-3 px-4 rounded-lg transition duration-200"
                  >
                    বইটি দেখো
                  </Link>
                  <button
                    onClick={() => navigator.clipboard.writeText(book.transaction_id)}
                    className="inline-flex items-center justify-center w-full md:w-auto min-h-11 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium py-3 px-3 rounded-lg border border-border transition duration-200"
                  >
                    আইডি কপি করো
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

export default PaymentBooks;
