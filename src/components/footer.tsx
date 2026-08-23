import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

const footerLinks = [
  {
    title: "কোর্সসমূহ",
    links: [
      { name: "অষ্টম শ্রেণি গণিত", href: "#" },
      { name: "নবম-দশম শ্রেণি গণিত", href: "#" },
      { name: "এইচএসসি গণিত", href: "#" },
      { name: "অ্যাডমিশন প্রস্তুতি", href: "#" },
    ],
  },
  {
    title: "রিসোর্সসমূহ",
    links: [
      { name: "ভিডিও লেকচার", href: "#" },
      { name: "মক এক্সাম", href: "#" },
      { name: "সূত্রসমূহ", href: "#" },
      { name: "লিডারবোর্ড", href: "#" },
    ],
  },
  {
    title: "MATHPRO",
    links: [
      { name: "আমাদের সম্পর্কে", href: "#" },
      { name: "সফলতার গল্প", href: "#" },
      { name: "সাপোর্ট যোগাযোগ", href: "#" },
      { name: "কমিউনিটিতে যুক্ত হও", href: "#" },
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
            <h3 className="text-sm font-bold tracking-tight uppercase mb-4 text-emerald-400">
              MATHPRO প্ল্যাটফর্ম:
            </h3>
            <p className="font-semibold text-lg max-w-sm leading-snug text-slate-300">
              JSC, SSC ও HSC শিক্ষার্থীদের গণিত ভীতি দূর করে বোর্ড পরীক্ষায় A+ নিশ্চিত করার বিশ্বস্ত অনলাইন প্ল্যাটফর্ম। (Bangla Medium & English Version)
            </p>
            <div className="mt-6 flex items-start gap-2 text-sm text-slate-400 max-w-sm">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              <span>
                MathPro Academic and Admission Care, ৫১/১/এ-১, নোবেল ভিলা, উত্তর মুগদা, ঢাকা-১২১৪
              </span>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 rounded-full font-bold text-sm hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors"
            >
              তোমার কোর্স বেছে নাও <ArrowUpRight className="w-4 h-4" />
            </Link>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                পেমেন্ট মাধ্যম
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                bKash · Nagad · Rocket · Visa · Mastercard · American Express · ইন্টারনেট ব্যাংকিং
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
            <h3 className="text-sm font-bold tracking-tight uppercase mb-8 pb-2 border-b border-white/10 inline-block w-full text-emerald-400">
              {group.title}:
            </h3>
            <ul className="space-y-4 flex-1">
              {group.links.map((link, j) => (
                <li key={j}>
                  <Link
                    href={link.href}
                    className="font-medium text-sm hover:text-emerald-400 hover:underline underline-offset-4 uppercase tracking-wide opacity-80 hover:opacity-100 transition-all"
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
        <div className="w-full flex justify-between absolute bottom-4 px-4 text-[10px] md:text-xs font-bold uppercase tracking-widest z-10 text-slate-500">
          <span>&copy; {new Date().getFullYear()} MathPro Inc.</span>
          <Link href="/terms" className="hidden sm:inline-block hover:text-emerald-400 transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="hidden sm:inline-block hover:text-emerald-400 transition-colors">
            Privacy Policy
          </Link>
          <span className="hidden md:inline-block">All Rights Reserved.</span>
        </div>

        {/* Giant Text */}
        <div className="@container mt-4 mb-8 md:mb-4 w-full max-w-[90vw] cursor-default text-center transition-transform duration-500 hover:scale-[1.02]">
          {/* Sized in cqw against this wrapper, not vw. The wrapper is capped at
              90vw and sits inside the section's px-4, so a vw-based size was
              measured against a box ~10vw+32px wider than the one the text
              actually occupies. cqw keeps the two in sync if either changes.
              No rem floor: a fixed minimum keeps the 7-character wordmark wider
              than a phone screen, and whitespace-nowrap then overflows it. */}
          <h1 className="font-logo text-[clamp(2.5rem,14.4cqw,20rem)] leading-none font-black tracking-normal select-none whitespace-nowrap text-emerald-500 transition-colors duration-500 hover:text-slate-50">
            MATHPRO
          </h1>
        </div>
      </div>
    </footer>
  );
}
