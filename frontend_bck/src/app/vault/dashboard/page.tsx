'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, BookOpen, UserCheck, Flame, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function VaultDashboard() {
  const [streakDays, setStreakDays] = useState(42);
  const [healthStatus, setHealthStatus] = useState("HEALTHY"); // Toggles: HEALTHY, ESCALATING
  const [nextCheckIn, setNextCheckIn] = useState("3 Days");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Dev Only: Toggle Escalation locally
  const simulateEscalation = () => setHealthStatus("ESCALATING");

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating /check-in fetch
      setStreakDays(s => s + 1);
      setNextCheckIn("7 Days");
      setHealthStatus("HEALTHY");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch(err) {
      console.error(err);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleRevoke = async () => {
    try {
      // Calls POST /api/vault/revoke
      await new Promise(resolve => setTimeout(resolve, 500));
      setHealthStatus("HEALTHY");
      setNextCheckIn("7 Days");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch(err) {
      console.error(err);
    }
  }

  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVars = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-sans pb-24">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-12 flex justify-between items-end border-b border-neutral-800 pb-6 relative">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Family Instruction Manual</h1>
            <p className="text-neutral-400 text-lg">Monitoring your activity to ensure your loved ones are always protected.</p>
          </div>
          <div className="text-right flex items-center space-x-3">
             {/* Dev Tool Toggle */}
            <button onClick={simulateEscalation} className="text-xs text-neutral-600 hover:text-neutral-300">Test Escalation View</button>
            
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border shadow-sm backdrop-blur-md transition-colors ${healthStatus === 'HEALTHY' ? 'bg-neutral-800/80 border-neutral-700' : 'bg-orange-900/40 border-orange-700/50'}`}>
              <Shield className={`w-5 h-5 ${healthStatus === 'HEALTHY' ? 'text-green-400' : 'text-orange-400 animate-pulse'}`} />
              <span className={`font-semibold text-sm tracking-wide shadow-sm ${healthStatus === 'HEALTHY' ? 'text-green-400' : 'text-orange-400'}`}>SYSTEM {healthStatus}</span>
            </div>
          </div>
        </header>

        {/* Grace Window Revocation UI */}
        <AnimatePresence>
          {healthStatus === 'ESCALATING' && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} 
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-amber-900/20 border border-amber-600/30 rounded-2xl p-6 overflow-hidden flex flex-col md:flex-row items-center justify-between"
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-3 bg-amber-500/10 rounded-full mr-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-500 mb-1">Standard monitoring sequence paused</h3>
                  <p className="text-amber-200/80 text-sm max-w-lg">
                    Your automated safety checks are advancing towards unlocking the manual for your beneficiaries. 
                    Would you like to pause the sequence and restore standard monitoring?
                  </p>
                </div>
              </div>
              <button 
                onClick={handleRevoke}
                className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors flex items-center justify-center whitespace-nowrap active:scale-95 duration-200"
              >
                <ShieldCheck className="w-5 h-5 mr-2" />
                Restore Security State
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVars} initial="hidden" animate="show">
          <motion.div variants={itemVars} className="bg-gradient-to-br from-neutral-800 to-neutral-850 rounded-2xl p-6 border border-neutral-700 shadow-xl col-span-1 md:col-span-2 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <Flame size={200} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-300 flex items-center mb-1">
                <Flame className="w-5 h-5 text-orange-500 mr-2" />
                Family Security Streak
              </h2>
              <p className="text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
                Checking in frequently keeps the manual secure and extends the failsafe timer.
              </p>
            </div>
            
            <div className="flex items-baseline space-x-3 relative z-10">
              <span className="text-7xl font-extrabold text-white tracking-tighter drop-shadow-md">{streakDays}</span>
              <span className="text-2xl text-neutral-400 font-medium">Days</span>
            </div>
            
            <div className="mt-8 relative h-14">
              <AnimatePresence>
                {!showSuccess ? (
                  <motion.button 
                    key="checkInBtn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCheckIn}
                    disabled={isCheckingIn}
                    className="absolute inset-0 w-full sm:w-auto bg-white hover:bg-neutral-200 text-neutral-900 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg active:scale-95 duration-200 disabled:opacity-50 text-left sm:text-center"
                  >
                    {isCheckingIn ? 'Processing Life Line...' : 'I\'m well - Extend timer'}
                  </motion.button>
                ) : (
                  <motion.div
                    key="successMsg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center text-green-400 font-semibold"
                  >
                    <CheckCircle className="w-6 h-6 mr-2" /> Security Updated
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-300 flex items-center mb-1">
                <Clock className="w-5 h-5 text-indigo-400 mr-2" />
                Escalation Timer
              </h2>
              <p className="text-sm text-neutral-400">Next automated health ping.</p>
            </div>
            
            <div className="mt-8 mb-4">
              <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 36 36">
                  <path className="text-neutral-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-indigo-500" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">{nextCheckIn}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
