'use client';

import React, { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function MFAChallenge() {
  const [code, setCode] = useState('');

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center font-sans p-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl max-w-md w-full relative z-10 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
           <ShieldCheck className="w-10 h-10 text-emerald-400" />
        </div>
        
        <h1 className="text-2xl font-extrabold text-white mb-3">Authentication Required</h1>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          Please confirm your identity. MFA is required to protect your family's manual from unauthorized modifications.
        </p>

        <div className="space-y-6 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 mt-4">Authenticator Code</label>
            <input 
              type="text" 
              maxLength={6}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-center text-3xl tracking-[0.5em] focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-white/20"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          
          <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all flex items-center justify-center active:scale-95 group">
            Verify Identity <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
