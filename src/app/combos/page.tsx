"use client";

import Nav from "@/components/Nav";
import { HindSiliguri } from "@/helpers";
import SEO from "@/components/SEO";
import Footer from "@/components/footer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/Contexts/UserContext";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { siteConfig } from "@/config/site.config";
import { BsChevronRight, BsBook, BsGift } from "react-icons/bs";
import { FaUsers, FaRupeeSign } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import { useBundleMetrics } from "@/hooks/useBundleAnalytics";
import { useEnhancedBundle } from "@/hooks/useEnhancedBundle";
import { isLoggedIn } from "@/helpers";

interface BundleCourse {
  id: number;
  title: string;
  price: number;
  url: string;
}

interface Bundle {
  id: number;
  title: string;
  price: number;
  url: string;
  courses: BundleCourse[];
  course_count: number;
}

interface BundlesResponse {
  success: boolean;
  data: Bundle[];
}

export default function BundlesPage() {
  const [user, setUser] = useContext<any>(UserContext);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { calculateBundleMetrics } = useBundleMetrics();
  const { checkDuplicateCourses } = useEnhancedBundle();
  const [bundleDuplicates, setBundleDuplicates] = useState<Record<number, any>>({});

  useEffect(() => {
    fetchBundles();
  }, []);

  const checkBundleDuplicates = async (bundlesList: Bundle[]) => {
    try {
      const duplicatePromises = bundlesList.map(async (bundle) => {
        const duplicateCheck = await checkDuplicateCourses(bundle.id);
        return { bundleId: bundle.id, duplicateCheck };
      });

      const results = await Promise.all(duplicatePromises);
      const duplicatesMap: Record<number, any> = {};
      
      results.forEach(({ bundleId, duplicateCheck }) => {
        if (duplicateCheck) {
          duplicatesMap[bundleId] = duplicateCheck;
        }
      });

      setBundleDuplicates(duplicatesMap);
    } catch (error) {
      console.error('Error checking bundle duplicates:', error);
    }
  };

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const response = await axios.get<BundlesResponse>(
        `${BACKEND_URL}/user/bundle`
      );
      
      if (response.data.success) {
        setBundles(response.data.data);
        
        // Calculate and log bundle metrics
        const metrics = calculateBundleMetrics(response.data.data);
        console.log('Bundle Metrics:', metrics);

        // Check for duplicates for each bundle (if user is logged in)
        if (isLoggedIn()) {
          checkBundleDuplicates(response.data.data);
        }
      } else {
        setError("Failed to fetch bundles");
        toast.error("Failed to fetch bundles");
      }
    } catch (error) {
      console.error("Error fetching bundles:", error);
      setError("Failed to fetch bundles");
      toast.error("Failed to fetch bundles");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  const calculateTotalOriginalPrice = (courses: BundleCourse[]) => {
    return courses.reduce((total, course) => total + course.price, 0);
  };

  const calculateDiscount = (bundlePrice: number, originalTotal: number) => {
    return Math.round(((originalTotal - bundlePrice) / originalTotal) * 100);
  };

  const BundleCard = ({ bundle }: { bundle: Bundle }) => {
    const originalTotal = calculateTotalOriginalPrice(bundle.courses);
    const discount = calculateDiscount(bundle.price, originalTotal);
    const savings = originalTotal - bundle.price;
    
    return (
      <div className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-border">
        {/* Bundle Header */}
        <div className="relative bg-linear-to-br from-primary to-teal p-6">
          <div className="absolute top-4 right-4 bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-bold">
            {discount}% ছাড়
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <BsGift className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Bundle Deal</h3>
              <p className="text-white/80 text-sm">{bundle.course_count}টি কোর্স একসাথে</p>
            </div>
          </div>
        </div>

        {/* Bundle Content */}
        <div className="p-6">
          {/* Bundle Title */}
          <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {bundle.title}
          </h3>

          {/* Courses Preview */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              এই Bundle এ যা যা আছে:
            </p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {bundle.courses.slice(0, 3).map((course) => (
                <div key={course.id} className="flex items-center gap-2 text-sm">
                  <BsBook className="text-teal text-xs" />
                  <span className="text-muted-foreground line-clamp-1">
                    {course.title}
                  </span>
                </div>
              ))}
              {bundle.courses.length > 3 && (
                <div className="text-sm text-primary font-medium">
                  + আরো {bundle.courses.length - 3}টি কোর্স
                </div>
              )}
            </div>
          </div>

          {/* Bundle Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <BsBook className="text-teal" />
              <span className="text-muted-foreground">
                {bundle.course_count}টি কোর্স
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <FaRupeeSign className="text-warning" />
              <span className="text-muted-foreground">
                {formatPrice(savings)} সাশ্রয়
              </span>
            </div>
          </div>

          {/* Price Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(bundle.price)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(originalTotal)}
                </span>
              </div>
            </div>
            <p className="text-success font-semibold text-sm">
              আপনি সাশ্রয় করবেন {formatPrice(savings)}
            </p>
          </div>

          {/* Action Button */}
          <Link href={`/bundle/${bundle.id}`}>
            <button className="w-full bg-linear-to-r from-primary to-teal text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:from-teal hover:to-primary transition-all duration-300 flex items-center justify-center gap-2 group">
              Bundle দেখুন
              <BsChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${HindSiliguri.variable} font-hind overflow-x-hidden`}>
        <SEO
          title="Course Bundles - CoderVai"
          description="Explore course bundles at CoderVai and save money"
        />
        <Nav />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="mt-4 text-muted-foreground">
              Bundle গুলি লোড হচ্ছে...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${HindSiliguri.variable} font-hind overflow-x-hidden`}>
        <SEO
          title="Course Bundles - CoderVai"
          description="Explore course bundles at CoderVai"
        />
        <Nav />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <button
              onClick={fetchBundles}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-colors"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${HindSiliguri.variable} font-hind overflow-x-hidden`}>
      <SEO
        title="Course Bundles - CoderVai"
        description="Explore comprehensive course bundles at CoderVai. Get multiple courses at discounted prices and save money while learning from BUET CSE instructors."
      />
      <Nav />
      <Toaster position="top-right" />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-40 right-0 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />
      </div>

      <main className="relative z-10 pt-20 bg-background min-h-screen">
        <div className="w-[90%] lg:w-[85%] mx-auto py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              কোর্স <span className="text-primary">Bundle</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              একাধিক কোর্স একসাথে কিনুন এবং সাশ্রয় করুন। BUET CSE এর অভিজ্ঞ ইন্সট্রাক্টর এবং 
              Google ইঞ্জিনিয়ারদের কাছ থেকে শিখুন কম খরচে।
            </p>
            
            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <FaRupeeSign className="text-primary" />
                <span>বেশি সাশ্রয়</span>
              </div>
              <div className="flex items-center gap-2 bg-teal/10 px-4 py-2 rounded-full border border-teal/20">
                <BsBook className="text-teal" />
                <span>একাধিক কোর্স</span>
              </div>
              <div className="flex items-center gap-2 bg-warning/10 px-4 py-2 rounded-full border border-warning/20">
                <BsGift className="text-warning" />
                <span>বিশেষ ছাড়</span>
              </div>
            </div>
          </div>

          {/* Bundles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>

          {/* Empty State */}
          {bundles.length === 0 && !loading && (
            <div className="text-center py-20">
              <BsGift className="text-6xl text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                কোনো Bundle পাওয়া যায়নি
              </h3>
              <p className="text-muted-foreground mb-6">
                শীঘ্রই নতুন Bundle যোগ করা হবে।
              </p>
              <Link href="/courses">
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-colors">
                  আলাদা কোর্স দেখুন
                </button>
              </Link>
            </div>
          )}

          {/* Call to Action */}
          {bundles.length > 0 && (
            <div className="mt-16 text-center bg-linear-to-r from-primary/10 to-teal/10 rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                আলাদা কোর্স খুঁজছেন?
              </h3>
              <p className="text-muted-foreground mb-6">
                আমাদের সকল কোর্স দেখুন এবং আপনার পছন্দের কোর্স বেছে নিন
              </p>
              <Link href="/courses">
                <button className="bg-linear-to-r from-primary to-teal text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:from-teal hover:to-primary transition-all duration-300">
                  সকল কোর্স দেখুন
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppWidget phoneNumber={siteConfig.contact.phone} />
    </div>
  );
}
