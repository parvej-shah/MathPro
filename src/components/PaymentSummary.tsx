import React from "react";
import { Summary, UserInfo } from "../hooks/usePaymentHistory";

interface PaymentSummaryProps {
  summary: Summary;
  userInfo: UserInfo;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  summary,
  userInfo,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to get contact info for display
  const getContactInfo = () => {
    // Use login_type if available
    if (userInfo.login_type === "phone" && userInfo.phone) {
      return userInfo.phone;
    }
    if (userInfo.login_type === "email") {
      return userInfo.email || userInfo.profile?.email || null;
    }

    // Fallback for legacy data
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
      label: "Total Spent",
      value: formatCurrency(summary.total_spent),
      icon: "💰",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Individual Courses",
      value: summary.total_courses_enrolled.toString(),
      icon: "📚",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      label: "Bundle Purchases",
      value: summary.total_bundles_purchased.toString(),
      icon: "📦",
      color: "text-purple",
      bgColor: "bg-purple/10",
    },
    {
      label: "Total Transactions",
      value: summary.total_transactions.toString(),
      icon: "🔄",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="bg-background rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white mb-1">Payment Summary</h2>
        <p className="text-info-foreground">
          {userInfo.name}
          {contactInfo && ` • ${contactInfo}`}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryItems.map((item, index) => (
            <div
              key={index}
              className={`${item.bgColor} rounded-lg p-4 border-l-4 ${
                item.color.includes("green")
                  ? "border-success"
                  : item.color.includes("blue")
                    ? "border-info"
                    : item.color.includes("purple")
                      ? "border-purple"
                      : "border-orange-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                </div>
                <div className="text-3xl">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Spending Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Individual Courses:</span>
                <span className="font-semibold text-info">
                  {formatCurrency(summary.total_individual_spent)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bundle Purchases:</span>
                <span className="font-semibold text-purple">
                  {formatCurrency(summary.total_bundle_spent)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-foreground font-semibold">Total:</span>
                <span className="font-bold text-success text-lg">
                  {formatCurrency(summary.total_spent)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Account Details
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">{userInfo.name}</span>
              </div>
              {userInfo.phone && (
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="ml-2 font-medium">{userInfo.phone}</span>
                </div>
              )}
              {userInfo.email && (
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2 font-medium">{userInfo.email}</span>
                </div>
              )}
              {/* Show profile email if top-level email is not available */}
              {!userInfo.email && userInfo.profile?.email && (
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2 font-medium">
                    {userInfo.profile.email}
                  </span>
                </div>
              )}
              {userInfo.profile?.address && (
                <div>
                  <span className="text-muted-foreground">Address:</span>
                  <span className="ml-2 font-medium">
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
