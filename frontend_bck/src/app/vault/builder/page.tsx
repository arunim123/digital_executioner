'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { encryptVaultData } from '../../../utils/encryption';

const CATEGORIES = [
  {
    id: 'physical',
    title: 'Physical World',
    prompt: 'Where are your important physical items located?',
    example: 'e.g. The spare house key is buried by the back porch under the fake rock. The safe combination is 04-12-88.',
  },
  {
    id: 'people',
    title: 'Trusted People',
    prompt: 'Who should your family reach out to in critical moments?',
    example: 'e.g. Call Uncle Ben for legal advice. My estate lawyer is Sarah Jenkins (555-0192).',
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    prompt: 'What recurring fees do you want paused to prevent charges?',
    example: 'e.g. AWS Hosting (account 1928), Netflix, and the property insurance premium. Passwords are in the red notebook.',
  },
  {
    id: 'logic',
    title: 'Life Logic',
    prompt: 'Any personal messages or final instructions?',
    example: 'e.g. Do not sell the cabin. Take care of the dogs. I love you all endlessly.',
  }
];

export default function VaultBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [passphrase, setPassphrase] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleNext = () => {
    if (currentStep < CATEGORIES.length) setCurrentStep(curr => curr + 1);
  };

  const handleUpload = async () => {
    setIsEncrypting(true);
    try {
      // 1. Package the form data cleanly
      const manualContent = JSON.stringify(formData);
      
      // 2. Zero-Knowledge Pipeline Encryption
      const purelyEncryptedString = await encryptVaultData(passphrase, manualContent);
      
      // 3. Send securely to AWS KMS Upload Backend Endpoint 
      // await fetch('/api/vault/upload', {
      //   method: 'POST', body: JSON.stringify({ vaultId: 'mock-uuid', encryptedPayload: purelyEncryptedString })
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate transmission latency

      setUploadComplete(true);
    } catch(err) {
      console.error(err);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <div className="flex-1 max-w-4xl w-full mx-auto p-8 pt-12">

        {!uploadComplete ? (
          <>
            <div className="mb-10 flex flex-col justify-center text-center">
              <Heart className="w-10 h-10 text-indigo-500 mx-auto mb-4 drop-shadow-sm" />
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Family Instruction Manual</h1>
              <p className="text-neutral-500 mt-2 text-lg">Documenting your life logic provides immense peace of mind to the people who matter most.</p>
              
              {/* Category Breadcrumbs / Progress */}
              <div className="flex justify-center space-x-2 mt-8">
                {CATEGORIES.map((cat, idx) => (
                  <div key={cat.id} className={`h-2 rounded-full transition-all duration-300 ${currentStep >= idx ? 'w-12 bg-indigo-500' : 'w-4 bg-neutral-200'}`} />
                ))}
                <div className={`h-2 rounded-full transition-all duration-300 ${currentStep === CATEGORIES.length ? 'w-12 bg-green-500' : 'w-4 bg-neutral-200'}`} />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {currentStep < CATEGORIES.length ? (
                  <motion.div 
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                    className="p-10 flex flex-col h-full justify-between"
                  >
                    <div>
                      <h2 className="text-sm uppercase tracking-widest font-bold text-indigo-500 mb-2">Category {currentStep + 1} of 4</h2>
                      <h3 className="text-2xl font-bold text-neutral-800 mb-2">{CATEGORIES[currentStep].title}</h3>
                      <p className="text-neutral-600 font-medium mb-6">{CATEGORIES[currentStep].prompt}</p>
                      
                      <textarea 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-neutral-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-48 resize-none placeholder:text-neutral-400"
                        placeholder={CATEGORIES[currentStep].example}
                        value={formData[CATEGORIES[currentStep].id] || ''}
                        onChange={(e) => setFormData({ ...formData, [CATEGORIES[currentStep].id]: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex justify-end mt-8">
                      <button 
                        onClick={handleNext} 
                        className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 px-8 rounded-full shadow-md flex items-center transition-transform active:scale-95"
                      >
                        Save & Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="encryption-step"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px] bg-gradient-to-br from-indigo-50 to-white"
                  >
                    <ShieldCheck className="w-16 h-16 text-indigo-500 mb-6 drop-shadow-md" />
                    <h2 className="text-2xl font-bold text-neutral-800 mb-4">Secure Your Manual</h2>
                    <p className="text-neutral-600 mb-8 max-w-md">Your instructions will be irrevocably encrypted on your device. We can never read them.</p>

                    <div className="max-w-xs w-full mb-8">
                       <input 
                          type="password" 
                          className="w-full bg-white border border-neutral-200 shadow-sm rounded-xl p-4 focus:ring-4 focus:ring-indigo-500/20 text-center mb-2"
                          placeholder="Master Encryption Passphrase"
                          value={passphrase}
                          onChange={(e) => setPassphrase(e.target.value)}
                        />
                        <p className="text-xs text-neutral-400 font-medium">Do not lose this passphrase.</p>
                    </div>

                    <button 
                      onClick={handleUpload}
                      disabled={!passphrase || isEncrypting}
                      className="w-full max-w-xs bg-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition duration-200 active:scale-95 flex items-center justify-center disabled:opacity-70"
                    >
                      {isEncrypting ? "Encrypting Locally..." : "Protect my family's future"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/10 border border-green-100">
              <ShieldCheck className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight mb-4">Manual Safely Encrypted</h1>
            <p className="text-xl text-neutral-500 max-w-lg mb-8">
               Your instruction manual has been successfully transmitted via zero-knowledge pipeline ensuring your privacy remains perfect.
            </p>
            <button className="bg-neutral-100 text-neutral-700 font-bold py-3 px-8 rounded-full hover:bg-neutral-200 transition-colors">
              Return to Security Dashboard
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
