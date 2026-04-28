'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, UploadCloud, CheckCircle, ArrowLeft, FileText, Users, Home, Scale } from 'lucide-react';
import Link from 'next/link';

export default function VaultManage() {
  const [formData, setFormData] = useState({
    urgentActions: '',
    trustedContacts: '',
    physicalWorld: '',
    officialDocuments: ''
  });
  const [passphrase, setPassphrase] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'ENCRYPTING' | 'UPLOADING' | 'SUCCESS'>('IDLE');

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpload = async () => {
    if (!passphrase) return alert('Please enter a master passphrase to seal the vault.');
    
    try {
      setStatus('ENCRYPTING');
      const { encryptVaultData } = await import('../../../utils/encryption');
      
      const payloadString = JSON.stringify(formData);
      const encryptedPayload = await encryptVaultData(passphrase, payloadString);
      
      setStatus('UPLOADING');
      
      const res = await fetch('http://localhost:4000/api/vault/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vaultId: 'default-vault-uuid', 
          encryptedPayload: JSON.parse(encryptedPayload)
        })
      });

      if (!res.ok) throw new Error('Failed to upload');
      
      setStatus('SUCCESS');
    } catch (err) {
      console.error(err);
      alert('An error occurred during secure upload.');
      setStatus('IDLE');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 p-8 font-sans pb-24 overflow-hidden relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-6">
          <div>
            <Link href="/vault/dashboard" className="text-emerald-500 hover:text-emerald-400 flex items-center mb-4 transition-colors font-bold text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">Vault Structure Editor</h1>
            <p className="text-neutral-400 text-lg">Input your phased life-logic instructions.</p>
          </div>
          <Shield className="w-12 h-12 text-emerald-400 opacity-80 mt-6 md:mt-0" />
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl"
        >
          {status === 'SUCCESS' ? (
            <div className="text-center py-20">
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
              <h2 className="text-3xl font-bold text-white mb-4">Vault Sealed Successfully</h2>
              <p className="text-neutral-400 max-w-md mx-auto mb-8">Your structured instructions have been client-side encrypted and securely stored. Only your beneficiaries with the passphrase can unseal them.</p>
              <Link href="/vault/dashboard" className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 px-8 py-3 rounded-2xl font-bold hover:bg-emerald-600/30 transition-colors inline-block">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <FileText className="text-rose-400 mr-3 w-6 h-6" />
                  <h2 className="text-xl font-bold text-rose-300">Phase 1: Urgent Care Actions</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-4">What needs to be canceled, paused, or handled immediately? (e.g. Subscriptions, pets, rent)</p>
                <textarea 
                  value={formData.urgentActions}
                  onChange={(e) => handleChange('urgentActions', e.target.value)}
                  placeholder="- Cancel AWS Hosting Account (ID: 192837482)&#10;- Pause Property Insurance"
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                />
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Users className="text-blue-400 mr-3 w-6 h-6" />
                  <h2 className="text-xl font-bold text-blue-300">Phase 2: Trusted Contacts</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-4">Who should your beneficiaries contact for help? (e.g. Lawyers, accountants, close friends)</p>
                <textarea 
                  value={formData.trustedContacts}
                  onChange={(e) => handleChange('trustedContacts', e.target.value)}
                  placeholder="- Estate Lawyer: Sarah Jenkins (555-0192)&#10;- Accountant: John Doe"
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Home className="text-emerald-400 mr-3 w-6 h-6" />
                  <h2 className="text-xl font-bold text-emerald-300">Phase 3: Physical World</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-4">Where are important physical items located? (e.g. Safe combinations, hidden keys, ledgers)</p>
                <textarea 
                  value={formData.physicalWorld}
                  onChange={(e) => handleChange('physicalWorld', e.target.value)}
                  placeholder="- Safe Vault Combo: 04-12-88. Master key under the back porch."
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Scale className="text-amber-400 mr-3 w-6 h-6" />
                  <h2 className="text-xl font-bold text-amber-300">Phase 4: Official Documents</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-4">Links or instructions for official asset transfers. This is unlocked last via the failsafe mechanism.</p>
                <textarea 
                  value={formData.officialDocuments}
                  onChange={(e) => handleChange('officialDocuments', e.target.value)}
                  placeholder="- Transfer deeds and legal bindings are securely linked here..."
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                />
              </div>

              <div className="pt-8 border-t border-white/10">
                <label className="block text-sm font-bold text-neutral-300 mb-2">Master Passphrase (Zero-Knowledge)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input 
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter a strong passphrase to seal the vault..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <p className="text-xs text-amber-500 mt-2 font-medium">Warning: We do not store this passphrase. If lost, the manual cannot be unsealed.</p>
              </div>

              <button 
                onClick={handleUpload}
                disabled={status !== 'IDLE'}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center group"
              >
                {status === 'IDLE' && <><UploadCloud className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" /> Encrypt & Seal Structured Vault</>}
                {status === 'ENCRYPTING' && 'Performing AES-GCM Encryption...'}
                {status === 'UPLOADING' && 'Securing to Local Storage...'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
