export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-3xl w-full z-10 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Next.js + Tailwind CSS v4 Ready
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Workspace Project
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            আপনার Next.js এবং Tailwind CSS v4 প্রজেক্টের সব ফাইল প্রস্তুত করা হয়েছে।
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-3 gap-4 pt-4 text-left">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 transition">
            <div className="text-indigo-400 text-xl font-bold mb-1">App Router</div>
            <p className="text-sm text-slate-400">Next.js এর লেটেস্ট App Router ডিরেক্টরি সেটআপ করা আছে।</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 transition">
            <div className="text-purple-400 text-xl font-bold mb-1">Tailwind v4</div>
            <p className="text-sm text-slate-400">আধুনিক Tailwind CSS v4 ও PostCSS কনফিগারেশন যোগ করা হয়েছে।</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 transition">
            <div className="text-pink-400 text-xl font-bold mb-1">TypeScript</div>
            <p className="text-sm text-slate-400">TypeScript 5 এবং আধুনিক ESLint সেটআপ সম্পন্ন।</p>
          </div>
        </div>

        {/* Quick Instructions */}
        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800/80 font-mono text-xs sm:text-sm text-slate-300 inline-block text-left">
          <span className="text-slate-500"># Start developing:</span>
          <p className="text-emerald-400 font-semibold mt-1">npm run dev</p>
        </div>
      </div>
    </main>
  );
}
