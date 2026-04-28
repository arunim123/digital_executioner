'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, HeartHandshake, UploadCloud, FileText, LockOpen } from 'lucide-react';

export default function BeneficiaryVerify() {
  const [step, setStep] = useState(1);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleUploadID = () => {
    setStep(2);
    setIsDecrypting(true);
    // Simulate strictly local, zero-knowledge decryption happening within the client's browser
    setTimeout(() => {
      setIsDecrypting(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8 font-sans pb-24 text-neutral-800">
      <div className="max-w-4xl mx-auto mt-12">
        <header className="mb-10 text-center">
          <HeartHandshake className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-4xl font-serif text-neutral-900 mb-4">A Letter of Care</h1>
          <p className="text-neutral-500 max-w-xl mx-auto leading-relaxed">
            You have been nominated as a trusted beneficiary for a Family Instruction Manual. 
            This secure space contains vital information prepared with love to guide you when they cannot.
          </p>
        </header>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-lg border border-neutral-200 p-10 text-center max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-8 flex justify-center items-center text-neutral-800">
              <ShieldAlert className="w-5 h-5 text-indigo-500 mr-2" />
              Identity Verification
            </h2>
            <div 
              className="border-2 border-dashed border-indigo-200 rounded-2xl p-12 bg-indigo-50/20 hover:bg-indigo-50/50 transition-colors cursor-pointer group" 
              onClick={handleUploadID}
            >
              <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-neutral-700 font-medium">Click to upload Government Issued ID</p>
              <p className="text-neutral-400 text-sm mt-2">We respect your privacy. Verification takes seconds.</p>
            </div>
            <button className="mt-10 bg-neutral-900 text-white font-medium py-4 px-10 rounded-full hover:bg-neutral-800 transition-colors shadow-md active:scale-95 duration-200 w-full md:w-auto">
              Securely Authenticate
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {isDecrypting ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-neutral-200 shadow-lg text-center">
                <LockOpen className="w-14 h-14 text-rose-400 mx-auto mb-6 animate-pulse" />
                <h3 className="text-xl font-semibold text-neutral-800">Unsealing Phase 1 Instructions...</h3>
                <p className="text-neutral-500 mt-2 max-w-sm mx-auto">Locally decrypting the urgent actions payload using zero-knowledge architecture.</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden">
                  <div className="bg-rose-50 border-b border-rose-100 p-8 flex items-center">
                    <FileText className="text-rose-500 mr-4 w-8 h-8" />
                    <h2 className="text-2xl font-bold text-rose-900 tracking-tight">Urgent Care Actions</h2>
                  </div>
                  <div className="p-8">
                    <p className="text-neutral-600 mb-8 italic border-l-4 border-rose-300 pl-6 py-2 text-lg">
                      "If you are reading this, please first take care of yourselves. When you are ready, these are the immediate subscriptions that need attention so you don't get charged."
                    </p>
                    
                    <ul className="space-y-4">
                      <li className="flex items-center p-5 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-rose-100 transition-colors">
                        <div className="w-3 h-3 bg-rose-400 rounded-full mr-5 shadow-sm"></div>
                        <div>
                          <p className="font-bold text-neutral-800 text-lg">Cancel AWS Hosting Account</p>
                          <p className="text-sm text-neutral-500 mt-1">Account ID: 192837482</p>
                        </div>
                      </li>
                      <li className="flex items-center p-5 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-rose-100 transition-colors">
                        <div className="w-3 h-3 bg-rose-400 rounded-full mr-5 shadow-sm"></div>
                        <div>
                          <p className="font-bold text-neutral-800 text-lg">Pause Property Insurance Premium</p>
                          <p className="text-sm text-neutral-500 mt-1">Geico Policy: #PO-98239</p>
                        </div>
                      </li>
                    </ul>

                    <div className="mt-10 text-center">
                      <button className="bg-neutral-900 text-white font-medium py-4 px-8 rounded-xl shadow-md hover:bg-neutral-800 transition-colors">
                        Acknowledge Phase 1 Completion
                      </button>
                    </div>
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
