'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, UploadCloud, FileText, LockOpen, Clock, Users, Home, Scale } from 'lucide-react';

export default function BeneficiaryVerify() {
  const [step, setStep] = useState(1);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const triggerDate = new Date("2026-01-01"); 
  const now = new Date("2026-04-13");
  const daysPassed = Math.floor((now.getTime() - triggerDate.getTime()) / (1000 * 3600 * 24));
  const phase4Unlocked = daysPassed >= 90;

  const handleUploadID = () => {
    setStep(2);
    setIsDecrypting(true);
    setTimeout(() => setIsDecrypting(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 p-8 font-sans pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto mt-12 relative z-10">
        <header className="mb-12 text-center">
          <HeartHandshake className="w-14 h-14 text-rose-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]" />
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">A Letter of Care</h1>
          <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed text-lg">
            You have been nominated as a trusted beneficiary for a Family Instruction Manual. 
            This secure space contains vital information prepared with love to guide you when they cannot.
          </p>
        </header>

        {step === 1 && (
          <motion.div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl text-center max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-8 flex justify-center items-center text-rose-400 tracking-wide">
              IDENTITY VERIFICATION
            </h2>
            <div onClick={handleUploadID} className="border-2 border-dashed border-rose-500/30 rounded-2xl p-12 bg-rose-500/5 hover:bg-rose-500/10 transition-colors cursor-pointer group mb-8">
              <UploadCloud className="w-12 h-12 text-rose-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-white font-medium text-lg">Upload Government ID</p>
              <p className="text-neutral-500 text-sm mt-2">Privacy respected. Verification completes zero-knowledge unseal.</p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {isDecrypting ? (
              <motion.div className="flex flex-col items-center justify-center p-24 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl text-center">
                <LockOpen className="w-16 h-16 text-rose-400 mx-auto mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
                <h3 className="text-2xl font-bold text-white">Unsealing Manual...</h3>
                <p className="text-neutral-400 mt-3 max-w-md mx-auto">Locally decrypting the payload using the zero-knowledge architecture.</p>
              </motion.div>
            ) : (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 overflow-hidden col-span-1 md:col-span-2">
                  <div className="bg-rose-500/20 border-b border-rose-500/30 p-6 flex items-center">
                    <FileText className="text-rose-400 mr-4 w-6 h-6" />
                    <h2 className="text-xl font-bold text-rose-300">Phase 1: Urgent Care Actions</h2>
                  </div>
                  <div className="p-8">
                    <p className="text-neutral-300 mb-6 italic border-l-4 border-rose-500/50 pl-6 py-2">
                      "Please first take care of yourselves. These are the immediate subscriptions that need attention so you don't get charged."
                    </p>
                    <ul className="space-y-3 text-neutral-300">
                      <li className="bg-black/30 p-4 rounded-xl border border-white/5">• Cancel AWS Hosting Account (ID: 192837482)</li>
                      <li className="bg-black/30 p-4 rounded-xl border border-white/5">• Pause Property Insurance (Geico: #PO-98239)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 overflow-hidden">
                  <div className="bg-blue-500/20 border-b border-blue-500/30 p-6 flex items-center">
                    <Users className="text-blue-400 mr-4 w-6 h-6" />
                    <h2 className="text-lg font-bold text-blue-300">Phase 2: Trusted Contacts</h2>
                  </div>
                  <div className="p-8 text-neutral-300 space-y-4">
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                       <p className="font-bold text-white">Estate Lawyer</p>
                       <p className="text-sm text-neutral-400">Sarah Jenkins: 555-0192</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 overflow-hidden">
                  <div className="bg-emerald-500/20 border-b border-emerald-500/30 p-6 flex items-center">
                    <Home className="text-emerald-400 mr-4 w-6 h-6" />
                    <h2 className="text-lg font-bold text-emerald-300">Phase 3: Physical World</h2>
                  </div>
                  <div className="p-8 text-neutral-300 space-y-4">
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                       <p className="font-bold text-white">Safe Vault</p>
                       <p className="text-sm text-neutral-400">Combo: 04-12-88. Master key under the back porch.</p>
                    </div>
                  </div>
                </div>

                <div className={`bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 overflow-hidden col-span-1 md:col-span-2 relative ${!phase4Unlocked && 'opacity-60 grayscale'}`}>
                  <div className="bg-amber-500/20 border-b border-amber-500/30 p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <Scale className="text-amber-400 mr-4 w-6 h-6" />
                      <h2 className="text-xl font-bold text-amber-300">Phase 4: Official Documents</h2>
                    </div>
                    {!phase4Unlocked && (
                      <div className="flex items-center text-amber-400/80 text-sm font-bold bg-amber-500/10 px-4 py-2 rounded-full">
                        <Clock className="w-4 h-4 mr-2" /> Unlocks in {90 - daysPassed} days
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    {phase4Unlocked ? (
                      <div className="bg-black/30 p-6 rounded-xl border border-amber-500/30 text-neutral-300">
                         Extracted Life Logic payload: Transfer deeds and legal bindings are securely linked here...
                      </div>
                    ) : (
                      <p className="text-neutral-500 italic text-center py-6">
                        System failsafes restrict access to Official Documents until the full 90 day cooldown has expired. 
                        This ensures a methodical and stress-free handover period.
                      </p>
                    )}
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
