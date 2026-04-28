import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="p-5 bg-white/5 border border-white/10 rounded-3xl mb-8 shadow-2xl backdrop-blur-xl">
          <Shield className="w-16 h-16 text-emerald-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-500 drop-shadow-lg">
          Digital Executor
        </h1>
        <p className="text-xl text-neutral-400 max-w-xl mb-12 leading-relaxed">
          The zero-knowledge life-logic vault. Securely monitor your safety and automatically release vital instructions to your loved ones when you're gone.
        </p>
        
        <Link 
          href="/vault/dashboard"
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-emerald-600/80 backdrop-blur-md border border-emerald-500/50 rounded-2xl hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 shadow-[0_0_40px_rgba(52,211,153,0.2)] hover:shadow-[0_0_60px_rgba(52,211,153,0.4)] hover:-translate-y-1"
        >
          Access Your Vault
          <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
