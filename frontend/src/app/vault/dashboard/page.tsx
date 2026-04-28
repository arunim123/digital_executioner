'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, Flame, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function VaultDashboard() {
  const [streakDays, setStreakDays] = useState(42);
  const [healthStatus, setHealthStatus] = useState("HEALTHY"); 
  const [nextCheckIn, setNextCheckIn] = useState("3 Days");
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const completionPercentage = 75;

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    await new Promise(resolve => setTimeout(resolve, 800)); 
    setStreakDays(s => s + 1);
    setNextCheckIn("7 Days");
    setHealthStatus("HEALTHY");
    setIsCheckingIn(false);
  };

  const handleRevoke = async () => {
    setHealthStatus("HEALTHY");
    setNextCheckIn("7 Days");
  };

  const isSafe = healthStatus === "HEALTHY";
  const glowShadow = isSafe ? "shadow-[0_0_30px_rgba(52,211,153,0.15)]" : "shadow-[0_0_30px_rgba(251,191,36,0.2)]";
  const accentColor = isSafe ? "text-emerald-400" : "text-amber-400";
  const borderGlow = isSafe ? "border-emerald-500/30" : "border-amber-500/40";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 p-8 font-sans pb-24 overflow-hidden relative">
      <div className={`absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 ${isSafe ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row justify-between md:items-end border-b border-white/5 pb-6">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">Family Instruction Manual</h1>
            <p className="text-neutral-400 text-lg">Monitoring your activity to ensure your loved ones are always protected.</p>
          </div>
          <div className="flex items-center space-x-4 self-start md:self-auto">
            <button onClick={() => setHealthStatus(isSafe ? "ESCALATING" : "HEALTHY")} className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Test Escalation View</button>
            <a href="/vault/manage" className="text-xs font-bold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-4 py-2 rounded-full border border-emerald-500/30 transition-colors">Manage Vault</a>
            <div className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border backdrop-blur-xl ${borderGlow} bg-white/5 ${glowShadow} transition-all duration-500`}>
              <Shield className={`w-5 h-5 ${accentColor}`} />
              <span className={`font-bold tracking-wider ${accentColor}`}>SYSTEM {healthStatus}</span>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {!isSafe && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-amber-950/40 backdrop-blur-md border border-amber-500/30 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between shadow-[0_0_40px_rgba(251,191,36,0.15)]"
            >
              <div className="flex items-center mb-6 md:mb-0">
                <div className="p-4 bg-amber-500/20 rounded-full mr-5 border border-amber-500/40">
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-1 tracking-wide">Standard monitoring sequence paused</h3>
                  <p className="text-amber-200/70 text-sm max-w-lg leading-relaxed">
                    Automated safety checks are advancing towards unlocking the manual for your beneficiaries. 
                    Would you like to pause the sequence and restore standard monitoring?
                  </p>
                </div>
              </div>
              <button 
                onClick={handleRevoke}
                className="w-full md:w-auto bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-300 font-bold py-3.5 px-8 rounded-2xl transition-all flex items-center justify-center whitespace-nowrap active:scale-95 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                <ShieldCheck className="w-5 h-5 mr-2" />
                Restore Security State
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isSafe && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-black/40 border border-white/5 rounded-3xl p-8 relative">
                <div className="absolute left-10 top-12 bottom-12 w-0.5 bg-neutral-800" />
                
                <h3 className="text-xl font-bold text-white mb-8 ml-4">Escalation Timeline</h3>
                
                <div className="space-y-8 relative">
                  
                  <div className="flex items-start">
                    <div className="bg-rose-500 rounded-full p-1.5 mr-6 relative z-10 shadow-[0_0_15px_rgba(244,63,94,0.5)] mt-1">
                      <div className="w-3 h-3 bg-black rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-rose-400 font-bold text-lg">T-0: Missed Heartbeat</h4>
                      <p className="text-neutral-400 text-sm mt-1">The automated check-in window expired without a response.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-amber-500 rounded-full p-1.5 mr-6 relative z-10 shadow-[0_0_15px_rgba(251,191,36,0.5)] mt-1 animate-pulse">
                      <div className="w-3 h-3 bg-amber-200 rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-amber-400 font-bold text-lg">T+12 Hours: Emergency Contact Ping <span className="ml-3 text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30">PENDING</span></h4>
                      <p className="text-neutral-400 text-sm mt-1">An automated SMS alert will be sent to your primary emergency contact requesting a manual check-in.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-neutral-700 rounded-full p-1.5 mr-6 relative z-10 mt-1">
                      <div className="w-3 h-3 bg-neutral-900 rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-neutral-500 font-bold text-lg">T+24 Hours: Phase 1 Unseal <span className="ml-3 text-xs bg-neutral-800 text-neutral-500 px-2 py-1 rounded-full border border-neutral-700">LOCKED</span></h4>
                      <p className="text-neutral-500 text-sm mt-1">Urgent care instructions (subscriptions, pets) will be unlocked for beneficiaries.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-neutral-700 rounded-full p-1.5 mr-6 relative z-10 mt-1">
                      <div className="w-3 h-3 bg-neutral-900 rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-neutral-500 font-bold text-lg">T+90 Days: Full Payload Distribution <span className="ml-3 text-xs bg-neutral-800 text-neutral-500 px-2 py-1 rounded-full border border-neutral-700">LOCKED</span></h4>
                      <p className="text-neutral-500 text-sm mt-1">Legal and official documents are securely transmitted to your executor.</p>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl col-span-1 md:col-span-2 relative overflow-hidden group">
            <div className={`absolute -right-12 -top-12 opacity-5 pointer-events-none transition-all duration-700 ${isSafe ? 'text-emerald-500' : 'text-amber-500 group-hover:opacity-10 scale-110'}`}>
              <Flame size={240} />
            </div>
            
            <h2 className="text-lg font-bold text-neutral-300 flex items-center mb-2">
              <Flame className={`w-5 h-5 mr-3 ${isSafe ? 'text-emerald-400' : 'text-amber-400'}`} />
              Family Security Streak
            </h2>
            <p className="text-sm text-neutral-400/80 max-w-sm mb-8 leading-relaxed">Checking in frequently keeps the manual secure and extends the failsafe timer.</p>
            
            <div className="flex items-baseline space-x-3 mb-10 relative z-10">
              <span className={`text-8xl font-black tracking-tighter drop-shadow-xl ${isSafe ? 'text-emerald-400' : 'text-amber-400'}`}>{streakDays}</span>
              <span className="text-2xl text-neutral-500 font-bold uppercase tracking-widest">Days</span>
            </div>
            
            <button 
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className={`w-full sm:w-auto font-bold py-4 px-10 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 border relative z-10 ${isSafe ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}
            >
              {isCheckingIn ? 'Processing Life Line...' : "I'm well - Extend timer"}
            </button>
          </motion.div>

          <motion.div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col justify-between items-center text-center">
            <div className="w-full text-left mb-6">
              <h2 className="text-lg font-bold text-neutral-300 flex items-center mb-2">
                <Clock className="w-5 h-5 text-blue-400 mr-3" />
                DMS Timer
              </h2>
              <p className="text-sm text-neutral-400/80">Next automated health ping</p>
            </div>
            
            <div className="relative w-48 h-48 mb-4">
              <motion.svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-white/5" strokeWidth="8" />
                <motion.circle 
                  cx="50" cy="50" r="45" fill="none" 
                  className="stroke-blue-500" strokeWidth="8" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 283" }}
                  animate={{ strokeDasharray: `${(283 * completionPercentage) / 100} 283` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </motion.svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white drop-shadow-md">{nextCheckIn}</span>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">Remaining</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
