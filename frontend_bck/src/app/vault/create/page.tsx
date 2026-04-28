'use client';

import React, { useState } from 'react';
import { encryptVaultData } from '../../../utils/encryption';

/**
 * Vault Creation - Altruistic Reframing ("Family Instruction Manual")
 * Follows progressive disclosure pattern.
 */
export default function VaultCreation() {
  const [step, setStep] = useState(1);
  const [passphrase, setPassphrase] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSealManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // ZERO KNOWLEDGE: Encrypt data client-side BEFORE sending to server
      // Passphrase never leaves the browser.
      const encryptedData = await encryptVaultData(passphrase, manualContent);
      
      // MOCK SERVER SUBMISSION
      console.log('Sending purely opaque ciphertext to server:', encryptedData);
      
      // Await fetch('/api/vault', { method: 'POST', body: JSON.stringify({ payload: encryptedData }) });
      
      alert("Your Family Instruction Manual has been securely sealed.");
      setStep(3); // Success Step
    } catch(err) {
      console.error(err);
      alert("Error sealing the manual.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-700">
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Your Family Instruction Manual</h1>
          <p className="text-neutral-400">Secure. Private. Failsafe. Provide peace of mind for the ones you love.</p>
        </header>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">What instructions do you want to leave?</label>
              <textarea 
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all h-40"
                placeholder="e.g., Where important documents are, access to accounts, messages to loved ones..."
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!manualContent}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Continue to Security Shield
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg mb-6 text-sm text-amber-200/80">
              <span className="font-bold flex items-center mb-1">🛡️ Zero-Knowledge Security</span>
              Your master passphrase is never stored or sent to our servers. If you lose it, we cannot recover your manual.
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Set Master Passphrase</label>
              <input 
                type="password"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Make it strong and memorable"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setStep(1)}
                className="w-1/3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleSealManual}
                disabled={!passphrase || isProcessing}
                className="w-2/3 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Sealing Vault...' : 'Seal & Encrypt Manual'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Manual Safely Encrypted</h2>
            <p className="text-neutral-400">Your instruction manual is now secure. The Dead Man's Switch (DMS) engine is monitoring your heartbeat.</p>
            <div className="pt-4 border-t border-neutral-800">
              <p className="text-sm font-medium text-indigo-400 mb-1">Family Security Streak</p>
              <p className="text-3xl font-bold text-white">🔥 1 Day</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
