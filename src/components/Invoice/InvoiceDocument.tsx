import React from "react";
import { UserInfo, Transaction } from "@/hooks/usePaymentHistory";
import { englishToBanglaNumbers } from "@/helpers";

interface InvoiceDocumentProps {
  transaction: Transaction;
  userInfo: UserInfo;
}

const formatCurrency = (amount: number) => {
  return `৳${englishToBanglaNumbers(Math.round(amount))}`;
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ transaction, userInfo }) => {
  const issuedAt = transaction.transaction_date;
  const discount = transaction.original_price - transaction.paid_amount;

  return (
    <div className="bg-white text-slate-900 rounded-2xl shadow-lg print:shadow-none print:rounded-none p-8 lg:p-12 max-w-3xl mx-auto w-full border border-border print:border-0">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/20">
            M
          </div>
          <span className="text-2xl font-black tracking-tight text-emerald-600">
            MATHPRO
          </span>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold">ইনভয়েস</h1>
          <p className="text-sm text-slate-500">Transaction ID: {transaction.transaction_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            শিক্ষার্থীর তথ্য
          </h2>
          <p className="text-base font-bold">{userInfo.name}</p>
          {userInfo.email && <p className="text-sm text-slate-600">{userInfo.email}</p>}
          {userInfo.phone && <p className="text-sm text-slate-600">{userInfo.phone}</p>}
        </div>
        <div className="md:text-right">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            পেমেন্টের তারিখ
          </h2>
          <p className="text-base font-bold">{formatDate(issuedAt)}</p>
        </div>
      </div>

      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500 uppercase text-xs tracking-wider">
            <th className="py-2">বিবরণ</th>
            <th className="py-2 text-right">মূল্য</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="py-3">
              <p className="font-semibold text-slate-900">{transaction.title}</p>
              <p className="text-xs text-slate-500">
                {transaction.item_type === "bundle" ? "কম্বো" : transaction.item_type === "book" ? "বই" : "কোর্স"}
              </p>
              {transaction.item_type === "bundle" && transaction.courses && transaction.courses.length > 0 && (
                <ul className="mt-2 ml-4 list-disc text-xs text-slate-500 space-y-1">
                  {transaction.courses.map((course) => (
                    <li key={course.id}>{course.title}</li>
                  ))}
                </ul>
              )}
            </td>
            <td className="py-3 text-right align-top font-medium">
              {formatCurrency(transaction.original_price)}
            </td>
          </tr>
          {discount > 0 && (
            <tr className="border-b border-slate-100">
              <td className="py-3 text-slate-600">
                ছাড়
                {transaction.coupon?.code && (
                  <span className="ml-2 text-xs text-slate-400">
                    ({transaction.coupon.code})
                  </span>
                )}
              </td>
              <td className="py-3 text-right text-red-600 font-medium">
                -{formatCurrency(discount)}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-4 text-base font-bold">সর্বমোট পরিশোধিত</td>
            <td className="py-4 text-right text-xl font-extrabold text-emerald-600">
              {formatCurrency(transaction.paid_amount)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
        <p>এই ইনভয়েসটি স্বয়ংক্রিয়ভাবে তৈরি, কোনো স্বাক্ষরের প্রয়োজন নেই।</p>
        <p className="mt-1">MathPro — mathpro.org</p>
      </div>
    </div>
  );
};

export default InvoiceDocument;
