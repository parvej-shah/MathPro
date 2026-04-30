const fs = require('fs');

const file = 'src/components/landing-page.tsx';
let data = fs.readFileSync(file, 'utf8');

const replacement = `      {/* --- FEATURED COURSES (Grouped) --- */}
      <section id="courses" className="py-28 bg-[#f4f7fe]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-24">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-slate-900 font-heading">
              আমাদের জনপ্রিয় <span className="text-[#059669]">কোর্সসমূহ</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">
              দেশের সেরা শিক্ষকদের সাথে তোমার স্বপ্ন পূরণের যাত্রা শুরু হোক এখান থেকেই।
            </p>
          </div>

          <div className="flex flex-col gap-24">
            {groupedCourses.map((group, i) => (
              <div key={i} className="flex flex-col">
                {/* Category Header & Tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-10">
                  <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-[#1e293b]">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 lg:ml-6">
                    {group.tabs.map((tab, idx) => (
                      <button 
                        key={idx} 
                        className={\`px-6 py-2 rounded-full text-sm font-bold transition-all \${
                          idx === 0 
                            ? 'bg-[#1e293b] text-white shadow-xl shadow-slate-900/10' 
                            : 'bg-white border border-[#e2e8f0] text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'
                        }\`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                  {group.items.map((course, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -8 }}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col"
                    >
                      {/* Fake Thumbnail Banner */}
                      <div className={\`h-48 w-full bg-gradient-to-tr \${course.gradient} p-6 relative overflow-hidden flex flex-col justify-center items-center text-center\`}>
                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                        <h4 className="text-white font-extrabold text-xl lg:text-2xl z-10 leading-tight font-heading drop-shadow-md">
                          {course.title.split('|')[0].trim()}
                        </h4>
                        {course.price && (
                          <div className="mt-4 bg-[#e11d48] text-white text-[13px] font-bold px-4 py-1.5 rounded-full z-10 animate-pulse border border-[#f43f5e] shadow-lg shadow-rose-900/20">
                            {course.price}
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md size-8 flex items-center justify-center rounded-xl z-20 font-bold text-white text-xs">
                          MathPro
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-7 flex flex-col flex-1 bg-white">
                        <div className="flex flex-wrap gap-2 mb-5">
                          {course.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="px-3 py-1.5 bg-[#f1f5f9] text-[#475569] rounded-lg text-[10px] font-extrabold uppercase tracking-widest border border-slate-200/50">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <h4 className="font-extrabold text-[1.1rem] text-slate-900 leading-snug mb-3 font-heading group-hover:text-[#059669] transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-[14px] font-medium text-slate-500 mb-8 leading-relaxed line-clamp-3 flex-1">
                          {course.desc}
                        </p>
                        
                        {/* CTA Button */}
                        <button className="w-full mt-auto bg-[#fbbf24] hover:bg-[#f59e0b] shadow-lg hover:shadow-[#fbbf24]/30 shadow-[#fbbf24]/20 text-[#1e293b] font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 group/btn">
                          বিস্তারিত দেখি 
                          <ArrowRight className="size-[18px] group-hover/btn:translate-x-1.5 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>`;

// Replace logic
let start = data.indexOf('{/* --- FEATURED COURSES --- */}');
let end = data.indexOf('{/* --- OFFLINE BRANCHES (O2O Strategy) --- */}');

if(start !== -1 && end !== -1) {
  let before = data.substring(0, start);
  let after = data.substring(end);
  fs.writeFileSync(file, before + replacement + '\n\n      ' + after);
} else {
  console.log("Could not find delimiters!");
}
