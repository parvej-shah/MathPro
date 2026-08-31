import Link from "next/link";
import { ArrowUpRight, MapPin, Mail, Phone, Clock, Truck } from "lucide-react";

const footerLinks = [
  {
    title: "কোর্স ও কম্বো",
    links: [
      { name: "সকল কোর্স", href: "/courses" },
      { name: "কম্বো অফারসমূহ", href: "/combos" },
      { name: "সহায়ক বইসমূহ", href: "/books" },
      { name: "শিক্ষার্থী লিডারবোর্ড", href: "/ranking" },
    ],
  },
  {
    title: "প্রয়োজনীয় লিংক",
    links: [
      { name: "আমাদের সম্পর্কে", href: "/about" },
      { name: "যোগাযোগ ও সাপোর্ট", href: "/contact" },
      { name: "রিফান্ড ও রিটার্ন নীতি", href: "/refund" },
      { name: "শর্তাবলী (Terms)", href: "/terms" },
      { name: "গোপনীয়তা নীতি (Privacy)", href: "/privacy" },
    ],
  },
  {
    title: "আইনি ও পলিসি",
    links: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Refund & Return Policy", href: "/refund" },
      { name: "Company Details", href: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 selection:bg-emerald-500 selection:text-white border-t border-white/10">
      {/* Top Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 border-b border-white/10">

        {/* Info Column */}
        <div className="p-8 border-b md:border-b-0 md:border-r border-white/10 lg:col-span-2 flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold tracking-tight uppercase mb-2 text-emerald-400">
              MathPro Academic and Admission Care
            </h3>
            <p className="font-semibold text-base max-w-sm leading-snug text-slate-300">
              JSC, SSC ও HSC শিক্ষার্থীদের গণিত ভীতি দূর করে বোর্ড পরীক্ষায় A+ নিশ্চিত করার বিশ্বস্ত অনলাইন প্ল্যাটফর্ম।
            </p>

            <div className="mt-5 space-y-2.5 text-xs text-slate-400 max-w-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                <span>
                  ৫১/১/এ-১, নোবেল ভিলা, উত্তর মুগদা, ঢাকা-১২১৪, বাংলাদেশ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-emerald-400" />
                <a href="mailto:mathprobdofficial@gmail.com" className="hover:text-emerald-400 transition-colors">
                  mathprobdofficial@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-emerald-400" />
                <a href="tel:+8801521323689" className="hover:text-emerald-400 transition-colors">
                  +880 1521-323689
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Truck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  ডেলিভারি: ডিজিটাল কোর্সে তাৎক্ষণিক | বই ৩-৫ কার্যদিবস
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 rounded-full font-bold text-xs hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-colors"
            >
              তোমার কোর্স বেছে নাও <ArrowUpRight className="w-4 h-4" />
            </Link>

            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                অনুমোদিত পেমেন্ট গেটওয়ে
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                SSLCommerz · bKash · Nagad · Rocket · Visa · Mastercard · Amex · Internet Banking
              </p>
            </div>
          </div>
        </div>

        {/* Link Columns */}
        {footerLinks.map((group, i) => (
          <div
            key={i}
            className="p-8 border-b md:border-b-0 md:border-r last:border-r-0 border-white/10 flex flex-col"
          >
            <h3 className="text-sm font-bold tracking-tight uppercase mb-6 pb-2 border-b border-white/10 inline-block w-full text-emerald-400">
              {group.title}:
            </h3>
            <ul className="space-y-3.5 flex-1">
              {group.links.map((link, j) => (
                <li key={j}>
                  <Link
                    href={link.href}
                    className="font-medium text-xs hover:text-emerald-400 hover:underline underline-offset-4 tracking-wide text-slate-300 hover:opacity-100 transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Massive Typography Section */}
      <div className="w-full overflow-hidden flex flex-col items-center justify-center pt-8 pb-12 relative px-4">
        {/* Bottom bar texts */}
        <div className="w-full flex flex-wrap justify-between items-center gap-2 absolute bottom-4 px-4 text-[10px] md:text-xs font-bold uppercase tracking-widest z-10 text-slate-500">
          <span>&copy; {new Date().getFullYear()} MathPro Academic and Admission Care</span>
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/about" className="hover:text-emerald-400 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Contact
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund" className="hover:text-emerald-400 transition-colors">
              Refund Policy
            </Link>
          </div>
          <span className="hidden md:inline-block">All Rights Reserved.</span>
        </div>

        {/* Giant Text */}
        <div className="@container mt-4 mb-8 md:mb-4 w-full max-w-[90vw] cursor-default text-center transition-transform duration-500 hover:scale-[1.02]">
          <h1 className="font-logo text-[clamp(2.5rem,14.4cqw,20rem)] leading-none font-black tracking-normal select-none whitespace-nowrap text-emerald-500 transition-colors duration-500 hover:text-slate-50">
            MATHPRO
          </h1>
        </div>
      </div>
    </footer>
  );
}
