import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
              ঢাকায় ৮ম-১২শ শ্রেণির শিক্ষার্থীদের জন্য প্রিমিয়ার অনলাইন গণিত কোচিং প্ল্যাটফর্ম। গণিত শেখো। পরীক্ষায় বিজয়ী হও।
            </p>
          </div>

          <div className="mt-12">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 rounded-full font-bold text-sm hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors"
            >
              কোর্সগুলো দেখুন <ArrowUpRight className="w-4 h-4" />
            </a>
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
          <span className="hidden sm:inline-block">Terms & Conditions</span>
          <span className="hidden sm:inline-block">Privacy Policy</span>
          <span className="hidden md:inline-block">All Rights Reserved.</span>
        </div>

        {/* Giant Text */}
        <div className="mt-4 mb-8 md:mb-4 w-full max-w-[90vw] cursor-default text-center transition-transform duration-500 hover:scale-[1.02]">
          <h1 className="font-logo text-[clamp(5.5rem,15vw,20rem)] leading-none font-black tracking-normal select-none whitespace-nowrap text-emerald-500 transition-colors duration-500 hover:text-slate-50">
            MATHPRO
          </h1>
        </div>
      </div>
    </footer>
  );
}
