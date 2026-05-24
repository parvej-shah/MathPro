import React from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";

const NextSteps: React.FC = () => {
  return (
    <div className="animate-slideUp stagger-5">
      <h2 className="text-3xl lg:text-4xl font-bold text-center text-foreground dark:text-white mb-12">
        পরবর্তী ধাপ
      </h2>
      <div className="flex justify-center">
        {/* Dashboard */}
        <div className="bg-purple/5 dark:bg-purple/10 rounded-2xl p-8 border border-purple/10 dark:border-purple/20 hover:border-purple/30 transition-colors text-center group max-w-md w-full">
          <div className="w-12 h-12 mx-auto bg-purple text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-purple/20 group-hover:scale-110 transition-transform">
            1
          </div>
          <h3 className="text-xl font-bold text-foreground dark:text-white mb-3">
            ড্যাশবোর্ডে যান
          </h3>
          <p className="text-muted-foreground mb-8 text-sm">
            আপনার ড্যাশবোর্ডে গিয়ে কেনা কোর্সগুলো দেখতে পাবেন এবং শেখা শুরু করতে
            পারবেন
          </p>
          <Link href="/dashboard">
            <button className="w-full py-3 px-6 bg-purple text-white rounded-xl font-bold hover:bg-purple/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <FaPlay /> ড্যাশবোর্ড
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NextSteps;
