const fs = require('fs');

const file = 'src/components/landing-page.tsx';
let data = fs.readFileSync(file, 'utf8');

const replacement = `      {/* --- OFFLINE BRANCHES (O2O Strategy) --- */}
      <section id="branches" className="py-32 bg-white overflow-hidden relative">
        {/* Very subtle background texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center max-w-[1400px] mx-auto">
            
            {/* Map Visual (Left Side) */}
            <div className="relative h-[550px] w-full rounded-[3rem] bg-[#eafdfl] border border-[#d1fae5] flex items-center justify-center overflow-hidden shadow-2xl shadow-emerald-900/5 group" style={{ backgroundColor: '#e6fcf5' }}>
              {/* Subtle animated blobs inside the map container */}
              <div className="absolute top-10 left-10 w-64 h-64 bg-white/40 rounded-full blur-3xl mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#a7f3d0]/50 rounded-full blur-3xl mix-blend-overlay group-hover:translate-x-5 transition-transform duration-1000"></div>
              
              {/* Soft aesthetic map SVG overlapping */}
              <svg className="absolute w-[180%] h-[180%] text-[#a7f3d0]/30 -rotate-12 scale-125" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.1C87.4,-33.1,90,-16.5,88.5,-0.9C87.1,14.8,81.6,29.6,73.5,42.4C65.5,55.1,54.9,65.8,42.1,73.6C29.3,81.4,14.7,86.2,0.3,85.7C-14.1,85.1,-28.1,79.3,-40.1,71.1C-52.1,62.9,-62,52.3,-70.5,40.1C-79,27.8,-86,13.9,-85.9,0C-85.8,-13.9,-78.6,-27.8,-70.2,-40.3C-61.9,-52.8,-52.4,-63.9,-40.5,-72.1C-28.6,-80.3,-14.3,-85.6,0.3,-86.1C15,-86.7,29.9,-82.5,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
              
              {/* Branch Pin 1 - Mirpur */}
              <motion.div 
                initial={{ sm: {y: -20, opacity: 0}, opacity: 0}}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="absolute top-[30%] left-[20%] flex flex-col items-center"
              >
                <div className="bg-white px-5 py-2.5 rounded-2xl shadow-xl shadow-slate-200/50 text-[15px] font-extrabold text-slate-800 mb-3 border border-slate-100 flex items-center gap-2 tracking-wide">
                  মিরপুর শাখা
                </div>
                <div className="size-5 bg-[#059669] rounded-full border-[3px] border-white shadow-md relative z-10">
                   <div className="absolute inset-0 bg-[#059669] rounded-full animate-ping opacity-60"></div>
                </div>
              </motion.div>

              {/* Branch Pin 2 - Uttara */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-[35%] right-[25%] flex flex-col items-center"
              >
                <div className="bg-white px-5 py-2.5 rounded-2xl shadow-xl shadow-slate-200/50 text-[15px] font-extrabold text-slate-800 mb-3 border border-slate-100 flex items-center gap-2 tracking-wide">
                  উত্তরা শাখা
                </div>
                <div className="size-5 bg-[#059669] rounded-full border-[3px] border-white shadow-md relative z-10">
                   <div className="absolute inset-0 bg-[#059669] rounded-full animate-ping opacity-60"></div>
                </div>
              </motion.div>
            </div>

            {/* Content (Right Side) */}
            <div className="flex flex-col items-start lg:pl-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0fdf4] text-[#059669] border border-[#d1fae5] text-xs font-bold uppercase tracking-widest mb-6">
                <MapPin className="size-3.5 stroke-[2.5]" />
                আমাদের শাখাসমূহ
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.15] text-slate-900 font-heading">
                অনলাইনে শেখো।<br/>অফলাইনে যুক্ত হও।
              </h2>
              <p className="text-slate-500 text-[1.15rem] mb-12 leading-relaxed font-medium">
                অনলাইনে সেরা অভিজ্ঞতার পাশাপাশি, ঢাকায় MathPro-এর অফলাইন শাখাও রয়েছে। মক এক্সাম দিতে, প্রিন্টেড শিট নিতে বা শিক্ষকদের সাথে সরাসরি কথা বলতে চলে এসো আমাদের শাখায়।
              </p>
              
              <div className="space-y-5 w-full">
                {[
                  { name: "মিরপুর ১০ সেন্টার", address: "বাড়ি ১২, রোড ৪, ব্লক সি, মিরপুর, ঢাকা", mapUrl: "https://maps.google.com/?q=Mirpur+10+Center,+Dhaka" },
                  { name: "উত্তরা সেক্টর ৭", address: "সেক্টর ৭, সোনারগাঁও জনপথ রোড, ঢাকা", mapUrl: "https://maps.google.com/?q=Uttara+Sector+7,+Dhaka" }
                ].map((branch, i) => (
                  <a key={i} href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 md:p-8 rounded-[1.5rem] border border-slate-200 hover:border-emerald-300 transition-all duration-300 bg-[#fbfdfc] hover:bg-white group cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1">
                    <div>
                      <h4 className="font-extrabold text-[22px] text-slate-900 mb-1.5 font-heading tracking-tight">{branch.name}</h4>
                      <p className="text-slate-500 font-medium text-[15px]">{branch.address}</p>
                    </div>
                    <div className="size-12 rounded-full bg-[#f1f5f9] text-slate-400 group-hover:text-[#059669] group-hover:bg-[#e6f7ef] flex items-center justify-center transition-colors shadow-sm">
                      <ChevronRight className="size-6 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>`;

// Replace logic
let start = data.indexOf('{/* --- OFFLINE BRANCHES (O2O Strategy) --- */}');
let end = data.indexOf('{/* --- FOOTER CTA --- */}');

if(start !== -1 && end !== -1) {
  let before = data.substring(0, start);
  let after = data.substring(end);
  fs.writeFileSync(file, before + replacement + '\n\n      ' + after);
} else {
  console.log("Could not find delimiters!");
}
