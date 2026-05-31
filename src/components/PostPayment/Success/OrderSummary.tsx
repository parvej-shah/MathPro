import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { PurchaseData } from "./types";

interface OrderSummaryProps {
    data: PurchaseData;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ data }) => {
    const [copied, setCopied] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("bn-BD", {
            style: "currency",
            currency: "BDT",
            minimumFractionDigits: 0,
        })
            .format(price)
            .replace("BDT", "৳");
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

    const copyAccessCode = () => {
        if (data?.transaction_id) {
            navigator.clipboard.writeText(data.transaction_id);
            setCopied(true);
            toast.success("Transaction ID কপি হয়েছে!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="animate-slideUp stagger-2 max-w-2xl mx-auto w-full">
            <div className="bg-card/70 backdrop-blur-3xl rounded-[30px] p-8 lg:p-12 border border-border shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <h2 className="text-3xl font-bold text-center text-foreground mb-10 border-b border-border pb-6">
                    অর্ডার সারাংশ
                </h2>

                <div className="space-y-6">
                    <div className="flex justify-between items-center text-base lg:text-lg">
                        <span className="text-muted-foreground font-medium">
                            অর্ডার তারিখ
                        </span>
                        <span className="text-foreground font-bold">
                            {formatDate(data.purchase_date)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-base lg:text-lg">
                        <span className="text-muted-foreground font-medium">
                            পেমেন্ট মেথড
                        </span>
                        <span className="text-foreground font-bold">
                            bKash / Nagad / Card
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-base lg:text-lg">
                        <span className="text-muted-foreground font-medium">
                            সর্বমোট পেমেন্ট
                        </span>
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-teal">
                            {formatPrice(data.amount || data.price)}
                        </span>
                    </div>

                    {/* Transaction ID / Access Code Box */}
                    {data.transaction_id && (
                        <div className="mt-8 pt-6 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-3 text-center uppercase tracking-wider font-semibold">
                                Access Code / Transaction ID
                            </p>
                            <div
                                onClick={copyAccessCode}
                                className="group flex items-center justify-between bg-muted/40 border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <code className="text-lg lg:text-xl font-mono font-bold text-foreground tracking-wide relative z-10">
                                    {data.transaction_id}
                                </code>
                                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-sm border border-border group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    {copied ? (
                                        <FaCheck className="text-success" />
                                    ) : (
                                        <FaCopy className="text-primary" />
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-center text-muted-foreground mt-2">
                                কপি করতে ক্লিক করুন • ফেসবুক গ্রুপে জয়েন করার জন্য এই কোড ব্যবহার করুন
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
