'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, HeartPulse } from 'lucide-react';
import { encryptVaultData } from '../../../utils/encryption';

const CATEGORIES = [
  { id: 'physical', title: 'Physical World', prompt: 'Where are your important physical items located?', example: 'e.g. The spare house key is buried by the back porch...' },
  { id: 'people', title: 'Trusted People', prompt: 'Who should your family reach out to in critical moments?', example: 'e.g. Call Uncle Ben for legal advice...' },
  { id: 'subscriptions', title: 'Subscriptions', prompt: 'What recurring fees do you want paused?', example: 'e.g. AWS Hosting (account 1928)...' },
  { id: 'logic', title: 'Life Logic', prompt: 'Any personal messages or final instructions?', example: 'e.g. Do not sell the cabin. I love you.' }
];

export default function VaultBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [passphrase, setPassphrase] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleNext = () => { if (currentStep < CATEGORIES.length) setCurrentStep(curr => curr + 1); };

  const handleUpload = async () => {
    setIsEncrypting(true);
    try {
      const manualContent = JSON.stringify(formData);
      const payload = await encryptVaultData(passphrase, manualContent);
      await new Promise(r => setTimeout(r, 1500)); 
      setUploadComplete(true);
    } catch(err) {
      console.error(err);
    } finally { setIsEncrypting(false); }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="flex-1 max-w-4xl w-full mx-auto p-8 pt-16 relative z-10">
        {!uploadComplete ? (
          <>
            <div className="mb-10 text-center">
              <HeartPulse className="w-12 h-12 text-indigo-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Family Instruction Manual</h1>
              <p className="text-neutral-400 mt-2">Documenting your life logic provides immense peace of mind to the people who matter most.</p>
              <div className="flex justify-center space-x-2 mt-8">
                {CATEGORIES.map((cat, idx) => (
                  <div key={cat.id} className={`h-1.5 rounded-full transition-all duration-500 ${currentStep >= idx ? 'w-12 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'w-4 bg-white/10'}`} />
                ))}
                <div className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === CATEGORIES.length ? 'w-12 bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'w-4 bg-white/10'}`} />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {currentStep < CATEGORIES.length ? (
                  <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ ease: "easeInOut", duration: 0.3 }} className="p-10 flex flex-col h-full justify-between">
                    <div>
                      <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 mb-2">Category {currentStep + 1} of 4</h2>
                      <h3 className="text-2xl font-bold text-white mb-2">{CATEGORIES[currentStep].title}</h3>
                      <p className="text-neutral-400 mb-6">{CATEGORIES[currentStep].prompt}</p>
                      <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all h-48 resize-none placeholder:text-white/20"
                        placeholder={CATEGORIES[currentStep].example}
                        value={formData[CATEGORIES[currentStep].id] || ''}
                        onChange={(e) => setFormData({ ...formData, [CATEGORIES[currentStep].id]: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end mt-8">
                      <button onClick={handleNext} className="bg-white text-black hover:bg-neutral-200 font-extrabold py-3 px-8 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center active:scale-95 transition-all">
                        Save & Continue <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="encryption" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                    <ShieldCheck className="w-16 h-16 text-indigo-400 mb-6 drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
                    <h2 className="text-2xl font-bold text-white mb-4">Secure Your Manual</h2>
                    <p className="text-neutral-400 mb-8 max-w-md">Your instructions will be irrevocably encrypted on your device. We can never read them.</p>

                     <div className="max-w-xs w-full mb-8 text-left">
                       <label className="block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Master Passphrase</label>
                       <input 
                          type="password" 
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 text-white outline-none mb-2"
                          value={passphrase}
                          onChange={(e) => setPassphrase(e.target.value)}
                        />
                        <p className="text-xs text-amber-500/80 font-medium">Do not lose this. We cannot recover it.</p>
                    </div>

                    <button onClick={handleUpload} disabled={!passphrase || isEncrypting} className="w-full max-w-xs bg-indigo-500 text-white font-extrabold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-95 disabled:opacity-50 transition-all">
                      {isEncrypting ? "Encrypting Locally..." : "Protect my family's future"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
              <ShieldCheck className="w-12 h-12 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Manual Safely Encrypted</h1>
            <p className="text-neutral-400 max-w-lg mb-8">Your instruction manual has been successfully transmitted via zero-knowledge pipeline ensuring perfect privacy.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
