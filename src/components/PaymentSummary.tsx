import React from "react";
import { BsWallet2, BsBook, BsBoxSeam, BsArrowRepeat } from "react-icons/bs";
import { Summary, UserInfo } from "../hooks/usePaymentHistory";
import { englishToBanglaNumbers } from "@/helpers";

interface PaymentSummaryProps {
  summary: Summary;
  userInfo: UserInfo;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  summary,
  userInfo,
}) => {
  const formatCurrency = (amount: number) => {
    return `৳${englishToBanglaNumbers(Math.round(amount))}`;
  };

  const getContactInfo = () => {
    if (userInfo.login_type === "phone" && userInfo.phone) {
      return userInfo.phone;
    }
    if (userInfo.login_type === "email") {
      return userInfo.email || userInfo.profile?.email || null;
    }

    if (userInfo.phone) {
      return userInfo.phone;
    }
    if (userInfo.email) {
      return userInfo.email;
    }
    if (userInfo.profile?.email) {
      return userInfo.profile.email;
    }

    return null;
  };

  const contactInfo = getContactInfo();

  const summaryItems = [
    {
      label: "মোট খরচ",
      value: formatCurrency(summary.total_spent),
      icon: <BsWallet2 />,
    },
    {
      label: "ইন্ডিভিজুয়াল কোর্স",
      value: englishToBanglaNumbers(summary.total_courses_enrolled),
      icon: <BsBook />,
    },
    {
      label: "কম্বো",
      value: englishToBanglaNumbers(summary.total_bundles_purchased),
      icon: <BsBoxSeam />,
    },
    {
      label: "মোট ট্রানজেকশন",
      value: englishToBanglaNumbers(summary.total_transactions),
      icon: <BsArrowRepeat />,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="bg-linear-to-r from-primary to-primary/85 px-6 py-6">
        <h2 className="text-2xl font-bold text-primary-foreground mb-1">
          পেমেন্ট সামারি
        </h2>
        <p className="text-primary-foreground/85">
          {userInfo.name}
          {contactInfo && ` • ${contactInfo}`}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryItems.map((item, index) => (
            <div
              key={index}
              className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-primary">{item.value}</p>
              </div>
              <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              খরচের বিবরণ
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ইন্ডিভিজুয়াল কোর্স:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(summary.total_individual_spent)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">কম্বো:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(summary.total_bundle_spent)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between items-center">
                <span className="text-foreground font-semibold">সর্বমোট:</span>
                <span className="font-bold text-primary text-lg">
                  {formatCurrency(summary.total_spent)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              অ্যাকাউন্ট তথ্য
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground">নাম:</span>
                <span className="ml-2 font-medium text-foreground">{userInfo.name}</span>
              </div>
              {userInfo.phone && (
                <div>
                  <span className="text-muted-foreground">ফোন:</span>
                  <span className="ml-2 font-medium text-foreground">{userInfo.phone}</span>
                </div>
              )}
              {userInfo.email && (
                <div>
                  <span className="text-muted-foreground">ইমেইল:</span>
                  <span className="ml-2 font-medium text-foreground">{userInfo.email}</span>
                </div>
              )}
              {!userInfo.email && userInfo.profile?.email && (
                <div>
                  <span className="text-muted-foreground">ইমেইল:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {userInfo.profile.email}
                  </span>
                </div>
              )}
              {userInfo.profile?.address && (
                <div>
                  <span className="text-muted-foreground">ঠিকানা:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {userInfo.profile.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
