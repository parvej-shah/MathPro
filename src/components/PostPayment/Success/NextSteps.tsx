import React from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";

interface NextStepsProps {
  type?: "bundle" | "course" | "book";
}

const NextSteps: React.FC<NextStepsProps> = ({ type = "course" }) => {
  const isBook = type === "book";
  const heading = isBook ? "অর্ডার হিস্টরি দেখো" : "ড্যাশবোর্ডে যাও";
  const description = isBook
    ? "তোমার পেমেন্ট হিস্টরি থেকে বইয়ের অর্ডার স্ট্যাটাস দেখতে পাবে। বইটি খুব শীঘ্রই তোমার ঠিকানায় পাঠানো হবে।"
    : "তোমার ড্যাশবোর্ডে গিয়ে কেনা কোর্সগুলো দেখতে পাবে এবং শেখা শুরু করতে পারবে";
  const href = isBook ? "/billing" : "/dashboard";
  const buttonLabel = isBook ? "পেমেন্ট হিস্টরি" : "ড্যাশবোর্ড";

  return (
    <div className="animate-slideUp stagger-5">
      <h2 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-12">
        পরবর্তী ধাপ
      </h2>
      <div className="flex justify-center">
        <div className="bg-primary/5 rounded-2xl p-8 border border-primary/15 hover:border-primary/30 transition-colors text-center group max-w-md w-full">
          <div className="w-12 h-12 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            1
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">
            {heading}
          </h3>
          <p className="text-muted-foreground mb-8 text-sm">
            {description}
          </p>
          <Link href={href}>
            <button className="w-full py-3 px-6 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <FaPlay /> {buttonLabel}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NextSteps;
